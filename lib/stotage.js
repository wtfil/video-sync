var mongoose = require('mongoose'),
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
        url: String
    }), Room;

    Room = mongoose.model('Room', RoomSchema);
    
    storage.get = function (url, done) {
        Room.find({url: url}, done);
    };
    storage.set = function (url, done) {
        var room = new Room({url: url});
        room.save(function (err, room) {
            done(err, room && room.id);
        });
    }
	
}
mongoose.connect('mongodb://localhost/test', function (err) {
	err ? noDb() : db();
});

module.exports = storage;
