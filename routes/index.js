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
exports.setVideo = function (req, res) {

    stotage.set(req.query.url, function (err, roomId) {
        if (err) {
            return res.send(err.message, 500);
        }
        res.json({roomId: roomId});
    });
};

exports.getVideo = function (req, res) {
    var roomId = req.query.roomId;
    stotage.get(roomId, function (err, videoId) {
        if (err) {
            res.send(err.message, 500);
        }
        res.json({videoId: videoId});
    })
}

