module.exports = function(serv, fns) {
    var io = require('socket.io')(serv, {});
    var enrich = require('enrich-js');
    
    if(!fns.getData) throw new Error('sync-sock needs a getData function!');
    
    io.sockets.on('connection', function(socket) {
        console.log('Connected');
        
        var data = enrich(fns.getData());
        
        socket.on('change', function(command) {
            fns.persist(data.revert());
        });

        //socket.on('disconnect', function() {});
        
        
        socket.emit('init', data.revert());
    });
    
    return io;
};