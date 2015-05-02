require(["main", "map", "data"],  function(main, map, data) {
  data.init();
  
  var peeks = data.getPeeks();
  var container = $('#peek-map-container');
  var template = container.html();
  
  var content = [];
  for(var i in peeks) {
    var peek = peeks[i];
    var t = $(template);
    t.find('label').html(peek.name);
    var m = t.find('div');
    var id = (new Date()).getTime();
    $(m).attr('id', id);
    map.init('#' + id);
    content.push(t[0].outerHTML);
  }
  
  container.html(content.join(''));
  
//  $('#peek-map-container div').each(function() {
//    var id = $(this).attr('id');
//    map.init('#' + id);
//  });
});
