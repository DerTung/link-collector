var LeakyBucket = require('./LeakyBucket');

function TopicLoader() {
  this.topicCache = {};
  this.queue = [];
  this.loading = 0;
  this._loggedIn = null;
  this._leakyBucket = new LeakyBucket(this.LEAKY_BUCKET_SIZE, this.LEAKY_BUCKET_INTERVAL, this.LEAKY_BUCKET_RATE);
  this._leakyBucket.on('draining', this._next.bind(this));
}

TopicLoader.prototype.CACHE_DURATION = 1800 * 1000; // 30 minutes
TopicLoader.prototype.MAX_LOADING = 13;
TopicLoader.prototype.LEAKY_BUCKET_SIZE = 13;
TopicLoader.prototype.LEAKY_BUCKET_INTERVAL = 60000;
TopicLoader.prototype.LEAKY_BUCKET_RATE = 13;
TopicLoader.prototype.LOGGED_IN_DURATION = 300000; // minutes

TopicLoader.prototype.load = function(topicId) {
  if (this.topicCache[topicId]) {
    return Promise.resolve(this.topicCache[topicId]);
  }

  var url = this._getURL(topicId);
  var self = this;
  return new Promise(function (resolve, reject) {
    
    function load() {
      if (self.isLoggedIn() === false) {
        reject('Login to load topic');
        self._next();
        return;
      }
      
      self.loading++;
      self._leakyBucket.add() 
      
      var xhr = new XMLHttpRequest;
      xhr.addEventListener("error", function(error) {
        self.loading--;
        reject(error);        
        self._next();
      });
      xhr.addEventListener("load", function() {
        if (xhr.status != 200) {
          reject(xhr.responseText);
        } else if (xhr.responseText.indexOf('The topic or post you requested does not exist') != -1) {
          reject('Topic not found');
        } else if (xhr.responseText.indexOf('The page you are looking for is temporarily unavailable.') != -1) {
          reject('Topic temporarily unavailable');
        } else if (xhr.responseText.indexOf('Attention Guests: Please register to view all sections') != -1) {
          var username = localStorage.username;
          var password = localStorage.password;
          if (username && password) {
            self.login(username, password).then(function() {
              resolve(self.load(topicId));
            }, reject);
          } else {
            self.setLoggedIn(false);
            reject('Login to load topic');
          }
        } else {
          self.setLoggedIn(true);
          self.cacheTopic(topicId, xhr.responseText);
          resolve(xhr.responseText);
        }
        self.loading--;
        self._next();
      });
      xhr.open("GET", url);
      xhr.send(null);
    }
    
    if (self.loading >= self.MAX_LOADING || 
        self._leakyBucket.isFull() ||
        !self.isLoggedIn() && self.loading > 0) {
      self.queue.push(load);
    } else {
      load()
    }
  });
};

TopicLoader.prototype._next = function() {
  while (this.queue.length > 0 && 
         !this._leakyBucket.isFull() && 
         (this.isLoggedIn() || this.loading == 0)) {
    this.queue.shift()(); 
  }
};

TopicLoader.prototype.login = function(username, password) {
  var self = this;
  self.loading++;
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest;
    xhr.addEventListener("error", function(error) {
      self.loading--;
      reject(error);
    });
    xhr.addEventListener("load", function() {
      self.loading--;
      if (xhr.status != 200) {
        self.setLoggedIn(false);
        reject(xhr.responseText);
      } else if (xhr.responseText.indexOf('It appears that you have entered an incorrect password') != -1) {
        self.setLoggedIn(false);
        reject('Wrong username or password');
      } else {
        self.setLoggedIn(true);
        resolve();
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

TopicLoader.prototype.setLoggedIn = function(value) {
  this._loggedIn = value ? Date.now() + this.LOGGED_IN_DURATION : value;
};

TopicLoader.prototype.isLoggedIn = function() {
  return this._loggedIn && (Date.now() < this._loggedIn || null);
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
