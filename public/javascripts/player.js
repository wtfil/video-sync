var Exoskeleton = require('Exoskeleton'),
    Youtube = require('./youtube'),
    io = require('socket.io-client'),
    socket = io.connect('http://localhost');

module.exports = Exoskeleton.View.extend({
    initialize: function (options) {
        this._roomId = options.id;
    },
    start: function () {
        var id = 'id' + Date.now(),
            _this = this;

        this.el.id = id;
        socket.emit('room.connect', {roomId: this._roomId});

        Exoskeleton.utils.ajax({
            url: '/video?roomId=' + this._roomId,
            success: function (response) {

                Exoskeleton.utils.ajax({
                    url: 'http://gdata.youtube.com/feeds/api/videos/' + response.videoId,
                    success: function (xml) {
                        console.log(xml.match(/<title type='text'>(.*)<\/title>/)[1]);
                    }
                });

                var p = new Youtube(id, response.videoId);
                _this._youtube = p;

                socket.on('sync', function () {
                    socket.emit('change', p.status());
                });

                socket.on('change', function (data) {
                    console.log('change', data);
                    if (data.videoId) {
                        p.changeVideo(data.videoId);
                        return;
                    }
                    if (data.state === 1) {
                        p.seek(data.time);
                        p.play();
                    } else if (data.state === 2) {
                        p.pause();
                    }
                });

                p.change(socket.emit.bind(socket, 'change'));
            }
        });
    },
    changeVideo: function (videoId) {
        socket.emit('change', {videoId: videoId});
        this._youtube.changeVideo(videoId);
    }

});
