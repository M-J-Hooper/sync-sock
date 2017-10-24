module.exports = function(serv, methods) {
    var io = require('socket.io')(serv, {});
    var enrich = require('enrich-js');
    
    if(!methods.getData) throw new Error('sync-sock needs a getData function!');
    
    io.sockets.on('connection', function(socket) {
        console.log('Connected');
        var data = enrich(methods.getData(socket));
        var room = methods.getRoom ? methods.getRoom(socket) : "global";
        
        var persistCounter = 0;
        var persistRate = methods.persistRate === undefined ? 1 : methods.persistRate;
        function persist() {
            if(methods.persistData && persistCounter % persistRate == 0) {
                methods.persistData(data.revert());
                persistCounter++;
                console.log('Data persisted');
            }
        }
        
        //incoming event from some client to be sent to other clients for syncing
        function socketHandlerFactory(event) {
            return function(eventData) {
                console.log('Incoming ' + event, eventData);
                data[event](eventData);
                
                persist();
                
                //emit to clients in room exluding sender
                //socket.broadcast.to(room).emit(event, eventData);
                socket.broadcast.emit(event, eventData);
            };
        }
        
        socket.join(room);
        
        for(var event of ['change', 'undo', 'redo']) {
            socket.on('sync-sock-' + event, socketHandlerFactory(event));
        }
        
        socket.emit('sync-sock-init', data.revert());
    });
    
    return io;
};