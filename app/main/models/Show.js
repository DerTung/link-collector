function ShowFactory(messageService) {
  
  class Show {
    constructor(data) {
      Object.assign(this, data);
    }
    get lastAired() {
      return localStorage.getItem(this.topicId + '_lastAired');
    }
    set lastAired(value) {
      localStorage.setItem(this.topicId + '_lastAired', value || "");
    }
    get hasUnmarkedEpisodes() {
      return Boolean(localStorage.getItem(this.topicId + '_hasUnmarkedDownloads'));
    }
    set hasUnmarkedEpisodes(value) {
      return localStorage.setItem(this.topicId + '_hasUnmarkedDownloads', value || "");
    }
    
    loadEpisodes() {
      let self = this;
      return messageService.sendMessage({
        action: 'loadShow',
        show: this
      }).then(function(data) {
        self.episodes = data.episodes;
        self.error = data.error;
        if (self.episodes && self.episodes.length) {
          self.hasUnmarkedEpisodes = true;
          if (self.episodes[0].airDate) {
            self.lastAired = self.episodes[0].airDate;
          }
        }
      });
    }
    
    static all() {
      try {
        return JSON.parse(localStorage.showList).map(data => new Show(data));
      } catch (e) {
        return []
      }
    }
    
    static allSorted() {
      let shows = Show.all();
      shows.sort(Show.compare);
      return shows;
    }
    
    static compare(a, b) {
      const msPerDay = 24 * 60 * 60 * 1000;
      const daysPerWeek = 7;
      const fourWeeks = 28;
      
      if (a.hasUnmarkedEpisodes && !b.hasUnmarkedEpisodes) {
        return 1;
      }
      if (b.hasUnmarkedEpisodes && !a.hasUnmarkedEpisodes) {
        return -1;
      }
      
      let dateA = new Date(a.lastAired);
      let dateB = new Date(b.lastAired);
      
      if (isNaN(dateA) && isNaN(dateB)) {
        return 0;
      }
      
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Math.round because of possible differences in daylight saving time.
      let daysAgoA = Math.round((today - dateA) / msPerDay);
      let daysAgoB = Math.round((today - dateB) / msPerDay);
      
      if (daysAgoA > daysAgoB) {
        return Show.compare(b, a) * -1;
      }
      // From here daysAgoA is allways smaller than daysAgoB
      
      if (daysAgoB >= fourWeeks) {
        return daysAgoA >= fourWeeks ? 0 : 1;
      }
      
      if (daysAgoA < daysPerWeek) {
        return daysAgoB < daysPerWeek ? 0 : -1;
      }
      
      let weekDaysAgoA = daysAgoA % daysPerWeek;
      let weekDaysAgoB = daysAgoB % daysPerWeek; 
      
      if (weekDaysAgoA == weekDaysAgoB) {
        return 1;
      }
      return weekDaysAgoB - weekDaysAgoA;
    }
  }
  
  return Show;
}

module.exports = ShowFactory;
