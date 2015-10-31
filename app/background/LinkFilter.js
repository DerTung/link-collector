function LinkFilter() {
    
}

LinkFilter.prototype.setHoster = function(hoster) {
  if (hoster) {
    localStorage.setItem('LinkFilter.hoster', hoster);
  } else {
    localStorage.removeItem('LinkFilter.hoster');
  }
};

LinkFilter.prototype.getHoster = function() {
  return localStorage.getItem('LinkFilter.hoster') || null;
};

LinkFilter.prototype.filter = function(links) {
  var hoster = this.getHoster();
  return links.filter(function(link) {
    return !hoster || link.hoster == hoster;
  });
};

module.exports = LinkFilter;
