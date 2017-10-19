/*global sync, io*/

(function(sync, io) {
    sync(io).then(function(data) {
        console.log(data);
    });
})(sync, io);