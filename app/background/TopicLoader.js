var bluebird = require('bluebird');

function TopicLoader() {

}

TopicLoader.prototype.load = function(topicId) {
  var url = this._getURL(topicId);
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest;
    xhr.addEventListener("error", reject);
    xhr.addEventListener("load", function() {
      resolve(xhr.responseText);
    });
    xhr.open("GET", url);
    xhr.send(null);
  });
};

TopicLoader.prototype._getURL = function(topicId) {
  return "https://www.warez-bb.org/viewtopic.php?t=" + topicId; 
};

module.exports = TopicLoader;
