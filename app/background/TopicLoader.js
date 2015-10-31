var Promise = require('bluebird');

function TopicLoader() {
  this.topicCache = {};
}

TopicLoader.prototype.CACHE_DURATION = 300000;

TopicLoader.prototype.load = function(topicId) {
  if (this.topicCache[topicId]) {
    return Promise.resolve(this.topicCache[topicId]);
  }

  var url = this._getURL(topicId);
  var self = this;
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
        self.cacheTopic(topicId, xhr.responseText);
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

TopicLoader.prototype.cacheTopic = function(topicId, response) {
  this.topicCache[topicId] = response;
  var self = this;
  setTimeout(function() {
    delete self.topicCache[topicId];
  }, this.CACHE_DURATION);
};

module.exports = TopicLoader;
