define(function() { var self = {
  peeks: [],
  init: function() {
    var localPeeks = localStorage.getItem('peeks');
    if(localPeeks === undefined || localPeeks === null) self.peeks = [];
    else self.peeks = JSON.parse(localPeeks);
  },
  addPeek: function(data) {
    self.peeks.push(data);
    self.save();
  },
  save: function() {
    localStorage.setItem('peeks', JSON.stringify(self.peeks));
  },
  getPeeks: function() {
    return self.peeks;
  },
  deletePeek: function(name) {
    self.peeks = self.peeks.filter(function(e) { return e.name !== name; });
    self.save();
    return self.peeks;
  }
}; return self;}());
