function showList() {
  return {
    restrict: 'E',
    templateUrl: 'show-list.html',
    controller:  function($scope, Show, messageService, filterService) {
      var showCtrl = this;
      showCtrl.filterService = filterService;
      showCtrl.shows = Show.allSorted();
      
      showCtrl.markDownloaded = function() {
        showCtrl.shows.forEach(show => show.hasUnmarkedEpisodes = false);
        messageService.sendMessage({
          action: 'addDownloaded',
          shows: showCtrl.shows
        }).then(loadShows);
      };
      
      var loadId = 0;
      function loadShows() {
        // guard against old callbacks when changing filters
        var _loadId = loadId = loadId + 1;
        showCtrl.episodeCount = 0;
        showCtrl.loaded = 0;
        showCtrl.total = showCtrl.shows.length;
        showCtrl.shows.forEach(function(show) {
          show.loadEpisodes().then(function (data) {
            if (loadId === _loadId) {
              showCtrl.loaded++;
              showCtrl.episodeCount += show.episodes.length;
            }
          });
        });
      }
      $scope.$watch(function () {
        return filterService;
      }, loadShows, true);
    },
    controllerAs: 'showCtrl'
  };
}

module.exports = showList;
