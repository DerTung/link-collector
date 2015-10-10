function File(format, codec) {
  this.format = format;
  this.codec = codec;
}

File.fromElement = function(element) {
  var m = element.innerText.match(/(AVI|MP4|MKV)\s*\|\s*(XviD|x264)/);
  return m ? new File(m[1], m[2]) : null;
};

module.exports = File;
