function messageService($q) {
  function sendMessage(msg) {
    return $q(function(resolve, reject) {
      chrome.runtime.sendMessage(msg, function(response) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }
  
  return {
    sendMessage: sendMessage
  }
}

module.exports = messageService;
