var Promise = require('bluebird');

function ShowView(showList, topicScraper, topicLoader, episodeFilter) {
  this.showList = showList;
  this.topicScraper = topicScraper;
  this.topicLoader = topicLoader;
  this.episodeFilter = episodeFilter;
}

ShowView.prototype.getData = function() {
  return this.loadShows().then(function(shows) {
    return {shows: shows};
  });
};

ShowView.prototype.loadShows = function() {
  var shows = this.showList.getList();
  return Promise.all(shows.map(this.loadShow, this));
};

ShowView.prototype.loadShow = function(show) {
  var self = this;
  return this.topicLoader.load(show.topicId).then(function(data) {
    show.episodes = self.topicScraper.analyze(data);
    show.episodes = self.episodeFilter.filter(show, show.episodes);
    show.episodes.forEach(function(episode) {
      episode.files = self.filterFiles(episode.files);
      episode.files.forEach(function(file) {
        file.links = self.filterLinks(file.links);
      });
    });
    return show;
  });
};

ShowView.prototype.filterFiles = function(files) {
  return files.filter(function(file) {
    return file.format == 'MKV' && file.codec == 'x264';
  });
};

ShowView.prototype.filterLinks = function(files) {
  return files.filter(function(file) {
    return file.hoster == 'UL';
  });
};

module.exports = ShowView;
