let memoryInterval;

/*async function getTabs(){
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => { 
      const tabsWithMemory = [];
      let pending = tabs.length;

      tabs.forEach((tab) => {
        chrome.processes.getProcessIdForTab(tab.id, (processId) => {
          chrome.processes.getProcessInfo([processId], true, (processes) => {
            const processInfo = processes[processId];
            tabsWithMemory.push({
              title: tab.title,
              url: tab.url,
              memory: processInfo ? `${processInfo.privateMemory} bytes` : "N/A",
            });

            if (--pending === 0) {
              resolve(tabsWithMemory);
            }
          });
        });
      });

      if (tabs.length === 0) {
        resolve(tabsWithMemory);
      }
    });
  });
}*/

// Fetch extensions
const getExtensions = async () => {
  return await chrome.management.getAll();
}; 

async function getTabs() {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      const tabsWithMemory = tabs.map((tab) => ({
        title: tab.title,
        url: tab.url,
        memory: "N/A" // Memory information temporarily omitted
      }));
      resolve(tabsWithMemory);
    });
  });
}
/*
// Fetch tabs
const getTabs = async () => {
  return await chrome.tabs.query({});
};*/

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
    getTabs().then((tabsMemory) => sendResponse({ tabsMemory }));
  } else if (message.type === 'GET_EXTENSIONS') {
    getExtensions().then(extensions => sendResponse({ extensions }));
  } else if (message.type === 'START_MEMORY_MONITORING') {
    startMemoryMonitoring();
  } else if (message.type === 'STOP_MEMORY_MONITORING') {
    stopMemoryMonitoring();
  }
  return true; 
});


