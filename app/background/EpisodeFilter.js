function EpisodeFilter() {

}

EpisodeFilter.prototype.filter = function(show, episodes) {
  return episodes.filter(function(episode) {
    return !localStorage.getItem(this.getEpisodeId(show, episode));
  }, this);
};

EpisodeFilter.prototype.addShows = function(shows) {
  shows.forEach(function(show) {
    show.episodes.forEach(function(episode) {
      this.addEpisode(show, episode);
    }, this);
  }, this);
};

EpisodeFilter.prototype.addEpisode = function(show, episode) {
  var id = this.getEpisodeId(show, episode);
  localStorage.setItem(id, true);
};

EpisodeFilter.prototype.getEpisodeId = function(show, episode) {
  return show.topicId + '_' + episode.season + '_' + episode.episode;
};

module.exports = EpisodeFilter;
