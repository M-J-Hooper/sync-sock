var express = require('express');
var app = express();
var serv = require('http').Server(app);

var sync = require('../index.js');

var data = {
    a: 'Wow this is some String data',
    b: 'I\'m some more data',
    c: 'Hey, I\'m the best bit of data'
};
var persistent = [data];

sync(serv, {
    getData: function() { //get from db etc.
        return data;
    },
    persist: function(dataToPersist) { //write to db etc.
        persistent.push(dataToPersist);
    }
});


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

var port = process.env.PORT || 3000;
serv.listen(port);
console.log('Example server started on port ' + port);