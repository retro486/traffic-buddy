require(["map", "main", "data"],  function(map, main, data) {
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
    t.find('.map').first().attr('id', id).attr('data-peek', JSON.stringify(peek));
    t.find('.btn-delete').attr('data-name', peek.name);
    content.push(t[0].outerHTML);
  }

  container.html(content.join(''));

  container.find('.map').each(function() {
    var id = $(this).attr('id');
    var peek = $(this).data('peek');

    var map2 = map.new();
    map2.init(id, {
      defaultOrigin: [peek.bounds.center.latitude, peek.bounds.center.longitude],
      zoom: peek.zoom,
      afterInit: function() {
        Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', { callback: map2.trafficModuleLoaded });
      }
    });
  });

  $(document).on('click', '.btn-delete', function(e) {
    e.preventDefault();
    var name = $(this).data('name');
    data.deletePeek(name);
    location.reload();
  });
});
