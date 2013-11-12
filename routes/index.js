var stotage = require('../lib/stotage');

/*
 * GET home page.
 */
exports.index = function (req, res) {
	res.render('index');
};

exports.room = function (req, res) {
    
	res.render('room', {roomId: 125});
}

/**
 * Ajax. Create new room be video url
 */
exports.video = function (req, res) {
	var url = req.query.url;
    stotage.set(url, function (err, roomId) {
        res.json({roomId: roomId});
    });
};

