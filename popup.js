// receive time remaining from background script and update the timer html
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === "TIME_UPDATE") {
    let timeRemaining = request.timeLeft;
    let hours = Math.floor(timeRemaining / 3600);
    let minutes = Math.floor((timeRemaining % 3600) / 60);
    let seconds = Math.floor(timeRemaining % 60); // remainder will alrdy have units of seconds
    // add a leading '0' if the values are less than 10
    let displayHours = hours < 10 ? "0" + hours : hours;
    let displayMinutes = minutes < 10 ? "0" + minutes : minutes;
    let displaySeconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timeDisplay").innerHTML =
      displayHours + ":" + displayMinutes + ":" + displaySeconds;
    if (timeRemaining == 0) {
      document.getElementById("startTimer").style.display = "inline";
    } else {
      document.getElementById("startTimer").style.display = "none";
    }
  } else if (request.cmd === "TIME_RESET") {
    document.getElementById("timeDisplay").innerHTML = "00:00:00";
    document.getElementById("startTimer").style.display = "inline";
    document.getElementById("stopTimer").style.display = "none";
  }
});

function startTimer(duration) {
  // duration will be in seconds
  if (duration > 0) {
    // message passing: sending request from popup script to background page to start the timer
    chrome.runtime.sendMessage({ cmd: "START_TIMER", time: duration });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(["startPressed"], function (result) {
    console.log(result.startPressed);
    if (result.startPressed) {
      document.getElementById("startTimer").style.display = "none";
      document.getElementById("stopTimer").style.display = "inline";
    } else {
      document.getElementById("startTimer").style.display = "inline";
      document.getElementById("stopTimer").style.display = "none";
    }
  });
  document.getElementById("settingsPage").style.display = "none";
  document.getElementById("startTimer").addEventListener("click", function () {
    chrome.storage.sync.get(["workSprintHours", "workSprintMinutes"], function (
      result
    ) {
      chrome.storage.sync.set({ startPressed: true, stopPressed: false });
      document.getElementById("startTimer").style.display = "none";
      document.getElementById("stopTimer").style.display = "inline";
      let duration =
        result.workSprintHours * 3600 + result.workSprintMinutes * 60;
      startTimer(duration);
    });
    document.getElementById("startTimer").style.display = "none";
  });
  document.getElementById("stopTimer").addEventListener("click", function () {
    chrome.storage.sync.set({ startPressed: false, stopPressed: true });
  });
  document.getElementById("settings").addEventListener("click", function () {
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("settingsPage").style.display = "inline";
  });
  document.getElementById("home").addEventListener("click", function () {
    document.getElementById("settingsPage").style.display = "none";
    document.getElementById("mainPage").style.display = "inline";
  });
  // if i add an if statement here to only execute these below statements when settingsPage elements are set to visible, I get a bug where upon browser Action, both divs are displayed on top of each other
  chrome.storage.sync.get(
    {
      workSprintHours: "1",
      workSprintMinutes: "0",
      stretchBreakHours: "0",
      stretchBreakMinutes: "10",
    },
    function (data) {
      chrome.storage.sync.set(data);
      document.getElementById("WorkSprintHours").value =
        data.workSprintHours < 10
          ? "0" + data.workSprintHours
          : data.workSprintHours;
      document.getElementById("WorkSprintMins").value =
        data.workSprintMinutes < 10
          ? "0" + data.workSprintMinutes
          : data.workSprintMinutes;
      document.getElementById("StretchBreakHours").value =
        data.stretchBreakHours < 10
          ? "0" + data.stretchBreakHours
          : data.stretchBreakHours;
      document.getElementById("StretchBreakMins").value =
        data.stretchBreakMinutes < 10
          ? "0" + data.stretchBreakMinutes
          : data.stretchBreakMinutes;
    }
  );

  setWorkSprint = document.getElementById("setWorkSprint");
  if (setWorkSprint) {
    setWorkSprint.addEventListener("click", function () {
      chrome.storage.sync.set({
        workSprintHours: document.getElementById("WorkSprintHours").value,
        workSprintMinutes: document.getElementById("WorkSprintMins").value,
      });
    });
  }

  setStretchBreak = document.getElementById("setStretchBreak");
  if (setStretchBreak) {
    setStretchBreak.addEventListener("click", function () {
      chrome.storage.sync.set({
        stretchBreaktHours: document.getElementById("StretchBreakHours").value,
        stretchBreakMinutes: document.getElementById("StretchBreakMins").value,
      }, );
    });
  }
});
