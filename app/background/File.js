function File(format, codec) {
  this.format = format;
  this.codec = codec;
}

File.fromElement = function(element) {
  var m = element.innerText.match(/(AVI|MP4|MKV)\s*\|\s*(XviD|x264|x265|HEVC|HECV)/);
  if (m) {
    var format = m[1];
    var codec = m[2];
    if (codec == 'HECV') {
      codec = 'HEVC'; // Fix typos in codec
    }
    return new File(format, codec);
  }
  return null;
};

module.exports = File;
