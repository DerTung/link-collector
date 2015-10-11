
var show = {
  title: document.title.match(/](.*)S.*\|/)[1].trim(),
  topicId: location.href.match(/t=(\d+)/)[1]
};

chrome.runtime.sendMessage({action: 'isShowTracked', show: show}, function(response) {
  var tracked = response;
  var button = document.createElement('button');
  button.setAttribute('style', 'position: fixed; top: 5px; right: 5px;');
  updateButton()
  document.body.appendChild(button);
  button.addEventListener('click', function() {    
    chrome.runtime.sendMessage({
      action: tracked ? 'removeShow' : 'addShow',
      show: show
    });
    tracked = !tracked;
    updateButton();
  });

  function updateButton() {
    button.innerText = tracked ? 'Untrack Show' : 'Track Show';
  }
});
