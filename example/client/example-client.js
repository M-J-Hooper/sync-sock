/*global sync, io*/

(function(sync, io) {
    sync({
        updateView: function(updateData) { //update dom with updated data
            document.getElementById("a").value = updateData.a;
            document.getElementById("b").value = updateData.b;
            document.getElementById("c").value = updateData.c;
        }
    }).then(function(data) {
        console.log("Connected and init data fetched");
        
        //once initial data fetched,
        //setup dom listeners to change data object
        //(here data has change-tracking, undo, redo, etc. via enrich-js)
        
        document.getElementById("a").addEventListener('input', function() {
            data.a = this.value;
        });
        document.getElementById("b").addEventListener('input', function() {
            data.b = this.value;
        });
        document.getElementById("c").addEventListener('input', function() {
            data.c = this.value;
        });
        document.getElementById("undo").onclick = function() {
            data.undo();
        };
        document.getElementById("redo").onclick = function() {
            data.redo();
        };
    });
})(sync, io);