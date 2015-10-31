function FileFilter() {

}

FileFilter.prototype.setItem = function(key, value) {
  key = 'FileFilter.' + key;
  if (value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
}

FileFilter.prototype.getItem = function(key) {
  key = 'FileFilter.' + key;
  return localStorage.getItem(key) || null;
}

FileFilter.prototype.setFormat = function(format) {
  this.setItem('format', format);
}

FileFilter.prototype.setCodec = function(codec) {
  this.setItem('codec', codec);
}

FileFilter.prototype.setOnlyLast = function(value) {
  this.setItem('onlyLast', value);
}

FileFilter.prototype.getFormat = function() {
  return this.getItem('format');
}

FileFilter.prototype.getCodec = function() {
  return this.getItem('codec');
}

FileFilter.prototype.getOnlyLast = function() {
  return this.getItem('onlyLast') == 'true';
}

FileFilter.prototype.filter = function(files) {
  var format = this.getFormat();
  var codec = this.getCodec();
  files = files.filter(function(file) {
    return (!format || file.format == format) && (!codec || file.codec == codec);
  });
  if (this.getOnlyLast() && files.length) {
    files = [files[files.length - 1]];
  }
  return files;
}

module.exports = FileFilter;
