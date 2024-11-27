function isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE;
  }
  
  // Hàm tạo nội dung "brainrot" từ văn bản gốc
  function generateBrainrotText(text) {
    // Ví dụ: Xáo trộn chữ cái trong từ
    return text
      .split('')
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join('');
  }
  
  // Hàm đệ quy duyệt cây DOM và thay thế văn bản
  function traverseAndBrainrot(node) {
    // Bỏ qua các thẻ script và style
    if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE' || node.nodeName === 'NOSCRIPT') {
      return;
    }
  
    // Nếu là Text Node, thay thế nội dung
    if (isTextNode(node)) {
      const originalText = node.nodeValue.trim();
      if (originalText.length > 0) {
        node.nodeValue = generateBrainrotText(originalText);
      }
    } else {
      // Duyệt qua các con của nút hiện tại
      node.childNodes.forEach((child) => {
        traverseAndBrainrot(child);
      });
    }
  }
  
  // Kiểm tra trạng thái bật/tắt từ storage
  chrome.storage.sync.get('brainrotEnabled', (data) => {
    if (data.brainrotEnabled) {
      // Bắt đầu từ body của trang
      traverseAndBrainrot(document.body);
    }
  });
  
  // Lắng nghe sự thay đổi trạng thái từ background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleBrainrot') {
      if (request.enabled) {
        traverseAndBrainrot(document.body);
      } else {
        // Tải lại trang để trở về nội dung gốc
        window.location.reload();
      }
    }
  });
  // Thêm hàm cho các phương pháp khác nhau
function generateBrainrotText(text, method) {
    switch (method) {
      case 'reverse':
        return text.split('').reverse().join('');
      case 'randomWords':
        const brainrotWords = ['🤪', '🔥', '💥', '🚀', '😵', '👾', '🎉'];
        return text
          .split(' ')
          .map(() => brainrotWords[Math.floor(Math.random() * brainrotWords.length)])
          .join(' ');
      case 'shuffle':
      default:
        return text
          .split('')
          .sort(function () {
            return 0.5 - Math.random();
          })
          .join('');
    }
  }
  
  // Trong hàm traverseAndBrainrot, lấy phương pháp từ storage
  function traverseAndBrainrot(node, method) {
    // ... phần còn lại không đổi ...
    if (isTextNode(node)) {
      const originalText = node.nodeValue.trim();
      if (originalText.length > 0) {
        node.nodeValue = generateBrainrotText(originalText, method);
      }
    } else {
      node.childNodes.forEach((child) => {
        traverseAndBrainrot(child, method);
      });
    }
  }
  
  // Cập nhật phần khởi tạo
  chrome.storage.sync.get(['brainrotEnabled', 'brainrotMethod'], (data) => {
    if (data.brainrotEnabled) {
      traverseAndBrainrot(document.body, data.brainrotMethod || 'shuffle');
    }
  });
  
  // Trong listener
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleBrainrot') {
      if (request.enabled) {
        chrome.storage.sync.get('brainrotMethod', (data) => {
          traverseAndBrainrot(document.body, data.brainrotMethod || 'shuffle');
        });
      } else {
        window.location.reload();
      }
    }
  });
  