var Link = require('background/Link');
var LinkFilter = require('background/LinkFilter');

describe('LinkFilter', function() {
  beforeEach(function() {
    this.linkFilter = new LinkFilter();
    this.links = [new Link('FF', 'https://safelinking.net/91qCA3d'),
                  new Link('UL', 'https://safelinking.net/LnmaUtP'),
                  new Link('RG', 'https://safelinking.net/ShNYaB4')]
  });

  afterEach(function() {
    localStorage.clear();
  });

  it('doesn\'t filter if not configured', function() {
    var links = this.linkFilter.filter(this.links);
    expect(links).toEqual(this.links);
  });

  it('filter\'s by hoster', function() {
    this.linkFilter.setHoster('UL');
    var links = this.linkFilter.filter(this.links);
    expect(links).toEqual([this.links[1]]);
  });

  it('returns the selected filter', function() {
    expect(this.linkFilter.getHoster()).toBe(null);
    this.linkFilter.setHoster('UL');
    expect(this.linkFilter.getHoster()).toBe('UL');
  });
});
