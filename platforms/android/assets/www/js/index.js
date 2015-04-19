var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },

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
  },

  bindEvents: function() {
    $(document).on('deviceready', this.onDeviceReady);

    this.click('#btn-save', function(e) {
      var bounds = app.map.getBounds();
      // TODO get streets/traffic within the visible bounds
      console.debug(bounds);
    });

    this.click('#btn-pin', function(e) {
      if(Map.pushpin === undefined) {
        Map.showPushPin();
      } else {
        Map.hidePushPin();
      }
    });

    $(document).on('submit', '#map-controls form', function(e) {
      e.preventDefault();
      Map.goToSearch($('#q').val());
    });
  },

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    Map.init('map');

    // cordova.plugins.notification.local.on("trigger", function(notification) {
    // });
    // cordova.plugins.notification.local.schedule({
    //     id: 1,
    //     text: "Single Notification",
    //     //sound: isAndroid ? 'file://sound.mp3' : 'file://beep.caf',
    //     data: { secret: 'key' }
    // });
  },
};

app.initialize();
