var Youtube = require('./youtube'),
    io = require('socket.io-client'),
    socket = io.connect('http://localhost'),
    master = false;

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
    /*p.seek(44);*/
})
