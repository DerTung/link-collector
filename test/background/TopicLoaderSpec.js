var TopicLoader = require('background/TopicLoader')

describe('TopicLoader', function() {

  beforeEach(function() {
    fixture.load('goodWife.htm');
    jasmine.Ajax.install();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  })

  it('is awesome', function() {
    expect(true).toBe(true);
  });

  it('loads a page', function(done) {
    var topicLoader = new TopicLoader(); 
    var promise = topicLoader.load(12255785);
    var fulfilledHandler = jasmine.createSpy('fulfilledHandler');
    promise.then(function(data) {
      expect(data).toEqual(fixture.el.innerHTML);
      done();
    }, function() {
      console.log(arguments);
      done.fail();
    });

    expect(jasmine.Ajax.requests.mostRecent().url).toBe('https://www.warez-bb.org/viewtopic.php?t=12255785');
    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "text/html",
      "responseText": fixture.el.innerHTML
    });

  });
});
