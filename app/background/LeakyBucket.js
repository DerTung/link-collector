function LeakyBucket(size, interval) {
  this.size = size;
  this.interval = interval;
  this.level = 0;
  
  this._intervalHandler = null;
  this._eventHandlers = {};
}

LeakyBucket.prototype.add = function(value) {
  if (value === undefined) {
    value = 1;
  }
  this.level = Math.min(this.size, this.level + value);
  if (!this._intervalHandler && this.level > 0) {
    this._intervalHandler = setInterval(this._drain.bind(this), this.interval);
  }
};

LeakyBucket.prototype.isFull = function() {
  return this.level >= this.size;
};

LeakyBucket.prototype._drain = function() {
  var wasFull = this.isFull();
  this.level = Math.max(0, this.level - 1);
  if (this.level === 0) {
    clearInterval(this._intervalHandler);
    this._intervalHandler = null;
  }
  if (wasFull) {
    this.emit('draining');
  }
};

LeakyBucket.prototype.on = function(event, callback) {
  var callbacks = this._eventHandlers[event];
  if (!callbacks) {
    callbacks = [];
   this._eventHandlers[event] = callbacks;
  }
  callbacks.push(callback);
};

LeakyBucket.prototype.emit = function(event) {
  var callbacks = this._eventHandlers[event] || [];
  callbacks.forEach(function(callback) {
    callback();
  });
}

module.exports = LeakyBucket;