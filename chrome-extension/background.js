function getTabId() {
  return chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    return tabs[0].id;
  });
}

async function addIframe() {
  const iframe = document.createElement("iframe");
  const loadComplete =
      new Promise(resolve => iframe.addEventListener("load", resolve));
  iframe.src = "https://example.com";
  document.body.appendChild(iframe);
  await loadComplete;
  return iframe.contentWindow.document.title;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  // Next state will always be the opposite
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "ON") {
    chrome.scripting
    .executeScript({
      target : {tabId : getTabId(), allFrames : true},
      func : addIframe,
    })
    .then(injectionResults => {
      for (const frameResult of injectionResults) {
        const {frameId, result} = frameResult;
        console.log(`Frame ${frameId} result:`, result);
      }
    });
  } else if (nextState === "OFF") {
    // Remove the CSS file when the user turns the extension off
    chrome.scripting
    .executeScript({
      target : {tabId : getTabId(), allFrames : true},
      func : removeIframe,
    })
    .then(injectionResults => {
      for (const frameResult of injectionResults) {
        const {frameId, result} = frameResult;
        console.log(`Frame ${frameId} result:`, result);
      }
    });
  }
});
