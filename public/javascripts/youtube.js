(function (global, document, undefined) {
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
                'onReady': this._onReady,
                'onStateChange': this._onChange.bind(this)
            }
        });
    }

    Youtube.prototype._method = function (method) {
        if (!this._player) {
            throw new Error('player is not loaded yed. Use .ready() method');
        }
        if (arguments.length > 1) {
            return this._player[method](slice.call(arguments, 1));
        }
        this._player[method]();
    }
    Youtube.prototype._onReady = function () {};
    Youtube.prototype._onChangeHandler = function () {};
    Youtube.prototype._onChange = function () {
        this._onChangeHandler({
            time: this._player.getCurrentTime()
        });
    }
    Youtube.prototype.change = function (fn) {
        this._onChangeHandler = fn.bind(this);
    }
    Youtube.prototype.ready = function (fn) {
        this._onReady = fn.bind(this, this);
    }
    Youtube.prototype.play = function () {
        this._method('playVideo');
    }
    Youtube.prototype.seek = function (time) {
        this._method('seekTo', time);
    }

    module.exports = Youtube;
}(window, document));
