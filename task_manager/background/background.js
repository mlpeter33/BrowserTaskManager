let memoryInterval;

// Fetch tabs
const getTabs = async () => {
  return await chrome.tabs.query({});
};

// Fetch extensions
const getExtensions = async () => {
  return await chrome.management.getAll();
};

// Start memory monitoring
function startMemoryMonitoring() {
  setInterval(() => {
    chrome.system.memory.getInfo((memory) => {
      const usedMemory = memory.capacity - memory.availableCapacity;
      const memoryUsagePercentage = (usedMemory / memory.capacity) * 100;
      chrome.runtime.sendMessage({ type: 'MEMORY_USAGE', data: memoryUsagePercentage });
    });
  }, 1000);  // Update every second
}

// Stop memory monitoring
const stopMemoryMonitoring = () => {
  if (memoryInterval) {
    clearInterval(memoryInterval);
    memoryInterval = null;
  }
};

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  if (message.type === 'GET_TABS') {
    getTabs().then(tabs => sendResponse({ tabs }));
  } else if (message.type === 'GET_EXTENSIONS') {
    getExtensions().then(extensions => sendResponse({ extensions }));
  } else if (message.type === 'START_MEMORY_MONITORING') {
    startMemoryMonitoring();
  } else if (message.type === 'STOP_MEMORY_MONITORING') {
    stopMemoryMonitoring();
  }
  return true; 
});


