var Exoskeleton = require('Exoskeleton'),
    Youtube = require('./youtube');

function signal(roomId, data) {
    Exoskeleton.utils.ajax({
        type: 'POST',
        url: '/signal?data=' + JSON.stringify(data) + '&roomId=' + roomId
    });
}
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

                var PeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection;
                var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.RTCSessionDescription;

                var DATA_CHANNEL_OPTIONS = {
                    optional: [{
                        RtpDataChannels: true
                    }, {
                        DtlsSrtpKeyAgreement: true
                    }]
                };
                var SERVERS = {
                    iceServers: [{ url: 'stun:stun.l.google.com:19302' }]
                }
                var s = new PeerConnection(SERVERS, DATA_CHANNEL_OPTIONS);
                var c = s.createDataChannel('stream', {});

                c.onopen = function () {
                    console.log('data channel opened');
                }
                c.onclose = function () {
                    console.log('data channel closed');
                }
                c.onmessage = function () {
                    console.log('data channel message', arguments);
                }
                s.onicecandidate = function f(e) {
                    signal(_this._roomId, {candidate: e.candidate});
                }
                s.onaddstream = function () {
                    console.log('onaddstream', arguments);
                }
                s.ondatachannel = function () {
                    console.log('RTC create channel');
                }

                console.log('CALLER', !response.signals.length);
                // caller
                if (!response.signals.length) {
                    s.createOffer(function (desc) {
                        console.log('create offer', arguments);
                        s.setLocalDescription(desc);
                        signal(_this._roomId, {sdp: desc});
                    });
                } else {

                    /*
                    s.createAnswer(s.remoteDescription,function () {
                        console.log('create another', arguments);
                    });
                    */

                    response.signals.forEach(function (signal) {
                        var data = JSON.parse(signal);
                        if (data.sdp) {
                            s.setRemoteDescription(new SessionDescription(data.sdp));
                        } else {
                            s.addIceCandidate(new RTCIceCandidate(data.candidate));
                        }
                    });
                } 
            }
        });

    }
});

