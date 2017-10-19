module.exports = function(serv, fns) {
    var io = require('socket.io')(serv, {});
    
    if(!fns.getData) throw new Error('sync-sock needs a getData function!');
    
    io.sockets.on('connection', function(socket) {
        console.log('Connected');
        
        var data = fns.getData();
        
        //socket.on('change', function(command) {});

        //socket.on('disconnect', function() {});
        
        
        socket.emit('init', data);
    });
    
    return io;
};