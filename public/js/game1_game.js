var MIN_ACCE = 1;
var NUM_OF_LEVELS = 12;
var NUM_OF_PLAYERS = 4;
function showResult() {
    for (var level = 0; level <= NUM_OF_LEVELS; ++level) {
        setTimeout(function() {
            var i = level;
            return function() {
                console.log('Result step ' + i);
                button = [];
                for (var j = 1; j <= NUM_OF_PLAYERS; ++j) {
                    button[j-1] = document.getElementById('GameButton' + j + '_' + i);
                    if (clientScore[j-1] >= 6 * i)
                        button[j-1].setAttribute('class', 'btn btn-lg btn-remote button' + j + '_' + i);
                    else
                        button[j-1].setAttribute('class', 'btn btn-lg btn-remote');
                }
            };
        }(), 500*level);
    }
    
    winner = 0;
    for (var i = 1; i <= 3; i++)
        if (clientScore[i] > clientScore[winner])
            winner = i;
    setTimeout(function() {
        for (var i = 1; i <= 4; i++)
            document.getElementById('GameResult' + i).setAttribute('class', 'btn btn-lg btn-remote');
        for (var i = 0; i <= 3; i++)
            if (clientScore[i] == clientScore[winner]) {
                var element = document.getElementById('GameResult' + (i+1));
                element.setAttribute('class', 'btn btn-lg btn-remote btn-success');
                element.textContent = 'WIN';
            } else {
                var element = document.getElementById('GameResult' + (i+1));
                element.setAttribute('class', 'btn btn-lg btn-remote btn-danger');
                element.textContent = 'LOSE';
            }
        document.getElementById('StartGroup').setAttribute('class', 'form-group');
    }, 500*(clientScore[winner] / 6 + 1));
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
