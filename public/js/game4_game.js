var MIN_ACCE = 1;
var NUM_OF_PLAYERS = 4;

function showResult() {
    isPlaying = false;
    
    for (var i = 0; i < NUM_OF_PLAYERS; ++i) {
        if (!clientExists[i]) {
            var element = document.getElementById('GameResult' + (i+1));
            element.setAttribute('class', 'btn btn-lg btn-remote');
            element.innerHTML = '<i class="fa fa-smile-o"></i>';
        } else if (endTime[i] === 0) {
            var element = document.getElementById('GameResult' + (i+1));
            element.setAttribute('class', 'btn btn-lg btn-remote btn-success');
            element.textContent = 'ALIVE (' + 10 + ' seconds)';
        } else {
            var element = document.getElementById('GameResult' + (i+1));
            element.setAttribute('class', 'btn btn-lg btn-remote btn-danger');
            element.textContent = 'DEAD (' + round((endTime[i] - startTime)/1000) + ' seconds)';
        }
    }
    
    document.getElementById('SwingText').setAttribute('class', 'txt-swing hidden');
    document.getElementById('StartGroup').setAttribute('class', 'form-group');
    document.getElementById('StartButton').textContent = 'Restart';
    console.log('Finished showResult()');
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
