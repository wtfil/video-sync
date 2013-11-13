var Exoskeleton = require('exoskeleton'),
    Player = require('./player'),
    router,
    FormView,
    App, app;

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
        url: '/candidate?candidate=' + JSON.stringify(e.candidate)
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

FormView = Exoskeleton.View.extend({

    events: {
        'submit': 'onSubmit'
    },

    onSubmit: function (e) {
        var val = this.el.querySelector('input').value;
        e.preventDefault();
        Exoskeleton.utils.ajax({
            type: 'POST',
            url: '/video?url=' +  encodeURIComponent(val),
            success: function (data) {
                router.navigate('room/' + data.roomId, {trigger: true});
            },
            error: function (data) {
                console.error(data.response);
            }
        });
    }
});

App = Exoskeleton.View.extend({
    initialize: function () {
        this._content = this.el.querySelector('.app__content');
    },

    update: function (view) {
        var child = this._content.childNodes[0];
        if (child) {
            this._content.replaceChild(view.el, this._content.childNodes[0]);
        } else {
            this._content.appendChild(view.el);
        }
    },

    showRoom: function (id) {
        var player = new Player({id: id});
        this.update(player);
        player.start();
    }
    
});


router = new (Exoskeleton.Router.extend({
    routes: {
        '': function () {
            console.log(arguments);
        },
        'room/:id': function (id) {
            app.showRoom(id);
        }
    }
}))();

window.addEventListener('load', function () {
    new FormView({el: document.querySelector('.search')});    
    app = new App({el: document.querySelector('.app')});
    Exoskeleton.history.start({pushState: true, root: '/'});
});
