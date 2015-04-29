var socket = io('ws://' + window.location.hostname + ':8000/');
var sessionId = null;
var clientId = null;
socket.on('register', function(data) {
    console.log('Received register: ' + data);
    sessionId = data;
    clientId = getClientId();
});
socket.on('swing', function(recvClientId, data) {
    console.log('Received swing: from id ' + recvClientId + ', ' + data);
    if (clientId == 0) { // If at main screen, do work
        setScoreByStrength(recvClientId, data);
    }
});

function sendSwing(swing) {
    console.log('Send swing: ' + swing);
    socket.emit('swing', clientId, swing);
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

function init() {
    registerSession();
    sessionId = getSessionId();
    clientId = getClientId();
    if (clientId != 0) {
        if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
            window.addEventListener('devicemotion', deviceMotionHandler, false);
        } else {
            console.log('Not supported on your device or browser.  Sorry.');
        }
    }
}

init();