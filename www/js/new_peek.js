require(["map", "index", "data"],  function(map, index, data) {
  data.init({errorHandler: function(msg) {
    $('#error').html(msg).fadeIn();
  }});

  index.click('#btn-save', function(e) {
    // TODO
    var bounds = map.map.getBounds();
    console.debug(bounds);
    data.addPeek(data.Peek.init({name: $('#name').val(), bounds: bounds}));
  }, false);

  // this.click('#btn-pin', function(e) {
  //   if(Map.pushpin === undefined) {
  //     Map.showPushPin();
  //   } else {
  //     Map.hidePushPin();
  //   }
  // });

  $(document).on('submit', '#map-controls form', function(e) {
    e.preventDefault();
    map.goToSearch($('#q').val());
  });

  map.init('map');
});
