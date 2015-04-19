var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    initMap: function() {
      var mapOptions = {
        credentials: "AlOZRqEsj0I5xiQrAM-KFXr1zQEL43FnN8EA5JpsmkltmLP4VH5eXVg15dsDCfr7",
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        center: new Microsoft.Maps.Location(43.069452, -89.411373),
        zoom: 11
      };
      this.map = new Microsoft.Maps.Map(document.getElementById("map"), mapOptions);
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      $(document).on('deviceready', this.onDeviceReady);
      $(document).on('click touchstart', '#btn-save', function(e) {
        e.preventDefault();
        if(e.handled !== true) {
          var bounds = app.map.getBounds();
          // TODO get streets/traffic within the visible bounds
          console.debug(bounds);
          $('#bounds').html();
        } else {
          return false;
        }
      })
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      app.initMap();

        cordova.plugins.notification.local.on("trigger", function(notification) {
        });
        cordova.plugins.notification.local.schedule({
            id: 1,
            text: "Single Notification",
            //sound: isAndroid ? 'file://sound.mp3' : 'file://beep.caf',
            data: { secret: 'key' }
        });
    },
};

app.initialize();
