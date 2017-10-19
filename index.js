module.exports = function(serv, options) {
    var io = require('socket.io')(serv, {});
    var enrich = require('enrich-js');
    
    if(!options.getData) throw new Error('sync-sock needs a getData function!');
    
    io.sockets.on('connection', function(socket) {
        console.log('Connected');
        
        var persistCounter = 0;
        var persistRate = options.persistRate || 1;
        var data = enrich(options.getData());
        
        //incoming change from some client to be sent to other clients for syncing
        socket.on('change', function(changeData) {
            console.log('Incoming change', changeData);
            
            //data.change('change', changeData);
            if(options.persistData && persistCounter%persistRate == 0) {
                options.persistData(data.revert());
                console.log('Data persisted');
            }
        });

        //socket.on('disconnect', function() {});
        
        
        socket.emit('init', data.revert());
    });
    
    return io;
};