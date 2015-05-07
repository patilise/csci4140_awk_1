var socket = io('ws://' + window.location.hostname + ':8000/');
var sessionId = null;
var clientId = null;
var endTime = [0, 0, 0, 0];
var startTime = 0;
var clientExists = [false, false, false, false];
var isPlaying = false;

socket.on('register', function(sId, cId) {
    console.log('Received register: ' + sId + ' ' + cId);
});
socket.on('swing', function(recvClientId, data, time) {
    if (data == -1) {
        if (recvClientId != 0)
            clientExists[recvClientId-1] = true;
        return;
    }
    
    if (!isPlaying || clientId != 0 || endTime[recvClientId-1] != 0) {
        console.log('Received swing: from id ' + recvClientId + ', ' + data + ', at time ' + time + ', discarded');
        return;
    }
    
    console.log('Received swing: from id ' + recvClientId + ', ' + data + ', at time ' + time);
    
    if (recvClientId > 0 && endTime[recvClientId-1] === 0) {
        endTime[recvClientId-1] = Date.now();
        
        var element = document.getElementById('GameResult' + recvClientId);
        element.setAttribute('class', 'btn btn-lg btn-remote btn-danger');
        element.textContent = 'DEAD (' + round((endTime[recvClientId-1] - startTime)/1000) + ' seconds)';
        
        var numOfPeopleAlive = 0;
        for (var i = 0; i < NUM_OF_PLAYERS; ++i) {
            if (clientExists[i] && endTime[i] === 0)
                ++numOfPeopleAlive;
        }
        if (numOfPeopleAlive === 0) {
            setTimeout(showResults, 1000);
        }
    }
});

function sendSwing(swing) {
    console.log('Send swing: ' + swing);
    socket.emit('swing', clientId, swing, Date.now());
}

function getSessionId() {
    var pageURL = document.URL;
    var n = pageURL.search(/\/session_dontmove\/.*\//);
    if (n != -1) {
        return parseInt(pageURL.substring(n + 18, pageURL.length - 2));
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
        console.log('Sent register message: ' + sId + ' ' + cId);
    } else {
        console.log('Session ID and/or client ID is null!');
    }
}

function startGame_ScreenSide() {
    isPlaying = true;
    clientScore = [0, 0, 0, 0];
    document.getElementById('GameColumn').setAttribute('class', 'col-12');
    document.getElementById('GameResults').setAttribute('class', '');
    
    for (var i = 0; i < NUM_OF_PLAYERS; i++) {
        var element = document.getElementById('GameResult' + (i+1));
        if (clientExists[i]) {
            element.setAttribute('class', 'btn btn-lg btn-remote btn-warning');
            element.textContent = 'ZEN MODE';
        } else {
            element.setAttribute('class', 'btn btn-lg btn-remote');
            element.innerHTML = '<i class="fa fa-smile-o"></i>';
        }
        endTime[i] = 0;
    }
    document.getElementById('QRGroup').setAttribute('class', 'hidden');
    document.getElementById('StartGroup').setAttribute('class', 'form-group hidden');
    document.getElementById('SwingText').setAttribute('class', 'txt-swing');
    
    startTime = Date.now();
    
    player = getYouTubePlayer();
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
    sendSwing(-1);
}

window.addEventListener('load', init);
