var express = require('express');
var app = express();
var serv = require('http').Server(app);


//sync-sock setup

var sync = require('../index.js');

var data = { //fake user data to keep in sync
    a: 'Wow this is some String data',
    b: 'I\'m some more data',
    c: 'Hey, I\'m the best bit of data'
};
var persistent = [data]; //fake persistent data storage

sync(serv, {
    getData: function(socket) { //get from db etc.
        return persistent[persistent.length - 1];
    },
    getRoom: function(socket) {
        return "A nice little room";
    },
    persistData: function(dataToPersist) { //write to db etc.
        persistent.push(dataToPersist);
    }
    //persistRate: 4
});


//standard server setup

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

var port = process.env.PORT || 3000;
serv.listen(port);
console.log('Example server started on port ' + port);