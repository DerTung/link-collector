var TopicLoader = require('background/TopicLoader')

describe('TopicLoader', function() {

  beforeEach(function() {
    fixture.load('goodWife.htm');
    jasmine.Ajax.install();

    this.topicLoader = new TopicLoader(); 
    this.promise = this.topicLoader.load(12255785);
  });

  afterEach(function() {
    localStorage.clear();
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
      done();
    });

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "text/html",
      "responseText": "<html>...The topic or post you requested does not exist...</html>"
    });
  });

  it('rejects when the topic is temporarily unavailable', function(done) {
    this.promise.then(function(data) {
      done.fail('should have been rejected');
    }, function(data) {
      expect(data).toBe("Topic temporarily unavailable");
      done();
    });

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "text/html",
      "responseText": "The page you are looking for is temporarily unavailable. Please try again later."
    });
  })

  it('gracefully handles other errors', function(done) {
    this.promise.then(function(data) {
      done.fail('should have been rejected');
    }, function(data) {
      expect(data).toBe("File not found");
      done();
    });

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 404,
      "contentType": "text/html",
      "responseText": "File not found"
    });
  });

  it('logs in the user', function(done) {
    this.topicLoader.login('john@example.com', 'qwerty', 1).then(function(data) {
      done();
    }, function(error) {
      done.fail(error)
    });

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "text/html",
      "responseText": "Logged in"
    });
  });

  it('recognizes wrong credentials', function(done) {
    this.topicLoader.login('john@example.com', 'qwerty').then(function(data) {
      done.fail('Promise should have been rejected');
    }, function(error) {
      expect(error).toBe('Wrong username or password');
      done();
    });

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "text/html",
      "responseText": "<html>It appears that you have entered an incorrect password</html>"
    });
  });

  it('logs in if not logged in during load', function(done) {
    this.topicLoader.setCredentials('john@example.com', 'qwerty');
    this.promise.then(function(data) {
      expect(data).toEqual(fixture.el.innerHTML);
      done();
    }, function(error) {
      done.fail('Failed to load topic');
    });

    fixture.load('blueBloodsLogin.htm');   
    var responseLoggedOut = fixture.el.innerHTML;
    fixture.load('blueBloods.htm');
    var responseLoggedIn = fixture.el.innerHTML;


    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "text/html",
      "responseText": responseLoggedOut
    });

    expect(jasmine.Ajax.requests.mostRecent().url).toBe('https://www.warez-bb.org/login.php');
    
    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "text/html",
      "responseText": "Logged in"
    });

    jasmine.Ajax.stubRequest('https://www.warez-bb.org/viewtopic.php?t=12255785').andReturn({
      "status": 200,
      "contentType": "text/html",
      "responseText": responseLoggedIn
    });

  });

  it('does not log in without credentials', function(done) {
    this.promise.then(function(data) {
      expect(data).toEqual(fixture.el.innerHTML);
      done.fail('Should have been rejected');
    }, function(error) {
      expect(error).toBe('Login to load topic');
      done();
    });

    fixture.load('blueBloodsLogin.htm');   
    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "text/html",
      "responseText": fixture.el.innerHTML
    });

    expect(jasmine.Ajax.requests.mostRecent().url).not.toBe('https://www.warez-bb.org/login.php');

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

  describe('_encodeData', function() {
    it('enocedes a single key value pair', function() {
      expect(this.topicLoader._encodeData({
        'abc': 123
      })).toBe('abc=123');
    });

    it('escapes special characters', function() {
      expect(this.topicLoader._encodeData({
        'a&c': '1 3'
      })).toBe('a%26c=1%203');
    });

    it('encodes two pairs', function() {
      expect(this.topicLoader._encodeData({
        'abc': '123',
        'def': '456'
      })).toBe('abc=123&def=456');
    });
  });

});
