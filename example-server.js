var express = require('express')
var app = express();
var serv = require('http').Server(app);

var sync = require('../index.js');
var data = sync(serv);


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

var port = process.env.PORT || 3000;
serv.listen(port);
console.log('Server started on port ' + port);