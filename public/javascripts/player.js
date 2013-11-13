var Exoskeleton = require('Exoskeleton'),
    Youtube = require('./youtube');

module.exports = Exoskeleton.View.extend({
    initialize: function (options) {
        this._roomId = options.id;

            var PeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection;
            var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.RTCSessionDescription;

            var s = new PeerConnection({iceServers: [{ url: 'stun:localhost:3000' }]});
            s.onicecandidate = function f(e) {
                if (f.callen) {
                    return;   
                }
                f.callen = true;
                Exoskeleton.utils.ajax({
                    type: 'POST',
                    url: '/candidate?candidate=' + JSON.stringify(e.candidate) + '&roomId=' + options.id
                });
            }
            s.onaddstream = function () {
                console.log('onaddstream', arguments);
            }
            s.createOffer(function (desc) {
                console.log('create offer', arguments);
                s.setLocalDescription(desc);
            });
            /*s.createAnswer(s.remoteDescription,function () {*/
            /*console.log('create another', arguments);*/
            /*})*/
            s.onmessage = function () {
                console.log('on massage', arguments);
            }

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

