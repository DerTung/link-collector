function EpisodeFilter() {

}

EpisodeFilter.prototype.filter = function(show, episodes) {
  return episodes.filter(function(episode) {
    return !localStorage.getItem(this.getEpisodeId(show, episode));
  }, this);
};

EpisodeFilter.prototype.addDownloaded = function(shows) {
  shows.forEach(function(show) {
    show.episodes.forEach(function(episode) {
      localStorage.setItem(this.getEpisodeId(show, episode), true);
    }, this);
  }, this);
} 

EpisodeFilter.prototype.getEpisodeId = function(show, episode) {
  return show.topicId + '_' + episode.season + '_' + episode.episode;
};

module.exports = EpisodeFilter;
