// Log memory and CPU usage periodically
chrome.runtime.onInstalled.addListener(() => {
    console.log("Browser Task Manager installed.");
  });
  
  setInterval(() => {
    chrome.system.memory.getInfo((memory) => {
      console.log(`Memory Usage: ${(memory.availableCapacity / memory.capacity) * 100}%`);
    });
  
    chrome.system.cpu.getInfo((cpu) => {
      console.log("CPU Info:", cpu);
    });
  }, 5000);