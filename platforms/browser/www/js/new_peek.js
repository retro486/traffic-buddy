require(["map", "main", "data"],  function(map, main, data) {
  data.init();

  var map2 = map.new();

  main.click('#btn-save', function(e) {
    var bounds = map2.map.getBounds();
    var zoom = map2.map.getZoom();
    data.addPeek({name: $('#name').val(), bounds: bounds, zoom: zoom});
    location.href = 'index.html';
  }, false);

  $(document).on('submit', '#map-controls form', function(e) {
    e.preventDefault();
    map2.goToSearch($('#q').val());
  });

  $(document).on('click', '#q + .input-group-addon', function(e) {
    e.preventDefault();
    $('#map-controls form').submit();
  });

  map2.init('map', {
    afterInit: function() {
      map2.attachSearch();
      map2.attachTraffic();
    }
  });
});
