// Log memory and CPU usage periodically
chrome.runtime.onInstalled.addListener(() => {
    console.log("Browser Task Manager installed.");
  });
  
  setInterval(() => {
    chrome.system.memory.getInfo((memory) => {
      const usedMemory = memory.capacity - memory.availableCapacity;
      const memoryUsagePercentage = (usedMemory / memory.capacity) * 100;
      console.log(`Memory Usage: ${memoryUsagePercentage.toFixed(2)}%`);
    });
  
    chrome.system.cpu.getInfo((cpu) => {
      console.log("CPU Info:", cpu);
    });
  }, 1000);

