/* global fixture */
var TopicScraper = require('background/TopicScraper');
var Episode = require('background/Episode');

describe('TopicScraper', function() {

  var topicScraper = null;
  var html = null;
  var data = null;

  beforeEach(function() {
    topicScraper = new TopicScraper();
  });

  it('adds an episodes', function() {
    topicScraper._addEpisode(new Episode(1, 1));
    topicScraper._addEpisode(new Episode(2, 3));
    expect(topicScraper._episodes.length).toBe(2);
  });

  it('doesnt add an episodes if it is already the current', function() {
    topicScraper._addEpisode(new Episode(1, 1));
    topicScraper._addEpisode(new Episode(1, 1));
    expect(topicScraper._episodes.length).toBe(1);
  });

  it('gets the current episode', function() {
    var episode = new Episode(1, 1);
    topicScraper._addEpisode(episode);
    expect(topicScraper._getCurrentEpisode()).toBe(episode);
  });

  describe('analyze', function() {

    beforeEach(function() {
      fixture.load('blueBloods.htm');
      html = fixture.el.innerHTML;
      data = topicScraper.analyze(html);
    });

    it('extracts episode information', function() {
      expect(data.length).toBe(3);
      expect(data.toString()).toEqual('S06E03,S07E02,S06E01');
    });

    it('extracts file information', function() {
      var files = data[0].files;
      expect(files.length).toBe(2);
      expect(files[0]).toEqual(jasmine.objectContaining({
        format: 'MP4',
        codec: 'x264'
      }));
      expect(files[1]).toEqual(jasmine.objectContaining({
        format: 'MKV',
        codec: 'x264'
      }));
    });

    it('extracts link information', function() {
      var links = data[0].files[0].links;
      expect(links.length).toBe(8);
      [{
        hoster: 'NF',
        link: 'https://safelinking.net/Ao5ZNjC'
      }, {
        hoster: 'HF',
        link: 'https://safelinking.net/7MCQBPZ'
      }, {
        hoster: 'MEGA',
        link: 'https://safelinking.net/ufbu93X'
      }, {
        hoster: 'CNU',
        link: 'https://safelinking.net/jcEF9Rq'
      }, {
        hoster: 'ULD',
        link: 'https://safelinking.net/sQtQwKp'
      }, {
        hoster: 'FF',
        link: 'https://safelinking.net/y4TsW8t'
      }, {
        hoster: 'UL',
        link: 'https://safelinking.net/GXRhmPr'
      }, {
        hoster: 'RG',
        link: 'https://safelinking.net/ZfeSs6W'
      }].forEach(function(item, i) {
        expect(links[i]).toEqual(jasmine.objectContaining(item));
      });
    });

    it('does not add links from previous seasons', function() {
      fixture.load('walkingDead.htm');
      html = fixture.el.innerHTML;
      data = topicScraper.analyze(html);

      var links = data[0].files[2].links;
      expect(links[0].link).not.toBe('https://safelinking.net/p/9ecfcf85a6');
    });
    
    it('extracts air dates', function() {
      expect(data[0].airDate).toEqual(new Date('Friday Oct 09, 2015').toDateString());
      expect(data[1].airDate).toEqual(new Date('Friday Oct 02, 2015').toDateString());
      expect(data[2].airDate).toEqual(new Date('Friday Sep 25, 2015').toDateString());
    });

  });

});
