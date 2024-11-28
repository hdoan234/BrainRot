chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ brainrotEnabled: false }).then(() => {
    console.log("Extension installed.");
  });
});

/*
chrome.runtime.openOptionsPage(() => {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError.message);
  }
});
*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleBrainrot') {
    chrome.storage.sync.set({ brainrotEnabled: request.enabled }, () => {
      // Gửi thông điệp đến content script để cập nhật
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleBrainrot',
          enabled: request.enabled,
        });
      });
    });
  }
});
