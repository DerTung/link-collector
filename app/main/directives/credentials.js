function credentials() {
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
}

module.exports = credentials;
