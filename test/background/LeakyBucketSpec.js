var LeakyBucket = require('../../app/background/LeakyBucket');

describe('LeakyBucket', function() {
  var bucket = null;
  var size = 3;
  var interval = 1000; //ms
  
  beforeEach(function() {
    jasmine.clock().install();
    bucket = new LeakyBucket(size, interval);
  })
  
  afterEach(function() {
    jasmine.clock().uninstall();
  });
  
  it('starts out empty', function() {
    expect(bucket.isFull()).toBe(false);
  });
  
  it('fills up when added to', function() {
    bucket.add(2);
    expect(bucket.isFull()).toBe(false);
    bucket.add();
    expect(bucket.isFull()).toBe(true);
  });
  
  it('drains over time', function() {
    bucket.add(3);
    expect(bucket.isFull()).toBe(true);
    jasmine.clock().tick(interval);
    expect(bucket.isFull()).toBe(false);
  });
  
  it('emits an event when it starts draining', function() {
    var onDraining = jasmine.createSpy('onDraining');
    bucket.on('draining', onDraining);
    bucket.add(3);
    jasmine.clock().tick(interval);
    expect(onDraining).toHaveBeenCalled();
    bucket.add()
    jasmine.clock().tick(interval);
    expect(onDraining.calls.count()).toBe(2);
    jasmine.clock().tick(interval * 3);
    expect(onDraining.calls.count()).toBe(2);
  });
});