function showList() {
  return {
    restrict: 'E',
    templateUrl: 'show-list.html',
    controller:  function($scope, messageService, filterService) {
      var showCtrl = this;
      showCtrl.filterService = filterService;
      try {
        showCtrl.shows = JSON.parse(localStorage.showList);
      } catch (e) {
        showCtrl.shows = [];
      }
      
      showCtrl.markDownloaded = function() {
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
          messageService.sendMessage({action: 'loadShow', show: show}).then(function (data) {
            if (loadId == _loadId) {
              show.episodes = data.episodes;
              show.error = data.error;
              showCtrl.loaded++;
              showCtrl.episodeCount += show.episodes.length;
            }
          })
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
