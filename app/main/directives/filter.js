function filter() {
  return {
    restricted: 'E',
    templateUrl: 'filter.html',
    controller: function($scope, filterService) {
      this.state = filterService;
    },
    controllerAs: 'filterCtrl'
  }
}

module.exports = filter;
