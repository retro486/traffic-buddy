require(["map", "main", "data"],  function(map, main, data) {
  data.init();

  main.click('#btn-save', function(e) {
    // TODO
    var bounds = map.map.getBounds();
    data.addPeek({name: $('#name').val(), bounds: bounds});
    location.href = 'index.html';
  }, false);

  $(document).on('submit', '#map-controls form', function(e) {
    e.preventDefault();
    map.goToSearch($('#q').val());
  });

  map.init('map');
});
