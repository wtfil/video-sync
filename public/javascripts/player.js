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

                var p = new Youtube(id, response.videoId);

                p.ready(function () {
                    /*p.play();*/
                });

                /*
                socket.on('sync', function (data) {
                     
                });
                */
                socket.on('change', function (data) {
                    console.log('change', JSON.stringify(data), p._player.getPlayerState());
                    if (data.state === 1) {
                        console.log('1')
                        if (p._player.getPlayerState() === -1) {
                            console.log(2);
                            p.play();
                        }
                        p.seek(data.time);
                    }
                    /*p.seek(data.time);*/
                });
                p.change(socket.emit.bind(socket, 'change'));
            }
        });

    }
});

