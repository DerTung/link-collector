var linksTemplate = require('./linksTemplate.mustache');
var shows;
chrome.runtime.sendMessage({action: 'getData'}, function(response) {
  shows = response.shows;
  console.log(response);
  document.querySelector('#links').innerHTML = linksTemplate(response);
});

function markDownloaded() {
  chrome.runtime.sendMessage({action: 'addDownloaded', shows: shows});
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('markDownloaded').addEventListener('click', markDownloaded);
});
