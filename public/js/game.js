var isSwinging = false;
var maxAcce = 0;
function setScoreByStrength(player, score) {
    if (clientId != 0)
        return;
    
    var button1 = document.getElementById('GameButton' + player + '_1');
    var button2 = document.getElementById('GameButton' + player + '_2');
    var button3 = document.getElementById('GameButton' + player + '_3');
    
    score = parseInt(score);
    if (isNaN(score))
        return;
    
    setTimeout(function() {
        if (score >= 10)
            button1.setAttribute('class', 'btn btn-lg btn-remote btn-danger');
        else
            button1.setAttribute('class', 'btn btn-lg btn-remote');
    }, 1000);
    setTimeout(function() {
        if (score >= 30)
            button2.setAttribute('class', 'btn btn-lg btn-remote btn-warning');
        else
            button2.setAttribute('class', 'btn btn-lg btn-remote');
    }, 2000);
    setTimeout(function() {
        if (score >= 50)
            button3.setAttribute('class', 'btn btn-lg btn-remote btn-success');
        else
            button3.setAttribute('class', 'btn btn-lg btn-remote');
    }, 3000);
}

function startSwing() {
    isSwinging = true;
    maxAcce = 0;
    console.log('Start swing');
    setTimeout(function() {
        isSwinging = false;
        sendSwing(maxAcce);
        maxAcce = 0;
    }, 5000);
}

function deviceMotionHandler(eventData) {
    if (!isSwinging)
        return;
    var acceZ = eventData.acceleration.z;
    if (acceZ > maxAcce)
        maxAcce = acceZ;
}

function round(val) {
    var amt = 10;
    return Math.round(val * amt) / amt;
}