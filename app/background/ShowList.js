function ShowList() {

}

ShowList.prototype.addShow = function(show) {
  if (!this.contains(show)) {
    var list = this.getList();
    list.push(show);
    this.setList(list);
  }
};

ShowList.prototype.removeShow = function(show) {
  var index = this.findIndex(show);
  if (index != -1) {
    var list = this.getList();
    list.splice(index, 1);
    this.setList(list);
  }
};

ShowList.prototype.getList = function() {
  return JSON.parse(localStorage.getItem('showList')) || [];
};

ShowList.prototype.setList = function(list) {
  localStorage.setItem('showList', JSON.stringify(list));
};

ShowList.prototype.contains = function(show) {
  return this.findIndex(show) != -1;
};

ShowList.prototype.findIndex = function(show) {
  return this.getList().findIndex(function(item) {
    return show.topicId == item.topicId;
  });
};

module.exports = ShowList;
