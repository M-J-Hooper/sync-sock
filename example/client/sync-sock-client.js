/*global enrich, io*/

var sync = function(fns) {
    if(!io) throw new Error('Socket.IO not found!');
    var socket = io();
    
    if(!fns.updateView) throw new Error('sync-sock-client needs an updateView function!');
    
    return new Promise(function(resolve, reject) {
       socket.on('init', function(initData) {
            console.log('Initial data', initData);
           
            var data = enrich(initData);
            fns.updateView(data);
            
            //data changed on client so send to server for syncing elsewhere
            data.on('change', function(changeData) {
                console.log('Outgoing change', changeData);
                
                socket.emit('change', changeData);    
            });
            
            //incoming change from other client or server
            socket.on('change', function(changeData) {
                console.log('Incoming change', changeData);
                
                //data.change('change', changeData);
                fns.updateView(changeData);
            });
              
            resolve(data);
       });
    });
};