// popup.js

// Function to send a print request to the background script
/*
function printDocument() {
    const contentToPrint = `
      <html>
        <head><title>Document to Print</title></head>
        <body>
          <h1>This is the document content</h1>
          <p>Here's some text content you can print.</p>
        </body>
      </html>
    `;
  
    // Send the content to the background script to be printed
    chrome.runtime.sendMessage({ type: "print_document", content: contentToPrint });
  }
  
  // Add an event listener for the print button
  document.getElementById("openOptions").addEventListener("click", () => {
    chrome.runtime.openOptionsPage(() => {
      if (chrome.runtime.lastError) {
        console.error("Error opening options page:", chrome.runtime.lastError.message);
      } else {
        console.log("Options page opened successfully.");
      }
    });
  });
  */

  document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
  
    // Lấy trạng thái hiện tại và cập nhật nút
    chrome.storage.sync.get('brainrotEnabled', (data) => {
      toggleButton.textContent = data.brainrotEnabled ? 'Disable Brainrot' : 'Enable Brainrot';
    });
  
    // Xử lý sự kiện khi nhấn nút
    toggleButton.addEventListener('click', () => {
      console.log('Button clicked');
      chrome.storage.sync.get('brainrotEnabled', (data) => {
        const newStatus = !data.brainrotEnabled;
        chrome.storage.sync.set({ brainrotEnabled: newStatus }, () => {
          toggleButton.textContent = newStatus ? 'Disable Brainrot' : 'Enable Brainrot';
  
          // Gửi thông điệp đến background script
          chrome.runtime.sendMessage({ action: 'toggleBrainrot', enabled: newStatus });
        });
      });
    });
  });
  
  