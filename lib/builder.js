var browserify = require('browserify'),
    through = require('through'),
    transform = require('react-tools').transform;

module.exports = function (static) {
    return function (req, res, next) {
        
        if (!/.js$/.test(req.url)) {
            return next();
        }

        var filename = static + req.url,
            b = browserify(),
            bundle;

        b.add(filename);
        b.transform(function (file) {
            var data = '';
            return through(write, end)
            function write (buf) { data += buf }
            function end () {
                var code;
                try {
                    code = transform(data);
                } catch (e) {
                    console.trace(err);
                    code = 'throw new Error("' + err.message + '")';
                }
                this.queue(code);
                this.queue(null);
            }
        });
        bundle = b.bundle();
        bundle.on('error', function (err) {
            console.trace(err);
            res.end('throw new Error("' + err.message + '")');
        });
        bundle.pipe(res);
    }
}
