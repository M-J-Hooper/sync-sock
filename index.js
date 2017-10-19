module.exports = function(serv) {
    var io = require('socket.io')(serv, {});

    io.sockets.on('connection', function(socket) {
        socket.on('change', function(command) {});

        socket.on('disconnect', function() {});
    });
};