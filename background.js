// message passing (receiving end): set up runtime.onMessage event listener to handle the message sent by popup.js to start a timer
let timerID;
let timerTime;
let timeRemaining;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.cmd === 'START_TIMER') {
        timerTime = request.time;
        timeRemaining = timerTime;
        if(timerTime > 0) {
            timerID = setInterval(() => {
                timeRemaining--;
                // update extension popup with new time remaining
                chrome.runtime.sendMessage({ cmd: 'TIME_UPDATE', timeLeft: timeRemaining});
                if(timeRemaining == 0) {
                    chrome.tabs.create({url: "breakTimer.html"});
                    clearInterval(timerID);
                }
            }, 1000) // keep track of timer in the background
        } 
    } 
}    
)

