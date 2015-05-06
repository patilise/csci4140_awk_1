var socket = io('ws://' + window.location.hostname + ':8000/');
var sessionId = null;
var clientId = null;
var startTime = 0;
var clientScore = [0, 0, 0, 0];
var winner = 0;

socket.on('register', function(sId, cId) {
    console.log('Received register: ' + sId + ' ' + cId);
    sessionId = sId;
    clientId = getClientId();
    if (clientId == 0) { // If at main screen, do work
        var element = document.getElementById('QR' + cId);
        if (element !== null)
            element.parentNode.removeChild(element);
    }
});
socket.on('swing', function(recvClientId, data, time) {
    if (clientId == 0) { // If at main screen, do work
        var clientTime = parseInt(time);
        var clientData = parseFloat(data);
        if (clientTime >= startTime && clientTime <= startTime + 5000 && clientData > clientScore[recvClientId-1]) {
            clientScore[recvClientId-1] = data;
            console.log('Received swing: from id ' + recvClientId + ', ' + data + ', at time ' + time);
        } else {
            console.log('Received swing: from id ' + recvClientId + ', ' + data + ', at time ' + time + ', discarded');
        }
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
        return parseInt(pageURL.substring(n + 9, pageURL.length - 2));
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
        socket.emit('register', sId, cId);
        console.log('Sent register message');
    } else {
        console.log('Session ID and/or client ID is null!');
    }
}

function startGame_ScreenSide() {
    clientScore = [0, 0, 0, 0];
    document.getElementById('GameButtons').setAttribute('class', 'panel-body');
    for (var i = 1; i <= NUM_OF_PLAYERS; ++i)
        for (var j = 0; j <= NUM_OF_LEVELS; ++j)
            document.getElementById('GameButton' + i + '_' + j).setAttribute('class', 'btn btn-lg btn-remote');
    for (var i = 1; i <= 4; i++) {
        var element = document.getElementById('GameResult' + i);
        element.setAttribute('class', 'btn btn-lg btn-remote hidden');
        element.textContent = ' ';
    }
    document.getElementById('QRGroup').setAttribute('class', 'hidden');
    document.getElementById('StartGroup').setAttribute('class', 'form-group hidden');
    startTime = Date.now();
    setTimeout(showResult, 6000);
    console.log("Start game");
}

function init() {
    sessionId = getSessionId();
    clientId = getClientId();
    registerSession();
    if (clientId != 0) {
        if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
            window.addEventListener('devicemotion', deviceMotionHandler, false);
        } else {
            console.log('Not supported on your device or browser.  Sorry.');
        }
    }
}

window.addEventListener('load', init);
