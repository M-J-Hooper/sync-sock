/*global enrich, io*/

var sync = function(methods) {
    if(!io) throw new Error('Socket.IO not found!');
    var socket = io();
    
    if(!methods.updateView) throw new Error('sync-sock-client needs an updateView function!');
    
    
    return new Promise(function(resolve, reject) {
        socket.on('sync-sock-init', function(initData) {
            console.log('Initial data', initData);
           
            var data = enrich(initData);
            methods.updateView(data);
            
            //client event so send to server for syncing elsewhere
            function dataHandlerFactory(event) {
                return function(eventData) {
                    console.log('Outgoing ' + event, eventData);
                    socket.emit('sync-sock-' + event, eventData);    
                    methods.updateView(data);
                };
            }
            
            //incoming event from other client or server
            function socketHandlerFactory(event) {
                return function(eventData) {
                    console.log('Incoming ' + event, eventData);
                    
                    var args = [eventData]; //undo/redo need different args
                    if(event != 'change') args.unshift(false);
                    
                    data[event].apply(data, args);
                    methods.updateView(data);
                };
            }
            
            for(var event of ['change', 'undo', 'redo']) {
                data.on(event, dataHandlerFactory(event));
                socket.on('sync-sock-' + event, socketHandlerFactory(event));
            }
            resolve(data);
        });
    });
};