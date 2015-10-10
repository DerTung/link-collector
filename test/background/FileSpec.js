var File = require('background/File');

describe('File', function() {
  
  describe('fromElement', function() {

    it('recognizes AVI | XviD', function() {
      var element = document.createElement('span');
      element.innerHTML = '<span style="color: green;"><span style="font-style: italic;">AVI | XviD</span></span>';
      
      var file = File.fromElement(element);
      expect(file).toEqual(jasmine.objectContaining({
        format: 'AVI',
        codec: 'XviD'
      }));
    });

    it('recognizes MP4 | x264', function() {
      var element = document.createElement('span');
      element.innerHTML = '<span style="color: green;"><span style="font-style: italic;">MP4 | x264</span></span>';
      
      var file = File.fromElement(element);
      expect(file).toEqual(jasmine.objectContaining({
        format: 'MP4',
        codec: 'x264'
      }));
    });

    it('recognizes MKV | x264', function() {
      var element = document.createElement('span');
      element.innerHTML = '<span style="color: green;"><span style="font-style: italic;">MKV | x264</span></span>';
      
      var file = File.fromElement(element);
      expect(file).toEqual(jasmine.objectContaining({
        format: 'MKV',
        codec: 'x264'
      }));
    });

  });

});
