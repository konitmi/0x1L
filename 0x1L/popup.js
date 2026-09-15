const enabledToggle = document.getElementById("enabledToggle");

chrome.storage.sync.get({ enabled: true }, (settings) => {
  enabledToggle.checked = settings.enabled;
});

enabledToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabledToggle.checked });
});
