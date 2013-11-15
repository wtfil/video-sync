var mongoose = require('mongoose'),
    url = require('url'),
    RoomSchema, Room,
    noop = function () {},
	storage = {};

mongoose.connect('mongodb://localhost/test');

RoomSchema = mongoose.Schema({
    videoId: String
});

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
	
module.exports = storage;
