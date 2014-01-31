/** @jsx React.DOM */
var Exoskeleton = require('exoskeleton'),
    /*Youtube = require('./youtube'),*/
    React = require('react-tools/build/modules/react'),
    io = require('socket.io-client'),
    socket = io.connect('http://localhost'),
    playerModel;

/*
Exoskeleton.utils.ajax({
    url: 'http://gdata.youtube.com/feeds/api/videos/' + response.videoId,
    success: function (xml) {
        console.log(xml.match(/<title type='text'>(.*)<\/title>/)[1]);
    }
});
*/

var model = new (Exoskeleton.Model.extend({
    initialize: function () {
        this.set({
            rev: 0,
            theirRev: 0
        });
    },
    update: function (params) {
        console.log('updating model', JSON.stringify(params));
        var data = this.toJSON();
        if (Math.abs(params.time - data.time) < 1) {
            return;
        }
        params.rev = data.rev + 1;
        this.set(params);
    },
    sync: function (params) {
        var data = this.toJSON();
        if (data.rev === params.rev) {
            console.log('sync model reject', JSON.stringify(params));
            return;
        }
        params.theirRev = data.theirRev + 1;
        console.log('sync model accept', JSON.stringify(params));
        this.set(params);
    },
    get: function () {
        var params = this.toJSON();
        return {
            time: params.time,
            state: params.state,
            rev: params.rev
        }
    }
}));

socket.on('sync', function () {
    console.log('sending  sync')
    socket.emit('change', model.get());
});
socket.on('change', function (data) {
    console.log('reciving changes:', JSON.stringify(data));
    model.sync(data); 
});
model.on('change', function () {
    console.log('sending changes', JSON.stringify(model.get()));
    socket.emit('change', model.get());
});

var CreatePlayer = (function() {
    function create(opts, callback) {
        var player = new YT.Player(opts.domId, {
                videoId: opts.videoId,
                height: 390,
                windth: 640,
                events: {
                    onReady: function () {
                        console.log('html5', !player.cueVideoByFlashvars);
                        track();
                        callback(player);
                    },
                    onStateChange: function () {
                        onChange.apply(player);
                    }
                }
            }),
            onChange = function () {};

        function track() {
            var time = null,
                interval = 200;

            var intervalId = setInterval(function () {
                if (player.getPlayerState() !== 1) {
                    return;
                }
                var newTime = player.getCurrentTime();
                if (!time) {
                    time = newTime;
                    return;
                }
                if (Math.abs(newTime - time) > 1) {
                    onChange();
                }
                time = newTime;
            }, 200);

        }
        player.onChange = function (fn) {
            onChange = fn;
        }

        return player;


    }
    return function(opts, callback) {

        if (window.onYouTubeIframeAPIReady) {
            return create(opts, callback);
        }

        var script = document.createElement('script'),
            main = document.querySelectorAll('script')[0];

        script.src = 'https://www.youtube.com/iframe_api';
        main.parentNode.insertBefore(script, main);

        window.onYouTubeIframeAPIReady = function () {
            return create(opts, callback);
        };
    }
}());

module.exports = React.createClass({
    componentDidMount: function () {
        var id = 'id' + Date.now(),
            _this = this;
        this.getDOMNode().id = id;

        socket.emit('room.connect', {roomId: this.props.roomId});

        Exoskeleton.utils.ajax({
            url: '/video?roomId=' + this.props.roomId,
            success: function (response) {

                CreatePlayer({domId: id, videoId: response.videoId}, function (p) {

                    model.on('change:theirRev', function () {
                        var data = model.get();
                        if (data.state === 1) {
                            p.playVideo();
                        } else if (data.state === 2) {
                            p.pauseVideo();
                        } 
                        p.seekTo(data.time);
                        console.log('changed time', model.get().time);
                    });
                    socket.emit('sync');
                    p.onChange(function (e) {
                        // 2 — pause
                        // 1 — play
                        var state = p.getPlayerState();
                        if (state === 1 || state === 2) {
                            model.update({
                                time: p.getCurrentTime(),
                                state: state
                            });
                        }
                    });

                });
                /*
                var p = new Youtube(id, response.videoId);
                _this._youtube = p;

                socket.on('sync', function () {
                    console.log('ping change');
                    socket.emit('change', p.status());
                });

                socket.on('change', function (data) {
                    console.log('pong change', data);
                    p.sync(data);
                });

                /*
                p.change(function (data) {
                    console.log('ping chnage', data)
                    socket.emit('change', data);
                });
                */
            }
        });
    },
    /*changeVideo: function (videoId) {*/
        /*socket.emit('change', {videoId: videoId});*/
        /*this._youtube.changeVideo(videoId);*/
        /*},*/
    render: function () {
        return <div></div>
    }
});
