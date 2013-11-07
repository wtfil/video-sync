var io = require('socket.io'),
    mongoose = require('mongoose'),
    Page = mongoose.model('Page', {
        id: Number
    });

var p = new Page({id: 1});
console.log(p);

module.exports = function (server) {
    io = io.listen(server);
    io.sockets.on('connection', function (socket) {
        socket.on('register', function (data) {
            var master = false,
                page;
            if (!pages[data.pageId]) {
                master = true;
                pages[data.pageId] = [];
            }
            page = pages[data.pageId];
            if (page.indexOf(socket) === -1) {
                page.push(socket);
            }
            socket.emit('register', {
                master: master
            });
        });
        socket.on('latency', function (data) {
            console.log(Date.now() - data.server);
            console.log(Date.now() - data.client);
        });
        socket.on('video', function (data) {
            var page;
            Object.keys(pages).some(function (pageId) {
                var p = pages[pageId];
                if (
                    p.some(function (item) {
                        return item.id === socket.id;
                    })
                ) {
                    page = p;
                    return true;
                }
            });
            page.forEach(function (item) {
                if (item.id !== socket.id) {
                    item.emit('video', data);
                }
            })
        });
    });

    return io;
}
