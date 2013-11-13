var stotage = require('../lib/stotage');

/*
 * GET home page.
 */
exports.index = function (req, res) {
	res.render('index');
};

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
    stotage.get(roomId, function (err, result) {
        if (err) {
            res.send(err.message, 500);
        }
        res.json(result);
    })
}

exports.setCandidate = function (req, res) {
    var candidate = req.query.candidate,
        roomId = req.query.roomId;

    stotage.setCandidate(roomId, candidate, function () {
        res.end();
    });
}
