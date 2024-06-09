// background.js
let highlights = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "highlight") {
    const highlight = {
      text: request.text,
      note: request.note,
      pageUrl: request.pageUrl,
      color: "yellow", // default color, can be customized
    };
    highlights.push(highlight);
    chrome.storage.sync.set({ highlights: highlights });
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    chrome.storage.sync.get("highlights", function (data) {
      if (data.highlights) {
        highlights = data.highlights.filter((hl) => hl.pageUrl === tab.url);
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: loadHighlights,
          args: [highlights],
        });
      }
    });
  }
});

function loadHighlights(highlights) {
  chrome.runtime.sendMessage({
    action: "loadHighlights",
    highlights: highlights,
  });
}
