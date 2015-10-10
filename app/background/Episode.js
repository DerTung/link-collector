function Episode(season, episode) {
  this._season = season;
  this._episode = episode; 
  this._files = [];
}

Episode.prototype.equals = function(other) {
  return !!other && this._season === other._season && this._episode === other._episode;
};

Episode.prototype.toString = function() {
  function pad(number) {
    return number < 10 ? '0' + number : '' + number;  
  }
  return 'S' + pad(this._season) + 'E' + pad(this._episode); 
}

Episode.prototype.addFile = function(file) {
  this._files.push(file);
}

Episode.fromElement = function(element) {
  var m = element.innerText.match(/\.S(\d\d)E(\d\d)\./);
  return m ? new Episode(parseInt(m[1], 10), parseInt(m[2], 10)) : null;
};

module.exports = Episode;
