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
app.get('/game1/:roomId/:clientId', function (request, response) {
    if (isNaN(request.params.roomId)) {
        response.redirect('/');
    } else {
        var roomIdInt = parseInt(request.params.roomId);
        var clientId = parseInt(request.params.clientId);
        if (roomIdInt >= 1000 && roomIdInt <= 9999) {
            if (clientId == 0)
                response.sendFile(__dirname + '/views/game1_index.html');
            else if (clientId <= 4)
                response.sendFile(__dirname + '/views/game1_client.html');
            else
                response.redirect('/game1');
        } else {
            response.redirect('/game1');
        }
    } 
});
app.get('/game4/:roomId/:clientId', function (request, response) {
    if (isNaN(request.params.roomId)) {
        response.redirect('/');
    } else {
        var roomIdInt = parseInt(request.params.roomId);
        var clientId = parseInt(request.params.clientId);
        if (roomIdInt >= 1000 && roomIdInt <= 9999) {
            if (clientId == 0)
                response.sendFile(__dirname + '/views/game4_index.html');
            else if (clientId <= 4)
                response.sendFile(__dirname + '/views/game4_client.html');
            else
                response.redirect('/game4');
        } else {
            response.redirect('/game4');
        }
    } 
});
app.get('/game1', function (request, response) {
    var randomRoomNum = Math.floor((Math.random() * 9000) + 1000).toString();
    var roomList = io.sockets.adapter.rooms;
    while (roomList[randomRoomNum] !== undefined) {
        randomRoomNum = Math.floor((Math.random() * 9000) + 1000).toString();
    }
    response.redirect('/game1/' + randomRoomNum + '/0');
});
app.get('/game4', function (request, response) {
    var randomRoomNum = Math.floor((Math.random() * 9000) + 1000).toString();
    var roomList = io.sockets.adapter.rooms;
    while (roomList[randomRoomNum] !== undefined) {
        randomRoomNum = Math.floor((Math.random() * 9000) + 1000).toString();
    }
    response.redirect('/game4/' + randomRoomNum + '/0');
});
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
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
