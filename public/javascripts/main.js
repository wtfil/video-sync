;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Youtube = require('./youtube');

},{"./youtube":2}],2:[function(require,module,exports){
var Youtube = (function (global, document, undefined) {
    var handlers = [],
        script = document.createElement('script'),
        main = document.querySelectorAll('script')[0];
    
    script.src = 'https://www.youtube.com/iframe_api';
    main.parentNode.insertBefore(script, main);

    global.onYouTubeIframeAPIReady = function () {
        handlers.forEach(function (handler) {
            handler();
        });
    }
    
    function Youtube (id) {
        var _this = this,
            args = arguments;

        if (!global.YT) {
            handlers.push(function () {
                Youtube.apply(_this, args);
            });
            return;
        }

        this._onReady = this._onReady || function () {};
        this._player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: id,
            events: {
                'onReady': this._onReady,
                'onStateChange': this.change
            }
        });
    }

    Youtube.prototype._method = function (method) {
        if (!this._player) {
            throw new Error('player is not loaded yed. Use .ready() method');
        }
        return this._player[method]();
    }
    Youtube.prototype.change = function () {}
    Youtube.prototype.ready = function (fn) {
        this._onReady = fn.bind(this, this);
    }
    Youtube.prototype.play = function () {
        this._method('playVideo');
    }

    return Youtube;
}(window, document));




var p = new Youtube('M7lc1UVf-VE')
p.ready(function () {
    p.play();
})

},{}]},{},[1])
;