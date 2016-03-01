(function() {
  var app = angular.module('linkCollector', []);
  
  app.factory('filterService', function($rootScope) {
     var options = {
       format: 'FileFilter.format',
       codec: 'FileFilter.codec',
       hoster: 'LinkFilter.hoster',
       onlyLast: 'FileFilter.onlyLast'
     }
     var service = {};
     Object.keys(options).forEach(function(key) {
       var lsKey = options[key];
       console.log(lsKey, localStorage.getItem(lsKey))
       service[key] = localStorage.getItem(lsKey);
       $rootScope.$watch(function() {
        return service[key];
       }, function() {
         console.log(key, service[key], lsKey);
         localStorage.setItem(lsKey, service[key]);
       });
     });
     return service;
  });
  
  app.directive('showList', function() {
    return {
      restrict: 'E',
      templateUrl: 'show-list.html',
      controller:  function($scope, filterService) {
        var showCtrl = this;
        showCtrl.filterService = filterService;
        try {
          showCtrl.shows = JSON.parse(localStorage.showList);
        } catch (e) {
          showCtrl.shows = [];
        }
        
        var loadId = 0;
        function loadShows() {
          // guard against old callbacks when changing filters
          var _loadId = loadId = loadId + 1;
          showCtrl.loaded = 0;
          showCtrl.total = showCtrl.shows.length;
          showCtrl.shows.forEach(function(show) {
            chrome.runtime.sendMessage({action: 'loadShow', show: show}, function(data) {
              if (loadId == _loadId) {
                $scope.$apply(function() {
                  show.episodes = data.episodes;
                  show.error = data.error;
                  showCtrl.loaded++;
                });
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
  });
  
  app.directive('filter', function() {
    return {
      restricted: 'E',
      templateUrl: 'filter.html',
      controller: function($scope, filterService) {
        this.state = filterService;
      },
      controllerAs: 'filterCtrl'
    }
  });
  
  app.directive('credentials', function() {
    return {
      restrict: 'E',
      templateUrl: 'credentials.html',
      controller: function() {
        this.username = localStorage.username;
        this.password = localStorage.password;
        this.save = function() {
          localStorage.username = this.username;
          localStorage.password = this.password;
          this.$setPristine();
        };
        this.clear = function() {
          this.username = '';
          this.password = '';
          this.save();
        };
      },
      controllerAs: 'credentialsCtrl'
    }
  });
  
  app.directive('howto', function() {
    return {
      restrict: 'E',
      templateUrl: 'howto.html',
    }
  });

})();

