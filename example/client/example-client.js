/*global sync, io*/

(function(sync, io) {
    sync(io, {
        view: function(updateData) { //update dom with updated data
            document.getElementById("a").value = updateData.a;
            document.getElementById("b").value = updateData.b;
            document.getElementById("c").value = updateData.c;
        }
    }).then(function(data) {
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