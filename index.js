module.exports = function(serv, methods) {
    var io = require('socket.io')(serv, {});
    var enrich = require('enrich-js');
    var data = {};
    
    if(!methods.getData) throw new Error('sync-sock needs a getData function!');
    
    io.sockets.on('connection', function(socket) {
        console.log('Connected');
        var room = methods.getRoom ? methods.getRoom(socket) : "global";
        
        if(data[room]) persist(); //new connection needs up-to-date data
        else data[room] = enrich(methods.getData(socket));
        
        var persistCounter = 0;
        var persistRate = methods.persistRate === undefined ? 1 : methods.persistRate;
        function persist() {
            if(methods.persistData && persistCounter % persistRate == 0) {
                methods.persistData(data[room].revert(), room);
                persistCounter++;
            }
        }
        
        //incoming event from some client to be sent to other clients for syncing
        function socketHandlerFactory(event) {
            return function(eventData) {
                console.log('Incoming ' + event, eventData);
                
                var args = [eventData]; //undo/redo need different args
                if(event != 'change') args.unshift(false);
                
                data[room][event].apply(data[room], args);
                persist();
                
                //emit to all clients in room exluding sender
                socket.broadcast.to(room).emit('sync-sock-' + event, eventData);
            };
        }
        
        socket.join(room);
        for(var event of ['change', 'undo', 'redo']) {
            socket.on('sync-sock-' + event, socketHandlerFactory(event));
        }
        socket.emit('sync-sock-init', data[room].revert());
    });
    
    return io;
};