// Load YouTube IFrame API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Define global variables
var player = null;
var videoList = ['SHOW_MOLE', 'LW4m4NGaWqE', '1Tuv0ZGPPUA', '9bZkp7q19f0', 'rKbZS90zNho', '4ViwSeuWVfE', 'WGQhIHcfzsw', 'IJNR2EpS0jw'];

function getYouTubePlayer() {
    if (videoNow === 0)
        return null;
    return new YT.Player('player', {
        height : '360',
        width : '640',
        playerVars: {'controls' : 0},
        videoId: videoList[videoNow],
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
    if (player !== null) {
        player.destroy();
        player = null;
        var emptyPlayer = document.createElement('div');
        emptyPlayer.setAttribute('id', 'player');
        document.getElementById('youtubePanel').appendChild(emptyPlayer);
    }
}

function random(min, max) {
    return Math.floor((Math.random() * max) + min); 
}

function changeVideo() {
    videoNow = random(0, videoList.length - 1);
    
    if (videoNow == 0) {
        destroyPlayer();
        document.getElementById('MoleImage1').setAttribute('class', 'img-responsive');
        document.getElementById('MoleImage2').setAttribute('class', 'img-responsive');
    
        setTimeout(changeVideo, 7500);
    } else {
        destroyPlayer();
        document.getElementById('MoleImage1').setAttribute('class', 'img-responsive hidden');
        document.getElementById('MoleImage2').setAttribute('class', 'img-responsive hidden');
        destroyPlayer();document.getElementById('youtubePanel').setAttribute('class', 'embed-responsive embed-responsive-16by9');
        player = getYouTubePlayer();
    }
}
