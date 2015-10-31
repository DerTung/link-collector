var Promise = require('bluebird');
var ShowView = require('background/ShowView');
var Episode = require('background/Episode');

describe('ShowView', function() {

  var ep1 = null;

  beforeEach(function() {
    ep1 = new Episode(1, 2);

    this.showList = {};
    this.showList.getList = function() {
      return [{topicId: 1}]
    };

    this.topicScraper = {};
    this.topicScraper.analyze = function() {
      return [ep1];
    };

    this.topicLoader = {};
    this.topicLoader.load = function() {
      return Promise.resolve([]);
    };
    
    this.episodeFilter = {};
    this.episodeFilter.filter = function(show, episodes) {
      return episodes;
    };

    this.fileFilter = {}
    this.fileFilter.filter = function(files) {
      return files;
    }

    this.linkFilter = {}
    this.linkFilter.filter = function(links) {
      return links;
    }

    this.showView = new ShowView(this.showList, this.topicScraper, this.topicLoader, this.episodeFilter, this.fileFilter, this.linkFilter);
  })

  describe('getData', function(done) {

    it('returns the correct data', function(done) {
      this.showView.getData().then(function(data) {
        expect(data.shows.length).toBe(1);
        expect(data.episodeCount).toBe(1);
        done();
      }, function(error) {
        done.fail(error);
      });
    });

    it('returns if topicLoader.load fails', function(done) {
      this.topicLoader.load = function() {
        return Promise.reject('Some Error');
      }
      this.showView.getData().then(function(data) {
        expect(data.shows.length).toBe(1);
        var show = data.shows[0];
        expect(show.error).toBe('Some Error');
        expect(show.episodes).toEqual([]);
        done();
      }, function(error) {
        done.fail(error);
      });
    });

  });



});
