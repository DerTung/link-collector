var Episode = require('background/Episode');
var EpisodeFilter = require('background/EpisodeFilter');

describe('EpisodeFilter', function() {
  beforeEach(function() {
    this.episodeFilter = new EpisodeFilter();
    this.episodes = [new Episode(2, 1), new Episode(2, 2), new Episode(2, 3)];
    this.show = {topicId: 1, episodes: this.episodes};
  });

  afterEach(function() {
    localStorage.clear();
  });

  it('generates episode ids in format show_season_episode', function() {
    var id = this.episodeFilter.getEpisodeId(this.show, this.episodes[2]);
    expect(id).toBe('1_2_3');
  });

  it('filters out added episodes', function() {
    this.episodeFilter.addEpisode(this.show, this.episodes[1]);
    var episodes = this.episodeFilter.filter(this.show, this.episodes);
    expect(episodes).toEqual([this.episodes[0], this.episodes[2]]);
  });

  it('adds all episodes from a list of shows', function() {
    this.episodeFilter.addShows([this.show]);
    var episodes = this.episodeFilter.filter(this.show, this.episodes);
    expect(episodes).toEqual([]);
  });
});
