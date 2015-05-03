var socket = io('ws://' + window.location.hostname + ':8000/');
var sessionId = null;
var clientId = null;
var startTime = 0;
var clientScore = [0, 0, 0, 0];

socket.on('register', function(data) {
    console.log('Received register: ' + data);
    sessionId = data;
    clientId = getClientId();
});
socket.on('swing', function(recvClientId, data, time) {
    console.log('Received swing: from id ' + recvClientId + ', ' + data);
    if (clientId == 0) { // If at main screen, do work
        if (time >= startTime && time <= startTime + 5000 && data > clientScore[recvClientId])
            clientScore[recvClientId] = data;
    }
});

function sendSwing(swing) {
    console.log('Send swing: ' + swing);
    socket.emit('swing', clientId, swing, Date.now());
}

function getSessionId() {
    var pageURL = document.URL;
    var n = pageURL.search(/\/session\/.*\//);
    if (n != -1) {
        return pageURL.substring(n + 9, pageURL.length - 2);
    } else {
        return null;
    }
}

function getClientId() {
    var pageURL = document.URL;
    var clientId = parseInt(pageURL.substr(pageURL.length - 1));
    if (isNaN(clientId))
        return null;
    else
        return clientId;
}

function registerSession() {
    var sId = getSessionId();
    var cId = getClientId();
    if (sId !== null && cId !== null) {
        socket.emit('register', sId);
    } else {
        console.log('Session ID and/or client ID is null!');
    }
}

function startGame_ScreenSide() {
    clientScore = [0, 0, 0, 0];
    for (var i = 1; i <= 4; ++i)
        for (var j = 1; j <= 3; ++j)
            document.getElementById('GameButton' + i + '_' + j).setAttribute('class', 'btn btn-lg btn-remote');
    startTime = Date.now();
    setTimeout(showResult, 5000);
    console.log("Start game");
}

function init() {
    registerSession();
    sessionId = getSessionId();
    clientId = getClientId();
    if (clientId != 0) {
        if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
            window.addEventListener('devicemotion', deviceMotionHandler, false);
            startGame_Mobile();
        } else {
            console.log('Not supported on your device or browser.  Sorry.');
        }
    }
}

init();