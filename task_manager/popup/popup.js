document.addEventListener("DOMContentLoaded", async () => {
  const tabsList = document.getElementById("tabs-list");
  const extensionsList = document.getElementById("extensions-list");
  const memoryUsageElement = document.getElementById("memory-usage");
  
  const memoryTab = document.getElementById("memory-tab");
  const tabsTab = document.getElementById("tabs-tab");
  const extensionsTab = document.getElementById("extensions-tab");

  const memoryContent = document.getElementById("memory-content");
  const tabsContent = document.getElementById("tabs-content");
  const extensionsContent = document.getElementById("extensions-content");


  // Function to switch active tab
  function switchTab(tab) {
    // Remove active class from all tabs and sections
    document.querySelectorAll('.tab').forEach(tabElement => tabElement.classList.remove('active-tab'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active-section'));

    // Add active class to the selected tab and section
    tab.classList.add('active-tab');
    if (tab === memoryTab) {
      memoryContent.classList.add('active-section');
    } else if (tab === tabsTab) {
      tabsContent.classList.add('active-section');
    } else if (tab === extensionsTab) {
      extensionsContent.classList.add('active-section');
    }
  }
  switchTab(memoryTab);
// Event listeners for tab switching
memoryTab.addEventListener("click", () => switchTab(memoryTab));
tabsTab.addEventListener("click", () => switchTab(tabsTab));
extensionsTab.addEventListener("click", () => switchTab(extensionsTab));


  try {
    chrome.runtime.sendMessage({ type: 'CHECK_CONNECTION' }, (response) => {
      if (response.status === 'ok') {
        console.log('Connection to background established');
      }
    });

  // Request memory usage updates from background
  chrome.runtime.sendMessage({ type: 'START_MEMORY_MONITORING' });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'MEMORY_USAGE') {
      const memoryUsage = message.data;
      const memoryProgress = document.getElementById("memory-progress");
      const memoryText = document.getElementById("memory-usage");
  
      // Update the progress bar and the text
      memoryProgress.value = memoryUsage; 
      memoryText.textContent = `Memory Usage: ${memoryUsage.toFixed(2)}%`; 
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
} catch (error) {
  console.error('Error sending message to background:', error);
}


});

document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  // Check and apply saved theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }

  // Toggle dark mode on checkbox change
  darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  });
});
