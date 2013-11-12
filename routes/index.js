var stotage = require('../lib/stotage');

/*
 * GET home page.
 */
exports.index = function (req, res) {
	res.render('index', { title: 'Express' });
};

/**
 * Ajax. Create new room be video url
 */
exports.video = function (req, res) {
	var url = req.query.url;
    stotage.set(url, function (err, roomId) {
        res.json({roomId: roomId});
    });
};

exports.room = function () {
	res.render('index', { title: 'Express' });
}
