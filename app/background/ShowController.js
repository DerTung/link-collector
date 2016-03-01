function ShowController(topicScraper, topicLoader, episodeFilter, fileFilter, linkFilter) {
  this.topicScraper = topicScraper;
  this.topicLoader = topicLoader;
  this.episodeFilter = episodeFilter;
  this.fileFilter = fileFilter;
  this.linkFilter = linkFilter;
}

ShowController.prototype.loadShow = function(show) {
  var self = this;
  return this.topicLoader.load(show.topicId).then(function(data) {
    show.episodes = self.topicScraper.analyze(data);
    show.episodes = self.episodeFilter.filter(show, show.episodes);
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
    show.error = error.stack || error
    show.episodes = [];
    return show;
  });
}

module.exports = ShowController;