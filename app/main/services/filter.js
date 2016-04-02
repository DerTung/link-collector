function filterService($rootScope) {
  var options = {
    format: 'FileFilter.format',
    codec: 'FileFilter.codec',
    hoster: 'LinkFilter.hoster',
    onlyLast: 'FileFilter.onlyLast'
  }
  var service = {};
  Object.keys(options).forEach(function(key) {
    var lsKey = options[key];
    service[key] = localStorage.getItem(lsKey);
    $rootScope.$watch(function() {
      return service[key];
    }, function() {
      localStorage.setItem(lsKey, service[key]);
    });
  });
  return service;
}

module.exports = filterService;
