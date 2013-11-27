(function (global, document) {
    var handlers = [],
        slice = handlers.slice,
        script = document.createElement('script'),
        main = document.querySelectorAll('script')[0];
    
    script.src = 'https://www.youtube.com/iframe_api';
    main.parentNode.insertBefore(script, main);

    global.onYouTubeIframeAPIReady = function () {
        handlers.forEach(function (handler) {
            handler();
        });
    }
    
    function Youtube (domId, videoId) {
        var _this = this,
            args = arguments;

        if (!global.YT) {
            handlers.push(function () {
                Youtube.apply(_this, args);
            });
            return;
        }

        this._player = new YT.Player(domId, {
            height: '390',
            width: '640',
            videoId: videoId,
            events: {
                onReady: function () {
                    _this._onReady();
                },
                onStateChange: this._onChange.bind(this)
            }
        });
        console.log(this._player)
    }

    Youtube.prototype._method = function (method) {
        if (!this._player) {
            throw new Error('player is not loaded yed. Use .ready() method');
        }
        if (arguments.length > 1) {
            return this._player[method].apply(this._player, slice.call(arguments, 1));
        }
        return this._player[method]();
    }
    Youtube.prototype._onReady = function () {};
    Youtube.prototype._onChangeHandler = function () {};
    Youtube.prototype._onChange = function (e) {
        if (this._eventDontFire) {
            this._eventDontFire = false;
            return;
        }
        this._onChangeHandler(this.status());
    }
    Youtube.prototype.change = function (fn) {
        this._onChangeHandler = fn.bind(this);
    }
    Youtube.prototype.ready = function (fn) {
        this._onReady = fn.bind(this, this);
    }
    Youtube.prototype.play = function () {
        this._eventDontFire = true;
        this._method('playVideo');
    }
    Youtube.prototype.state = function () {
        return this._method('getPlayerState');
    }
    Youtube.prototype.pause = function () {
        this._eventDontFire = true;
        this._method('pauseVideo');
    }
    Youtube.prototype.status = function () {
        return {
            time: this._player.getCurrentTime(),
            state: this.state()
        }
    }
    Youtube.prototype.changeVideo = function (videoId) {
        this._method('loadVideoById', videoId);
    }
    Youtube.prototype.mute = function () {
        this._method('mute');
    }
    Youtube.prototype.seek = function (time) {
        var start = Date.now(),
            _this = this;
        this._eventDontFire = true;
        this._method('seekTo', time);
        // correcting video position
        setTimeout(function () {
            var currentTime = _this._method('getCurrentTime'),
                timeOffset = (Date.now() - start) / 1000;
            if (timeOffset - (currentTime - time) > 0.3) {
                _this.seek(time + timeOffset);
            }
        }, 1000);
    }

    module.exports = Youtube;
}(window, document));
