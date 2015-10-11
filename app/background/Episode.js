function Episode(season, episode) {
  this.season = season;
  this.episode = episode; 
  this.files = [];
}

Episode.prototype.equals = function(other) {
  return !!other && this.season === other.season && this.episode === other.episode;
};

Episode.prototype.toString = function() {
  function pad(number) {
    return number < 10 ? '0' + number : '' + number;  
  }
  return 'S' + pad(this.season) + 'E' + pad(this.episode); 
}

Episode.prototype.addFile = function(file) {
  this.files.push(file);
}

Episode.fromElement = function(element) {
  var m = element.innerText.match(/\.S(\d\d)E(\d\d)\./);
  return m ? new Episode(parseInt(m[1], 10), parseInt(m[2], 10)) : null;
};

module.exports = Episode;
