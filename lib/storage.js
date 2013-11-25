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
storage.set = function (params, done) {
    var parse = url.parse(params.videoUrl, true),
        videoId,
        room;

    if (parse.host && parse.host.indexOf('youtube') !== -1 && parse.query.v) {
        videoId = parse.query.v;
    } else if (/^\w{11}$/.test(videoUrl)) {
        videoId = videoUrl;
    } else {
        return done(new Error('Invalid video id'));
    }

    if (params.roomId) {
        return Room.update({_id: params.roomId}, {videoId: videoId}, function (err) {
            console.log(arguments);
            done(err, {videoId: videoId});
        });   
    }

    room = new Room({videoId: videoId});
    room.save(function (err, room) {
        done(err, room && room.id);
    });
}
	
module.exports = storage;
