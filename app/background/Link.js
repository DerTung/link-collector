function Link(hoster, link) {
  this.hoster = hoster;
  this.link = link;
}

Link.fromElement = function(element) {
  if (element.className == 'post-block code-block') {
    element = element.querySelector('.inner-content');
    var links = element.innerHTML.split('<br>');
    links = links.map(Link.fromText).filter(function(x) {return x});
    return links;
  } else {
    return null;
  }
}

Link.fromText = function(text) {
  var m = text.match(/(\w+):\s+(https?:\/\/.*)/);
  return m ? new Link(m[1], m[2]) : null;
}

module.exports = Link;
