// receive time remaining from background script and update the timer html
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.cmd === 'TIME_UPDATE') {
        let timeRemaining = request.timeLeft;
        let hours = Math.floor(timeRemaining / 3600);
        let minutes = Math.floor((timeRemaining % 3600) / 60);
        let seconds = Math.floor(timeRemaining % 60); // remainder will alrdy have units of seconds 
        // add a leading '0' if the values are less than 10
        let displayHours = (hours < 10) ? '0' + hours : hours;
        let displayMinutes = (minutes < 10) ? '0' + minutes : minutes;
        let displaySeconds = (seconds < 10) ? '0' + seconds : seconds;
        document.getElementById('timeDisplay').innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;
        if(timeRemaining == 0) {
            document.getElementById('startTimer').style.visibility = 'visible';
        } else {
            document.getElementById('startTimer').style.visibility = 'hidden';
        }
    }    
});

function startTimer(duration) { // duration will be in seconds 
    if(duration > 0) {
    // message passing: sending request from popup script to extension
        chrome.runtime.sendMessage({ cmd: 'START_TIMER', time: duration });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('settingsPage').style.visibility = 'hidden';
    document.getElementById('startTimer').addEventListener('click', function() { startTimer(10); document.getElementById('startTimer').style.visibility = 'hidden'; });  
    document.getElementById('settings').addEventListener('click', function() { document.getElementById('mainPage').style.visibility = 'hidden'; document.getElementById('settingsPage').style.visibility = 'visible';});
    document.getElementById('home').addEventListener('click', function() { document.getElementById('settingsPage').style.visibility = 'hidden'; document.getElementById('mainPage').style.visibility = 'visible';});
});



