var MIN_ACCE = 0.8;
var NUM_OF_PLAYERS = 4;

function showResult() {
    isPlaying = false;
    destroyPlayer();
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
    document.getElementById('youtubePanel').setAttribute('class', 'embed-responsive embed-responsive-16by9 hidden');
    document.getElementById('MoleImage1').setAttribute('class', 'img-responsive hidden');
    document.getElementById('MoleImage2').setAttribute('class', 'img-responsive hidden');
    document.getElementById('StartButton').textContent = 'Restart';
    console.log('Finished showResult()');
}

function deviceMotionHandler(eventData) {
    var acceX = eventData.acceleration.x;
    var acceY = eventData.acceleration.y;
    var acceZ = eventData.acceleration.z;
    var acce = Math.sqrt(acceX * acceX + acceY * acceY + acceZ * acceZ);
    if (acce >= MIN_ACCE) {
        sendSwing(acce);
    }
}

function round(val) {
    var amt = 10;
    return Math.round(val * amt) / amt;
}
