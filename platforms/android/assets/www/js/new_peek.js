$(document).on('deviceready', function() {
  app.click('#btn-save', function(e) {
    var ret = Map.resolveStreetUnderPin();
    if(!ret) {
      console.debug('No pin was set.');
    }
  });

  // this.click('#btn-pin', function(e) {
  //   if(Map.pushpin === undefined) {
  //     Map.showPushPin();
  //   } else {
  //     Map.hidePushPin();
  //   }
  // });

  $(document).on('submit', '#map-controls form', function(e) {
    e.preventDefault();
    Map.goToSearch($('#q').val());
  });

  Map.init('map');
});
