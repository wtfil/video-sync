var browserify = require('browserify'),
    through = require('through'),
    transform = require('react-tools').transform;

function showError(code, err) {
    var l = err.lineNumber -1,
        sp = code.split(/\n/),
        st = err.message + '\n\n', i;

    for(i = l - 2; i <= l + 2; i++) {
        st += (l === i ? '--> ' : '    ') + sp[i] + '\n';
    }
    return st;
}
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
                } catch (err) {
                    var message = showError(data, err);
                    console.error(message);
                    code = 'console.error("' + message.replace(/\n/g, '\\n') + '")';
                }
                this.queue(code);
                this.queue(null);
            }
        });
        bundle = b.bundle({debug: true});
        bundle.on('error', function (err) {
            console.trace(err);
            res.end('throw new Error("' + err.message + '")');
        });
        bundle.pipe(res);
    }
}
