function setScoreByStrength(score) {
    if (clientId != 0)
        return;
    
    var button1 = document.getElementById('GameButton1');
    var button2 = document.getElementById('GameButton2');
    var button3 = document.getElementById('GameButton3');
    
    score = parseInt(score);
    if (isNaN(score))
        return;
    
    if (score >= 100)
        button1.setAttribute('class', 'btn btn-lg btn-remote btn-danger');
    else
        button1.setAttribute('class', 'btn btn-lg btn-remote');
    if (score >= 200)
        button2.setAttribute('class', 'btn btn-lg btn-remote btn-warning');
    else
        button2.setAttribute('class', 'btn btn-lg btn-remote');
    if (score >= 300)
        button3.setAttribute('class', 'btn btn-lg btn-remote btn-success');
    else
        button3.setAttribute('class', 'btn btn-lg btn-remote');
    
}
