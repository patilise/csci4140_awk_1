var MIN_ACCE = 1;
var NUM_OF_LEVELS = 5;
var NUM_OF_PLAYERS = 4;
function showResult() {
    setTimeout(function() {
        var i = 1;
        console.log('Result step ' + i);
        button = [];
        for (var j = 1; j <= NUM_OF_PLAYERS; ++j) {
            button[j-1] = document.getElementById('GameButton' + j + '_' + i);
            if (clientScore[j-1] >= 10 * i)
                button[j-1].setAttribute('class', 'btn btn-lg btn-remote btn-danger');
            else
                button[j-1].setAttribute('class', 'btn btn-lg btn-remote');
        }
    }, 1000);
    setTimeout(function() {
        var i = 2;
        console.log('Result step ' + i);
        button = [];
        for (var j = 1; j <= NUM_OF_PLAYERS; ++j) {
            button[j-1] = document.getElementById('GameButton' + j + '_' + i);
            if (clientScore[j-1] >= 10 * i)
                button[j-1].setAttribute('class', 'btn btn-lg btn-remote btn-warning');
            else
                button[j-1].setAttribute('class', 'btn btn-lg btn-remote');
        }
    }, 2000);
    setTimeout(function() {
        var i = 3;
        console.log('Result step ' + i);
        button = [];
        for (var j = 1; j <= NUM_OF_PLAYERS; ++j) {
            button[j-1] = document.getElementById('GameButton' + j + '_' + i);
            if (clientScore[j-1] >= 10 * i)
                button[j-1].setAttribute('class', 'btn btn-lg btn-remote btn-success');
            else
                button[j-1].setAttribute('class', 'btn btn-lg btn-remote');
        }
    }, 3000);
    setTimeout(function() {
        var i = 4;
        console.log('Result step ' + i);
        button = [];
        for (var j = 1; j <= NUM_OF_PLAYERS; ++j) {
            button[j-1] = document.getElementById('GameButton' + j + '_' + i);
            if (clientScore[j-1] >= 10 * i)
                button[j-1].setAttribute('class', 'btn btn-lg btn-remote btn-primary');
            else
                button[j-1].setAttribute('class', 'btn btn-lg btn-remote');
        }
    }, 4000);
    setTimeout(function() {
        var i = 5;
        console.log('Result step ' + i);
        button = [];
        for (var j = 1; j <= NUM_OF_PLAYERS; ++j) {
            button[j-1] = document.getElementById('GameButton' + j + '_' + i);
            if (clientScore[j-1] >= 10 * i)
                button[j-1].setAttribute('class', 'btn btn-lg btn-remote btn-info');
            else
                button[j-1].setAttribute('class', 'btn btn-lg btn-remote');
        }
    }, 5000);
    setTimeout(function() {
        winner = 0;
        for (var i = 1; i <= 4; i++)
            document.getElementById('GameResult' + i).setAttribute('class', 'btn btn-lg btn-remote');
        for (var i = 1; i <= 3; i++)
            if (clientScore[i] > clientScore[winner])
                winner = i;
        document.getElementById('GameResult' + (winner+1)).setAttribute('class', 'btn btn-lg btn-remote btn-success');
    }, 6000);
    console.log('Set result timeout functions');
}

function deviceMotionHandler(eventData) {
    var acceZ = eventData.acceleration.z;
    if (acceZ > MIN_ACCE) {
        sendSwing(acceZ);
    }
}

function round(val) {
    var amt = 10;
    return Math.round(val * amt) / amt;
}
