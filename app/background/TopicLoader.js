var Promise = require('bluebird');

function TopicLoader() {
  this.topicCache = {};
}

TopicLoader.prototype.CACHE_DURATION = 300000; // 5 minutes

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
        var username = localStorage.username;
        var password = localStorage.password;
        if (username && password) {
          self.login(username, password).then(function() {
            console.log('xyz')
            resolve(self.load(topicId));
          }, reject);
        } else {
          reject('Login to load topic');
        }
      } else {
        self.cacheTopic(topicId, xhr.responseText);
        resolve(xhr.responseText);
      }
    });
    xhr.open("GET", url);
    xhr.send(null);
  });
};

TopicLoader.prototype.login = function(username, password) {
  var self = this;
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest;
    xhr.addEventListener("error", reject);
    xhr.addEventListener("load", function() {
      if (xhr.status != 200) {
        reject(xhr.responseText);
      } else if (xhr.responseText.indexOf('It appears that you have entered an incorrect password') != -1) {
        reject('Wrong username or password');
      } else {
        resolve(xhr.responseText);
      }
    });

    xhr.open("POST", "https://www.warez-bb.org/login.php");
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var data = {
      username: username,
      password: password,
      autologin: 'on',
      login: 'Log in'
    };  
    xhr.send(self._encodeData(data));
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

TopicLoader.prototype._encodeData = function(data) {
  return Object.keys(data).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
  }).join('&');
};

TopicLoader.prototype.setCredentials = function(username, password) {
  localStorage.username = username;
  localStorage.password = password;
};

module.exports = TopicLoader;
