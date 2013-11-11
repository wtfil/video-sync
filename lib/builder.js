var browserify = require('browserify');

module.exports = function (static) {
    return function (req, res, next) {
        
        if (!/.js$/.test(req.url)) {
            return next();
        }

        var filename = static + req.url,
            b = browserify({ignoreMissing: true}),
            bundle;

        b.add(filename);
        bundle = b.bundle({ignoreMissing: true});
        bundle.on('error', function (err) {
           res.end('throw new Error("' + err.message + '")');
        });
        bundle.pipe(res);
    }
}
