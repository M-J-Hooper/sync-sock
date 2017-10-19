module.exports = function(serv, fns) {
    var io = require('socket.io')(serv, {});
    var enrich = require('enrich-js');
    
    if(!fns.get) throw new Error('sync-sock needs a get function!');
    
    io.sockets.on('connection', function(socket) {
        console.log('Connected');
        
        var data = enrich(fns.get());
        
        //incoming change from some client to be sent to other clients for syncing
        socket.on('change', function(changeData) {
            console.log('Incoming change', changeData);
            
            //data.commit('change', changeData);
            //fns.persist(data.revert());
        });

        //socket.on('disconnect', function() {});
        
        
        socket.emit('init', data.revert());
    });
    
    return io;
};