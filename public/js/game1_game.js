var MIN_ACCE = 6;
var NUM_OF_LEVELS = 12;
var NUM_OF_PLAYERS = 4;

function showResult() {
    var localClientScore = [0,0,0,0];
    for (var i = 0; i < NUM_OF_PLAYERS; ++i)
        localClientScore[i] = clientScore[i];
    
    winner = 0;
    for (var i = 1; i <= NUM_OF_PLAYERS-1; i++)
        if (localClientScore[i] > localClientScore[winner])
            winner = i;
    
    setTimeout(function() {
        for (var i = 1; i <= NUM_OF_PLAYERS; i++)
            document.getElementById('GameResult' + i).setAttribute('class', 'btn btn-lg btn-remote');
        for (var i = 0; i <= NUM_OF_PLAYERS-1; i++)
            if (localClientScore[i] == localClientScore[winner]) {
                var element = document.getElementById('GameResult' + (i+1));
                element.setAttribute('class', 'btn btn-lg btn-remote btn-success');
                element.textContent = 'WIN ' + element.textContent;
            } else if (localClientScore[i] != 0) {
                var element = document.getElementById('GameResult' + (i+1));
                element.setAttribute('class', 'btn btn-lg btn-remote btn-danger');
                element.textContent = 'LOSE ' + element.textContent;
            } else {
                var element = document.getElementById('GameResult' + (i+1));
                element.setAttribute('class', 'btn btn-lg btn-remote');
                element.innerHTML = '<i class="fa fa-gavel fa-2"></i>';
            }
        document.getElementById('SwingText').setAttribute('class', 'txt-swing hidden');
        document.getElementById('StartGroup').setAttribute('class', 'form-group');
        document.getElementById('StartButton').textContent = 'Restart';
    }, 500 * (localClientScore[winner] / 6 + 1));
    
    console.log('Set result timeout functions');
}

function deviceMotionHandler(eventData) {
    var acceZ = eventData.acceleration.z;
    if (acceZ >= MIN_ACCE) {
        sendSwing(acceZ);
    }
}

function round(val) {
    var amt = 10;
    return Math.round(val * amt) / amt;
}
