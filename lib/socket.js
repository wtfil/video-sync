var socketIo = require('socket.io'),
    storage = require('./storage');

exports.listen = function (server) {
    var io = socketIo.listen(server);
    io.sockets.on('connection', function (socket) {
        var roomId;
        socket.on('room.connect', function (data) {
            roomId = data.roomId;
            socket.join(data.roomId);
        });

        socket.on('change', function (data) {
            socket.broadcast.to(roomId).emit('change', data);
        });
        socket.on('sync', function () {
            socket.broadcast.to(roomId).emit('sync');
        });

    });
}
