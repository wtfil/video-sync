var Exoskeleton = require('Exoskeleton'),
    Youtube = require('./youtube');

module.exports = Exoskeleton.View.extend({
    initialize: function (options) {
        this._roomId = options.id;
    },
    start: function () {
        var id = 'id' + Date.now(),
            _this = this;

        this.el.id = id;

        Exoskeleton.utils.ajax({
            url: '/video?roomId=' + this._roomId,
            success: function (response) {
                var p = _this._player = new Youtube(id, response.videoId);
                p.ready(function () {
                    
                })
            }
        });

    }
});

