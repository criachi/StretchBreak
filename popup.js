function updateTimer(timeRemaining) {
    console.log("update timer");
    while(timeRemaining > 0) {
        setTimeout( () => {
        let hours = Math.floor(timeRemaining / 3600);
        let minutes = Math.floor((timeRemaining % 3600) / 60);
        let seconds = Math.floor(timeRemaining % 60); // remainder will alrdy have units of seconds 
        console.log(seconds);
        document.getElementById('timeDisplay').innerHTML = hours + ":" + minutes + ":" + seconds;
        }, 1000);
        timeRemaining--;
    }     
    document.getElementById('startTimer').style.visibility = 'visible'; // make start timer btn visible agn 
}

// need to call start Timer on click of start timer button too 

function startTimer(duration) { // duration will be in seconds 
    if(duration > 0) {
    // message passing: sending request from popup script to extension
        chrome.runtime.sendMessage({ cmd: 'START_TIMER', time: duration });
            // setInterval(() => {
            //     duration--;
            //     let hours = Math.floor(duration / 3600);
            //     let minutes = Math.floor((duration % 3600) / 60);
            //     let seconds = Math.floor(duration % 60); // remainder will alrdy have units of seconds 
            //     document.getElementById('timerDisplay').innerHTML = hours + ":" + minutes + ":" + seconds; // update timer html every 1 second
            // }, 1000)
        updateTimer(duration);
    }
}
document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({ cmd: 'GET_TIME'}, response => {
        if(response.time) {
            let timeRemaining = response.time;
            updateTimer(timeRemaining) 
        }
    })
    document.getElementById('startTimer').addEventListener('click', function() { startTimer(10); document.getElementById('startTimer').style.visibility = 'hidden'; }); // 5 seconds default for now 
});