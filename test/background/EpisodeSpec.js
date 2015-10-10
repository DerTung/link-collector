var Episode = require('background/Episode');

describe('Episode', function() {

  describe('equals', function() {
    
    it('equals if season and episode match', function() {
      expect((new Episode(1, 1)).equals(new Episode(1, 1))).toBe(true);
    });

    it('does not equal if episode differs', function() {
      expect((new Episode(1, 1)).equals(new Episode(1, 2))).toBe(false);
    });

    it('does not equal if season differs', function() {
      expect((new Episode(1, 1)).equals(new Episode(2, 1))).toBe(false);
    });

    it('does not equal if episode and season differs', function() {
      expect((new Episode(1, 1)).equals(new Episode(2, 2))).toBe(false);
    });

    it('does not equal null', function() {
      expect((new Episode(1, 1)).equals(null)).toBe(false);
    });

  });

  describe('fromElement', function() {

    it('creates an episode from an element', function() {
      var element = document.createElement('span');
      element.innerText = 'The.Good.Wife.S07E01.HDTV.XviD-AFG';
      var episode = Episode.fromElement(element);
      expect(episode.equals(new Episode(7, 1)));
    });

    it('returns null if it doesn\'t match an episode', function() {
      var element = document.createElement('span');
      element.innerText = 'Hello World';
      expect(Episode.fromElement(element)).toBe(null);
    });

  });

  it('correctly formats as string', function() {
    expect((new Episode(3, 5)).toString()).toBe('S03E05');
    expect((new Episode(11, 24)).toString()).toBe('S11E24');
  });



});
