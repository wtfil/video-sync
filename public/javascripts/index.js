var Exoskeleton = require('exoskeleton');  


var FormView = Exoskeleton.View.extend({

    events: {
        'submit': 'onSubmit'
    },

    onSubmit: function (e) {
        var val = this.el.querySelector('input').value;
        e.preventDefault();
        Exoskeleton.utils.ajax({
            url: '/video?url=' +  encodeURIComponent(val),
            success: function (data) {
                Exoskeleton.history.navigate('room/' + data.roomId);
            }
        });
    }
});

window.addEventListener('load', function () {
    new FormView({el: document.querySelector('.search')});    
})

/*c
var Youtube = require('./youtube'),
    io = require('socket.io-client'),
    socket = io.connect('http://localhost'),
    jt = require('jt'),
    master = false;

window.addEventListener('load', function () {
    document.querySelector('.search')
        .addEventListener('submit', function(e) {
            e.preventDefault();
            console.log()
    });    
}, false);

socket.emit('register', {pageId: 1});
socket.on('register', function (data) {
    master = data.master;
});
socket.on('video', function (data) {
    var time = data.time + (Date.now() - data.timestamp) / 1000 + 0.4;
    console.log('video change');
    console.log(data.time, time);
    p.seek(time);
});
var p = new Youtube('UwXSHnb7XnA')
p.ready(function () {
    p.play();
    p.change(function (data) {
        if (master) {
            console.log('change');
            socket.emit('video', {
                time: data.time,
                timestamp: Date.now()
            })
        }
    })
})
*/