var mongoose = require('mongoose'),
    url = require('url'),
	storage = {};

function noDb() {
	var pages = [];
	storage.get = function(id) {
		return pages[id] || null;
	}
	storage.set = function(url) {
		return pages.push(url) - 1;
	}
}
function db() {
    var RoomSchema = mongoose.Schema({
        videoId: String,
        candidate: String
    }), Room;

    Room = mongoose.model('Room', RoomSchema);
    
    storage.get = function (id, done) {
        Room.findById(id, function (err, result) {
            done(err, result);
        });
    };
    storage.set = function (videoUrl, done) {
        var parse = url.parse(videoUrl, true),
            videoId,
            room;

        if (parse.host && parse.host.indexOf('youtube') !== -1 && parse.query.v) {
            videoId = parse.query.v;
        } else if (/^\w{11}$/.test(videoUrl)) {
            videoId = videoUrl;
        } else {
            return done(new Error('Invalid video id'));
        }

        room = new Room({videoId: videoId});
        room.save(function (err, room) {
            done(err, room && room.id);
        });
    }
    storage.setCandidate = function(roomId, candidate, done) {
        Room.update({_id: roomId}, {candidate: candidate}, function (err, num) {
            done(err);
        })
    }
	
}
mongoose.connect('mongodb://localhost/test', function (err) {
	err ? noDb() : db();
});

module.exports = storage;
