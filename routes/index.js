var stotage = require('../lib/stotage');

/*
 * GET home page.
 */
exports.index = function (req, res) {
	res.render('index', { title: 'Express' });
};

exports.getVideo = function (req, res) {
	var url = req.query.url,
		roomId = stotage.set(url);
	res.json({roomId: roomId});
};
