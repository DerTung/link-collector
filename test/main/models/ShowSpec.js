let ShowFactory = require('main/models/Show');

describe('Show', function() {
  
  describe('compare', function() {
    let Show = ShowFactory();
    let today = 'Sat Apr 02 2016';
    let sixDaysAgo = 'Sun Mar 27 2016';
    let oneWeekAgo = 'Sat Mar 26 2016';
    let eightDaysAgo = 'Fri Mar 25 2016';
    let twelveDaysAgo = 'Mon Mar 21 2016';
    let twoWeeksAgo = 'Sat Mar 19 2016';
    let sixteenDaysAgo = 'Thu Mar 17 2016';
    let fourWeeksAgo = 'Sat Mar 5 2016';
    
    beforeEach(function() {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(today));
    });
    
    afterEach(function() {
      jasmine.clock().uninstall();
    });
    
    function expectIsEqual(a, b) {
      expect(Show.compare(a, b)).toBe(0);
      expect(Show.compare(b, a)).toBe(0);
    }
    
    function expectIsGreater(a, b) {
      expect(Show.compare(a, b)).toBeGreaterThan(0);
      expect(Show.compare(b, a)).toBeLessThan(0);
    }
    
    it('returns 0 if a and b have the same lastAirDate', function() {
      let a = {lastAired: today};
      let b = {lastAired: today};
      expectIsEqual(a, b);
    });
    
    it('returns a week ago is better than today', function() {
      let a = {lastAired: oneWeekAgo};
      let b = {lastAired: today};
      expectIsGreater(a, b);
    });
    
    it('returns a week ago is better than two weeks ago', function() {
      let a = {lastAired: oneWeekAgo};
      let b = {lastAired: twoWeeksAgo};
      expectIsGreater(a, b);
    });
    
    it('returns a week ago is better than 8 days ago', function() {
      let a = {lastAired: oneWeekAgo};
      let b = {lastAired: eightDaysAgo};
      expectIsGreater(a, b);
    });
    
    it('returns 8 days ago is better than 6 days ago', function() {
      let a = {lastAired: eightDaysAgo};
      let b = {lastAired: sixDaysAgo};
      expectIsGreater(a, b);
    });
    
    it('returns 2 weeks ago is better than twelveDaysAgo', function() {
      let a = {lastAired: twoWeeksAgo};
      let b = {lastAired: twelveDaysAgo};
      expectIsGreater(a, b);
    });
        
    it('returns 16 days ago is better than twelveDaysAgo', function() {
      let a = {lastAired: sixteenDaysAgo};
      let b = {lastAired: twelveDaysAgo};
      expectIsGreater(a, b);
    });
    
    it('returns 16 days ago is better than 4 weeks ago', function() {
      let a = {lastAired: sixteenDaysAgo};
      let b = {lastAired: fourWeeksAgo};
      expectIsGreater(a, b);
    });
    
    it('returns unmarkedEpisode is better than a week ago', function() {
      let a = {lastAired: today, hasUnmarkedEpisodes: true};
      let b = {lastAired: oneWeekAgo};
      expectIsGreater(a, b);
    });
    
    it('returns unmarkedEpisode is better than a week ago', function() {
      let a = {lastAired: eightDaysAgo, hasUnmarkedEpisodes: true};
      let b = {lastAired: twelveDaysAgo, hasUnmarkedEpisodes: true};
      expectIsGreater(a, b);
    });
    
    it('returns any date is better than none', function() {
      let a = {lastAired: eightDaysAgo, hasUnmarkedEpisodes: true};
      let b = {};
      expectIsGreater(a, b);
    });
    
    it('returns 0 without any information', function() {
      let a = {};
      let b = {};
      expectIsEqual(a, b);
    });
    
  });
  
});