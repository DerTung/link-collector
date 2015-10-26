var bluebird = require('bluebird');

function TopicLoader() {

}

TopicLoader.prototype.load = function(topicId) {
  var url = this._getURL(topicId);
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest;
    xhr.addEventListener("error", reject);
    xhr.addEventListener("load", function() {
      if (xhr.status != 200) {
        reject(xhr.responseText);
      } else if (xhr.responseText.indexOf('The topic or post you requested does not exist') != -1) {
        reject('Topic not found');
      } else if (xhr.responseText.indexOf('Attention Guests: Please register to view all sections') != -1) {
        reject('Login to load topic');
      } else {
        resolve(xhr.responseText);
      }
    });
    xhr.open("GET", url);
    xhr.send(null);
  });
};

TopicLoader.prototype._getURL = function(topicId) {
  return "https://www.warez-bb.org/viewtopic.php?t=" + topicId; 
};

module.exports = TopicLoader;
