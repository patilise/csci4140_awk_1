// Load YouTube IFrame API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Define global variables
var player = null;

function getYouTubePlayer() {
    return new YT.Player('player', {
        height : '360',
        width : '640',
        playerVars: {'controls' : 0},
        videoId: 'LW4m4NGaWqE', //TODO: Find a better video
        events : {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onYouTubeIframeAPIReady() {
    
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            showResult();
            break;
    }
}

function destroyPlayer() {
    player.destroy();
    player = null;
    var emptyPlayer = document.createElement('div');
    emptyPlayer.setAttribute('id', 'player');
    document.getElementById('youtubePanel').appendChild(emptyPlayer);
}
