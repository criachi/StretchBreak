// message passing (receiving end): set up runtime.onMessage event listener to handle the message sent by popup.js to start a timer
let timerID;
let timerTime;
let timeRemaining;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.cmd === 'START_TIMER') {
        console.log("reuqest start timer");
        timerTime = request.time;
        timeRemaining = timerTime;
        if(timerTime > 0) {
            timerID = setInterval(() => {
                timeRemaining--;
                if(timeRemaining == 0) {
                    chrome.tabs.create({url: "alert.html"});
                    clearInterval(timerID);
                }
            }, 1000) // keep track of timer in the background
        } 
    } else if (request.cmd === 'GET_TIME') {
        sendResponse({ timeRemaining: timeRemaining });
    }
}
    
)