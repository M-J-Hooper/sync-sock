/*global sync, io*/

(function(sync, io) {
    function updateFromData(data) {
        document.getElementById("a").value = data.a;
        document.getElementById("b").value = data.b;
        document.getElementById("c").value = data.c;
    }
    
    sync(io).then(function(data) {
        console.log(data);
        updateFromData(data);
    });
})(sync, io);