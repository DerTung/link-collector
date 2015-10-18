var Episode = require('background/Episode');
var File = require('background/File');
var Link = require('background/Link');

function TopicScraper() {
  this._episodes = [];
}

TopicScraper.prototype.analyze = function(html) {
  this._episodes = [];

  var parser = new DOMParser();
  var doc = parser.parseFromString(html, "text/html");

  var message = this._getFirstMessage(doc);
  this._analyzeMessage(message);

  return this._episodes
};

TopicScraper.prototype._getFirstMessage = function(doc) {
  return doc.querySelector('div.message-content > div.postbody > div.content');
}

TopicScraper.prototype._analyzeMessage = function(message) {
  var episodes = [];
  var elements = message.children;
  var currentFile = null;

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    if (element.innerText == 'Previous Seasons:') {
      break;
    }

    var episode = Episode.fromElement(element);
    if (episode) {
      this._addEpisode(episode);
      continue;
    }
    if (!this._getCurrentEpisode()) {
      continue;
    }

    var file = File.fromElement(element);
    if (file) {
      currentFile = file;
      this._getCurrentEpisode().addFile(file);
    }

    var links = Link.fromElement(element);
    if (links) {
      currentFile.links = links;
    }

  }
};

TopicScraper.prototype._addEpisode = function(episode) {
  if (!episode.equals(this._getCurrentEpisode())) {
    this._episodes.push(episode);
  }
};

TopicScraper.prototype._getCurrentEpisode = function() {
  var length = this._episodes.length;
  return length ? this._episodes[length -1] : null;
};

module.exports = TopicScraper;
