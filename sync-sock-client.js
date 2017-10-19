/*global enrich*/

var sync = function(io) {
    if(!io) throw new Error('Socket.IO missing!');
    
    var socket = io();
    
    return new Promise(function(resolve, reject) {
       socket.on('init', function(initData) {
            var data = enrich(initData);
            
            data.on('change', function(changeData) {
                socket.emit('change', changeData);    
            });
              
            resolve(data);
       });
    });
};