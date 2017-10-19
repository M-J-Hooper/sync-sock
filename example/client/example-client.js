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
        
        document.getElementById("a").addEventListener('input', function(e) {
            data.a = this.value;
        });
        document.getElementById("b").addEventListener('input', function(e) {
            data.b = this.value;
        });
        document.getElementById("c").addEventListener('input', function(e) {
            data.c = this.value;
        });
    });
})(sync, io);