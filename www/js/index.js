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
    var id = (new Date()).getTime();
    t.find('div').first().attr('id', id);
    content.push(t[0].outerHTML);
  }

  container.html(content.join(''));

  container.find('div').each(function() {
    var id = $(this).attr('id');
    map.init(id);
  });
});
