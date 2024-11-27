chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed.");
  });
  
  chrome.runtime.openOptionsPage(() => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    }
  });