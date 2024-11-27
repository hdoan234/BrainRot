document.addEventListener('DOMContentLoaded', () => {
    const brainrotMethodSelect = document.getElementById('brainrotMethod');
    const saveButton = document.getElementById('saveButton');
    const status = document.getElementById('status');
  
    // Tải phương pháp hiện tại từ storage
    chrome.storage.sync.get('brainrotMethod', (data) => {
      brainrotMethodSelect.value = data.brainrotMethod || 'shuffle';
    });
  
    // Lưu cài đặt khi nhấn nút
    saveButton.addEventListener('click', () => {
      const method = brainrotMethodSelect.value;
      chrome.storage.sync.set({ brainrotMethod: method }, () => {
        status.style.display = 'block';
        setTimeout(() => {
          status.style.display = 'none';
        }, 2000);
      });
    });
  });