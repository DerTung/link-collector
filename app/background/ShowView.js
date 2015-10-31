var Promise = require('bluebird');

function ShowView(showList, topicScraper, topicLoader, episodeFilter, fileFilter, linkFilter) {
  this.showList = showList;
  this.topicScraper = topicScraper;
  this.topicLoader = topicLoader;
  this.episodeFilter = episodeFilter;
  this.fileFilter = fileFilter;
  this.linkFilter = linkFilter;

  this.showsCached = null;
}

ShowView.prototype.getData = function() {
  return this.loadShows().then(function(shows) {
    return {
      shows: shows,
      episodeCount: shows.reduce(function(p, show) {
        return p + show.episodes.length;
      }, 0)
    };
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
    console.log(show);
    show.episodes.forEach(function(episode) {
      episode.files = self.fileFilter.filter(episode.files);
      episode.files.forEach(function(file) {
        if (file.links) {
          file.links = self.linkFilter.filter(file.links);
        }
      });
    });
    return show;
  }).catch(function(error) {
    show.error = error;
    show.episodes = [];
    return show;
  });
};

module.exports = ShowView;
