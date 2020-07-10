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
                console.log('timer going');
                timeRemaining--;
                // update extension popup with new time remaining
                chrome.runtime.sendMessage({ cmd: 'TIME_UPDATE', timeLeft: timeRemaining});
                if(timeRemaining == 0) {
                    chrome.storage.sync.set({ startPressed: false }, function() {
                        chrome.tabs.create({url: "breakTimer.html"});
                        clearInterval(timerID);
                    });
                }
                chrome.storage.sync.get(['stopPressed'], function(result) {
                    if(result.stopPressed) {
                        chrome.runtime.sendMessage({ cmd: 'TIME_RESET'});
                        clearInterval(timerID);
                    }
                })
            }, 1000) // keep track of timer in the background
        } 
    } 
}    
)

