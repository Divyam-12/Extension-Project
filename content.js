// content.js
document.addEventListener("mouseup", function () {
  const selection = window.getSelection();
  const selectedText = selection.toString();
  if (selectedText.length > 0) {
    const note = prompt("Add a note to your highlight:", "");
    if (note !== null) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      span.title = note;
      range.surroundContents(span);

      chrome.runtime.sendMessage({
        action: "highlight",
        text: selectedText,
        note: note,
        pageUrl: window.location.href,
      });
    }
    selection.removeAllRanges();
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "loadHighlights") {
    request.highlights.forEach((hl) => {
      highlightText(hl.text, hl.color, hl.note);
    });
  }
});

function highlightText(text, color, note) {
  const body = document.body;
  const innerHTML = body.innerHTML;
  const index = innerHTML.indexOf(text);
  if (index >= 0) {
    body.innerHTML =
      innerHTML.substring(0, index) +
      `<span style='background-color:${color};' title='${note}'>` +
      text +
      "</span>" +
      innerHTML.substring(index + text.length);
  }
}
