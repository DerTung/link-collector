var linksTemplate = require('./linksTemplate.mustache');
var shows;
var $ = document.querySelector.bind(document);

function markDownloaded() {
  chrome.runtime.sendMessage({action: 'addDownloaded', shows: shows});
  updateData();
}

function updateData() {
  chrome.runtime.sendMessage({action: 'getData'}, function(response) {
    shows = response.shows;
    $('#links').innerHTML = linksTemplate(response);
    $('#markDownloaded').setAttribute('style', response.episodeCount ? '' : 'display: none');
  });
}

function updateSettings() {
  chrome.runtime.sendMessage({action: 'getSettings'}, function(response) {
    $('#format').value = response.format;
    $('#codec').value = response.codec;
    $('#hoster').value = response.hoster;
    $('#onlyLast').checked = response.onlyLast;
  });
}

function setCredentials() {
  chrome.runtime.sendMessage({
    action: 'setCredentials',
    username: $('#username').value,
    password: $('#password').value
  });
}

document.addEventListener('DOMContentLoaded', function() {
  
  updateData();
  updateSettings();
  $('#username').value = localStorage.username || '';
  $('#password').value = localStorage.password || '';

  
  $('#markDownloaded').addEventListener('click', markDownloaded);
  
  $('#format').addEventListener('change', function() {
    chrome.runtime.sendMessage({action: 'setFormat', value: this.value});
    updateData();
  });

  $('#codec').addEventListener('change', function() {
    chrome.runtime.sendMessage({action: 'setCodec', value: this.value});
    updateData();
  });

  $('#hoster').addEventListener('change', function() {
    chrome.runtime.sendMessage({action: 'setHoster', value: this.value});
    updateData();
  });

  $('#onlyLast').addEventListener('change', function() {
    chrome.runtime.sendMessage({action: 'setOnlyLast', value: this.checked});
    updateData();
  });

  $('#setCredentials').addEventListener('click', function() {
    setCredentials();
    updateData();
  });

  $('#clearCredentials').addEventListener('click', function() {
    $('#username').value = "";
    $('#password').value = "";
    setCredentials();
  });

});
