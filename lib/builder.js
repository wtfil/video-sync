var fs = require('fs'),
    browserify = require('browserify');

module.exports = function (static) {
    return function (req, res, next) {
        
        if (!/.js$/.test(req.url)) {
            return next();
        }

        var filename = static + req.url,
            b = browserify(),
            bundle;

        b.add(filename);
        bundle = b.bundle();
        bundle.on('error', function (err) {
            res.end('throw new Error("' + err.message + '")');
        });
        bundle.pipe(res);
    }
}
