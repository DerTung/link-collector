var TopicLoader = require('background/TopicLoader')

describe('TopicLoader', function() {

  beforeEach(function() {
    fixture.load('goodWife.htm');
    jasmine.Ajax.install();

    this.topicLoader = new TopicLoader(); 
    this.promise = this.topicLoader.load(12255785);
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  })

  it('loads a page', function(done) {
    this.promise.then(function(data) {
      expect(data).toEqual(fixture.el.innerHTML);
      done();
    }, done.fail);

    expect(jasmine.Ajax.requests.mostRecent().url).toBe('https://www.warez-bb.org/viewtopic.php?t=12255785');
    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "text/html",
      "responseText": fixture.el.innerHTML
    });
  });

  it('rejects when the topic is not found', function(done) {
    this.promise.then(function(data) {
      done.fail('should have been rejected');
    }, function(data) {
      expect(data).toBe("Topic not found");
      done()
    });

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "text/html",
      "responseText": "<html>...The topic or post you requested does not exist...</html>"
    });
  });

  it('gracefully handles other errors', function(done) {
    this.promise.then(function(data) {
      done.fail('should have been rejected');
    }, function(data) {
      expect(data).toBe("File not found");
      done()
    });

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 404,
      "contentType": "text/html",
      "responseText": "File not found"
    });
  });

  it('caches responses', function(done) {
    jasmine.clock().install();
    expect(jasmine.Ajax.requests.mostRecent().url).toBe('https://www.warez-bb.org/viewtopic.php?t=12255785');
    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "text/html",
      "responseText": fixture.el.innerHTML
    });

    var promise = this.topicLoader.load(12255785);
    promise.then(function(data) {
      expect(data).toEqual(fixture.el.innerHTML);
      done();
    }, done.fail);

    expect(jasmine.Ajax.requests.count()).toBe(1);

    jasmine.clock().tick(this.topicLoader.CACHE_DURATION);
    
    this.topicLoader.load(12255785);

    expect(jasmine.Ajax.requests.count()).toBe(2);

    jasmine.clock().uninstall();
  });

});
