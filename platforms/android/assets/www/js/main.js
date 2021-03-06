define(function() { var self = {
  click: function(selector, fn, preventDefault) {
    if(preventDefault === undefined) { preventDefault = true; }
    $(document).on('click touchstart', selector, function(e) {
      if(preventDefault) { e.preventDefault(); }
      if(!e.handled) {
        fn(e);
      } else {
        return false;
      }
    });
  }
}; return self;}());
