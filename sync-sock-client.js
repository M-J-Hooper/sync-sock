/*global enrich*/

var sync = function(io, fns) {
    if(!io) throw new Error('Socket.IO missing!');
    
    var socket = io();
    
    return new Promise(function(resolve, reject) {
       socket.on('init', function(data) {
            data = enrich(data);
              
            resolve(data);
       });
    });
};