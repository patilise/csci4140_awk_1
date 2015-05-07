var express = require('express');
var path = require('path');
var http = require('http');
var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var server = app.listen(server_port, server_ip_address, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});

var io = require('socket.io')(server);
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/favicons', express.static(path.join(__dirname, 'public', 'favicons')));
app.use('/fonts', express.static(path.join(__dirname, 'public', 'fonts')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.get('/session/:roomId/:clientId', function (request, response) {
    if (isNaN(request.params.roomId)) {
        response.redirect('/');
    } else {
        var roomIdInt = parseInt(request.params.roomId);
        var clientId = parseInt(request.params.clientId);
        if (roomIdInt >= 1000 && roomIdInt <= 10000) {
            if (clientId == 0)
                response.sendFile(__dirname + '/views/index.html');
            else if (clientId <= 4)
                response.sendFile(__dirname + '/views/client.html');
            else
                response.redirect('/');
        } else {
            response.redirect('/');
        }
    } 
});
app.get('/session_dontmove/:roomId/:clientId', function (request, response) {
    if (isNaN(request.params.roomId)) {
        response.redirect('/');
    } else {
        var roomIdInt = parseInt(request.params.roomId);
        var clientId = parseInt(request.params.clientId);
        if (roomIdInt >= 1000 && roomIdInt <= 10000) {
            if (clientId == 0)
                response.sendFile(__dirname + '/views/dontmove.html');
            else if (clientId <= 4)
                response.sendFile(__dirname + '/views/dontmove_client.html');
            else
                response.redirect('/');
        } else {
            response.redirect('/');
        }
    } 
});
app.get('/', function (request, response) {
    var randomRoomNum = Math.floor((Math.random() * 10000) + 1).toString();
    var roomList = io.sockets.adapter.rooms;
    while (roomList[randomRoomNum] !== undefined) {
        randomRoomNum = Math.floor((Math.random() * 10000) + 1).toString();
    }
    response.redirect('/session/' + randomRoomNum + '/0');
});

io.on('connection', function (socket) {
    console.log('New user connected');
    
    socket.on('disconnect', function() {
        console.log('User disconnected');
    });
    socket.on('register', function (sId, cId) {
        socket.join(sId);
        console.log('register: ' + sId + ' ' + cId);
        for (var roomNum in socket.rooms) {
            if (socket.rooms[roomNum] != socket.id) {
                io.to(socket.rooms[roomNum]).emit('register', sId, cId);
            }
        }
    });
    socket.on('swing', function (clientId, data, time) {
        console.log('swing: id ' + clientId + ', data ' + data + ', time ' + time);
        for (var roomNum in socket.rooms) {
            if (socket.rooms[roomNum] != socket.id) {
                io.to(socket.rooms[roomNum]).emit('swing', clientId, data, time);
            }
        }
    });
});
