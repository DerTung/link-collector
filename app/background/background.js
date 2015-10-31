var Promise = require('bluebird');

var TopicLoader = require('./TopicLoader');
var TopicScraper = require('./TopicScraper');
var ShowList = require('./ShowList');
var ShowView = require('./ShowView');
var EpisodeFilter = require('./EpisodeFilter');
var FileFilter = require('./FileFilter');
var LinkFilter = require('./LinkFilter');

var showList = new ShowList();
var topicLoader = new TopicLoader();
var topicScraper = new TopicScraper();
var episodeFilter = new EpisodeFilter();
var fileFilter = new FileFilter();
var linkFilter = new LinkFilter();
var showView = new ShowView(showList, 
                            topicScraper, 
                            topicLoader, 
                            episodeFilter,
                            fileFilter,
                            linkFilter);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "getData") {
    showView.getData().then(sendResponse);
    return true;
  } else if (request.action == "getSettings") {
    sendResponse({
      format: fileFilter.getFormat(),
      codec: fileFilter.getCodec(),
      hoster: linkFilter.getHoster(),
      onlyLast: fileFilter.getOnlyLast()
    });
  } else if (request.action == "addShow") {
    showList.addShow(request.show);
  } else if (request.action == "removeShow") {
    showList.removeShow(request.show);
  } else if (request.action == "isShowTracked") {
    sendResponse(showList.contains(request.show));
  } else if (request.action == 'addDownloaded') {
    episodeFilter.addShows(request.shows);
  } else if (request.action == 'setFormat') {
    fileFilter.setFormat(request.value);
  } else if (request.action == 'setCodec') {
    fileFilter.setCodec(request.value);
  } else if (request.action == 'setHoster') {
    linkFilter.setHoster(request.value);
  } else if (request.action == 'setOnlyLast') {
    fileFilter.setOnlyLast(request.value);
  }
});

chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({
    url: chrome.extension.getURL('popup/popup.html')
  });
});

