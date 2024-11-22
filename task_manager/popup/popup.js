document.addEventListener("DOMContentLoaded", async () => {
  const tabsList = document.getElementById("tabs-list");
  const extensionsList = document.getElementById("extensions-list");
  const memoryUsageElement = document.getElementById("memory-usage");
  
  try {
    chrome.runtime.sendMessage({ type: 'CHECK_CONNECTION' }, (response) => {
      if (response.status === 'ok') {
        console.log('Connection to background established');
      }
    });

  // Request tabs data from background
  chrome.runtime.sendMessage({ type: 'GET_TABS' }, (response) => {
    const tabs = response.tabs;
    tabs.forEach((tab) => {
      const li = document.createElement("li");
      li.textContent = `${tab.title} (${tab.url})`;
      tabsList.appendChild(li);
    });
  });

  // Request extensions data from background
  chrome.runtime.sendMessage({ type: 'GET_EXTENSIONS' }, (response) => {
    const extensions = response.extensions;
    extensions.forEach((ext) => {
      if (ext.enabled) {
        const li = document.createElement("li");
        li.textContent = `${ext.name} (${ext.version})`;
        extensionsList.appendChild(li);
      }
    });
  });

  // Request memory usage updates from background
  chrome.runtime.sendMessage({ type: 'START_MEMORY_MONITORING' });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'MEMORY_USAGE') {
      memoryUsageElement.textContent = `Memory Usage: ${message.data}%`;
    }
  });
} catch (error) {
  console.error('Error sending message to background:', error);
}
});
