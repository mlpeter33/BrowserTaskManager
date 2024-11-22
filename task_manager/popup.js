document.addEventListener("DOMContentLoaded", async () => {
    const tabsList = document.getElementById("tabs-list");
    const extensionsList = document.getElementById("extensions-list");
  
    // Fetch and display tabs
    const tabs = await chrome.tabs.query({});
    tabs.forEach((tab) => {
      const li = document.createElement("li");
      li.textContent = `${tab.title} (${tab.url})`;
      tabsList.appendChild(li);
    });
  
    // Fetch and display extensions
    const extensions = await chrome.management.getAll();
    extensions.forEach((ext) => {
      if (ext.enabled) {
        const li = document.createElement("li");
        li.textContent = `${ext.name} (${ext.version})`;
        extensionsList.appendChild(li);
      }
    });
  });