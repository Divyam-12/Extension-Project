// popup.js
document.getElementById("saveOptions").addEventListener("click", saveOptions);
document.getElementById("export").addEventListener("click", exportAnnotations);
document.getElementById("clear").addEventListener("click", clearAnnotations);

function saveOptions() {
  const highlightColor = document.getElementById("highlightColor").value;
  chrome.storage.sync.set({ highlightColor: highlightColor }, function () {
    console.log("Options saved");
  });
}

function exportAnnotations() {
  chrome.storage.sync.get("highlights", function (data) {
    const highlights = data.highlights;
    const blob = new Blob([JSON.stringify(highlights, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annotations.json";
    a.click();
    URL.revokeObjectURL(url);
  });
}

function clearAnnotations() {
  chrome.storage.sync.remove("highlights", function () {
    console.log("Annotations cleared");
    document.getElementById("annotationsList").innerHTML = "";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadOptions();
  loadAnnotations();
});

function loadOptions() {
  chrome.storage.sync.get("highlightColor", function (data) {
    document.getElementById("highlightColor").value =
      data.highlightColor || "#ffff00";
  });
}

function loadAnnotations() {
  chrome.storage.sync.get("highlights", function (data) {
    const highlights = data.highlights || [];
    const annotationsList = document.getElementById("annotationsList");
    annotationsList.innerHTML = "";
    highlights.forEach((hl) => {
      const li = document.createElement("li");
      li.textContent = `${hl.text} - ${hl.note}`;
      annotationsList.appendChild(li);
    });
  });
}
