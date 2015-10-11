var Promise = require('bluebird');

var TopicLoader = require('./TopicLoader');
var TopicScraper = require('./TopicScraper');
var ShowList = require('./ShowList');
var ShowView = require('./ShowView');
var EpisodeFilter = require('./EpisodeFilter');

var showList = new ShowList();
var topicLoader = new TopicLoader();
var topicScraper = new TopicScraper();
var episodeFilter = new EpisodeFilter();
var showView = new ShowView(showList, topicScraper, topicLoader, episodeFilter);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "getData") {
    showView.getData().then(sendResponse);
    return true;
  } else if (request.action == "addShow") {
    showList.addShow(request.show);
  } else if (request.action == "removeShow") {
    showList.removeShow(request.show);
  } else if (request.action == "isShowTracked") {
    sendResponse(showList.contains(request.show));
  } else if (request.action == 'addDownloaded') {
    episodeFilter.addDownloaded(request.shows);
  }
});

chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({
    url: chrome.extension.getURL('popup/popup.html')
  });
});

