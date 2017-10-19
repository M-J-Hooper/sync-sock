/*global enrich*/

var sync = function(io, fns) {
    if(!io) throw new Error('Socket.IO missing!');
    var socket = io();
    
    if(!fns.view) throw new Error('sync-sock-client needs an view function!');
    
    return new Promise(function(resolve, reject) {
       socket.on('init', function(initData) {
            console.log('Initial data', initData);
           
            var data = enrich(initData);
            fns.view(data);
            
            //data changed on client so send to server for syncing elsewhere
            data.on('change', function(changeData) {
                console.log('Outgoing change', changeData);
                socket.emit('change', changeData);    
            });
            
            //incoming change from other client or server
            socket.on('change', function(changeData) {
                console.log('Incoming change', changeData);
                //data.commit('change', changeData);
                fns.view(changeData);
            });
              
            resolve(data);
       });
    });
};