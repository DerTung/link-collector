var Link = require('background/Link');

describe('Link', function() {

  it('extracts links from text', function() {
    expect(Link.fromText('NF: https://safelinking.net/Ao5ZNjC'));
  });

  it('extracts links from an element', function() {
    var element = document.createElement('div');
    element.setAttribute('class', 'post-block code-block');
    element.innerHTML = 
      '<div class="label"><strong>Code: <span class="select-all">Select all</span></strong></div><div class="code"><span class="inner-content">' +
      'NF: https://safelinking.net/Ao5ZNjC' +
      '<br>' +
      'HF: https://safelinking.net/7MCQBPZ' +
      // '<br>' +
      // 'MEGA: https://safelinking.net/ufbu93X' +
      // '<br>' +
      // 'CNU: https://safelinking.net/jcEF9Rq' +
      // '<br>' +
      // 'ULD: https://safelinking.net/sQtQwKp' +
      // '<br>' +
      // 'FF: https://safelinking.net/y4TsW8t' +
      // '<br>' +
      // 'UL: https://safelinking.net/GXRhmPr' +
      // '<br>' +
      // 'RG: https://safelinking.net/ZfeSs6W' + 
      '</span></div>';
    links = Link.fromElement(element);
    expect(links.length).toBe(2);
    expect(links[0]).toEqual(jasmine.objectContaining({
      hoster: 'NF',
      link: 'https://safelinking.net/Ao5ZNjC'
    }));
    expect(links[1]).toEqual(jasmine.objectContaining({
      hoster: 'HF',
      link: 'https://safelinking.net/7MCQBPZ'
    }));
  });

  it('extracts links from an element', function() {
    var element = document.createElement('table');
    element.innerHTML = 
      '<tr>' +
      '<td><span class="genmed"><strong>Code:</strong></span></td>' +
      '</tr>' +
      '<tr>' +
      '<td class="code">NF&#58; https&#58;//safelinking.net/fj7KzFf' +
      '<br />' +
      'UL&#58; https&#58;//safelinking.net/dNMWhPG' +
      '<br />' +
      'RG&#58; https&#58;//safelinking.net/PF9bxdS</td></tr>';
    links = Link.fromElement(element);
    expect(links.length).toBe(3);
    expect(links[0]).toEqual(jasmine.objectContaining({
      hoster: 'NF',
      link: 'https://safelinking.net/fj7KzFf'
    }));
    expect(links[1]).toEqual(jasmine.objectContaining({
      hoster: 'UL',
      link: 'https://safelinking.net/dNMWhPG'
    }));
    expect(links[2]).toEqual(jasmine.objectContaining({
      hoster: 'RG',
      link: 'https://safelinking.net/PF9bxdS'
    }));
  });

});
