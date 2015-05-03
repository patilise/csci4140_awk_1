var isSwinging = false;
var MIN_ACCE = 1;
function showResult() {
    for (var level = 1; level <= 3; ++level) {
        setTimeout(function() {
            var i = level;
            return function() {
                button = [];
                for (var j = 1; j <= 4; ++j) {
                    button[j-1] = document.getElementById('GameButton' + j + '_' + i);
                    if (clientScore[j-1] >= 10 * i)
                        button[j-1].setAttribute('class', 'btn btn-lg btn-remote btn-danger');
                    else
                        button[j-1].setAttribute('class', 'btn btn-lg btn-remote');
                }
            }
        }(), 1000 * level);
    }
}

function startGame_Mobile() {
    isSwinging = true;
    console.log('Start swing');
}

function deviceMotionHandler(eventData) {
    if (!isSwinging)
        return;
    var acceZ = eventData.acceleration.z;
    if (acceZ > MIN_ACCE) {
        sendSwing(acceZ);
    }
}

function round(val) {
    var amt = 10;
    return Math.round(val * amt) / amt;
}
