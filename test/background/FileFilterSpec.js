var File = require('background/File');
var FileFilter = require('background/FileFilter');

describe('FileFilter', function() {
  
  beforeEach(function() {
    this.fileFilter = new FileFilter();
    this.files = [new File('AVI', 'XviD'), new File('MP4', 'x264'), new File('MKV', 'x264'), new File('MKV', 'x264')];
  });

  afterEach(function() {
    localStorage.clear();
  });

  it('returns all files if codec and format aren\'t specified', function() {
    var files = this.fileFilter.filter(this.files);
    expect(files).toEqual(this.files);
  });

  it('stores the configuration', function() {
    expect(this.fileFilter.getFormat()).toBe(null);    
    expect(this.fileFilter.getCodec()).toBe(null);
    expect(this.fileFilter.getOnlyLast()).toBe(false);

    this.fileFilter.setFormat('MKV');
    this.fileFilter.setCodec('x264');
    this.fileFilter.setOnlyLast(true);

    this.fileFilter = new FileFilter();
    expect(this.fileFilter.getFormat()).toBe('MKV');    
    expect(this.fileFilter.getCodec()).toBe('x264');
    expect(this.fileFilter.getOnlyLast()).toBe(true);
  });

  it('filters files', function() {
    this.fileFilter.setFormat('MKV');
    this.fileFilter.setCodec('x264');
    var files = this.fileFilter.filter(this.files);
    expect(files).toEqual([this.files[2], this.files[3]]);
  });

  it('shows only the last file', function() {
    this.fileFilter.setOnlyLast(true);
    var files = this.fileFilter.filter(this.files);
    expect(files).toEqual([this.files[3]]);
  });

});
