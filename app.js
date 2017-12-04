var express = require('express'),
    http = require('http'),
    port = process.argv[2] || 8000,
    io = require('socket.io'),
    jsonfile = require('jsonfile');

var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname));
app.use('/scripts', express.static(__dirname + '/node_modules'));

server.listen(port, function (err) {
    if(!err) console.log('Listening on: ' + port);
})

var socket = io.listen(server);

var sessions = 0;
socket.on('connection', function( socket ) {
    console.log("Starting data collection: ");
    var all_data = [];

    socket.on('metadata', function (data) {
        console.log(data)
    })

    socket.on('userEvent', function( data ) {
        console.log(data);
        all_data.push(data);
    })

    socket.on('disconnect', function( socket ) {
        console.log("Interaction session ended. Attempting to push to database.");
        sessions++;
        console.log(all_data);
        
        jsonfile.writeFile('interaction-data.json', all_data, function (err) {
            console.error(err);
        });
    })
})
