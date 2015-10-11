var ShowList = require('background/ShowList');

describe('ShowList', function() {
  var showList = null;
  var show1 = {
    title: 'Show1',
    topicId: 1
  };
  var show2 = {
    title: 'Show2',
    topicId: 2
  };
  
  beforeEach(function() {
    localStorage.removeItem('showList');
    showList = new ShowList();
  });

  it('adds a shows', function() {
    showList.addShow(show1);
    showList.addShow(show2);
    expect(showList.getList()).toEqual([show1, show2]);
  });

  it('determines contained shows', function() {
    expect(showList.contains(show1)).toBe(false);
    showList.addShow(show1);
    expect(showList.contains(show1)).toBe(true);
    expect(showList.contains(show2)).toBe(false);
  });

  it('adds a shows', function() {
    showList.addShow(show1);
    showList.addShow(show2);
    showList.removeShow(show1);
    expect(showList.getList()).toEqual([show2]);
  });
});
