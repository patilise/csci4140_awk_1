var socket = io('ws://' + window.location.hostname + ':8000/');
var sessionId = null;
var clientId = null;
var startTime = [0, 0, 0, 0];
var clientScore = [0, 0, 0, 0];
var winner = 0;
var isPlaying = false;

socket.on('register', function(sId, cId) {
    console.log('Received register: ' + sId + ' ' + cId);
});
socket.on('swing', function(recvClientId, data, time) {
    if (!isPlaying || clientId != 0) {
        console.log('Received swing: from id ' + recvClientId + ', ' + data + ', at time ' + time + ', discarded');
        return;
    }
    
    var clientTime = parseInt(time);
    var clientData = parseFloat(data);
    if (clientData <= clientScore[recvClientId-1]) {
        console.log('Received swing: from id ' + recvClientId + ', ' + data + ', at time ' + time + ', discarded');
        return;
    }
    
    if (startTime == 0) {
        clientScore[recvClientId-1] = data;
        console.log('Received swing: from id ' + recvClientId + ', ' + data + ', at time ' + time);
        
        if (data < 10) return;
        
        startTime[recvClientId-1] = clientTime;
        document.getElementById('GameButtons').setAttribute('class', '');
        for (var level = 0; level <= NUM_OF_LEVELS; ++level) {
            setTimeout(function(i, j) {
                return function() {
                    var button = document.getElementById('GameButton' + j + '_' + i);
                    if (clientScore[j-1] >= 6 * i)
                        button.setAttribute('class', 'btn btn-lg btn-remote button' + j + '_' + i);
                    else
                        button.setAttribute('class', 'btn btn-lg btn-remote');
                    document.getElementById('GameResult' + j).textContent = '(Score: ' + clientScore[j-1] + ')';
                };
            }(level, recvClientId), 200 * level + 1000);
        }
    } else if (startTime != 0 && clientTime >= startTime[recvClientId-1] && clientTime <= startTime[recvClientId-1] + 1000) {
        clientScore[recvClientId-1] = data;
        console.log('Received swing: from id ' + recvClientId + ', ' + data + ', at time ' + time);
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
        console.log('Sent register message' + sId + ' ' + cId);
    } else {
        console.log('Session ID and/or client ID is null!');
    }
}

function startGame_ScreenSide() {
    isPlaying = true;
    clientScore = [0, 0, 0, 0];
    document.getElementById('GameColumn').setAttribute('class', 'col-12');
    document.getElementById('GameButtons').setAttribute('class', 'hidden');
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
    for (var i = 0; i < NUM_OF_PLAYERS; ++i) {
        startTime[i] = 0;
    }
    document.getElementById('SwingText').setAttribute('class', 'txt-swing');
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
