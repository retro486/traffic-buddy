var Map = {
  runUserFn: function(fn) {
    if(fn !== undefined && typeof(fn) === 'function') {
      return fn();
    } else {
      return true; // don't die on bad input
    }
  },
  createSearchManager: function() {
    if (!Map.searchManager) {
      Map.map.addComponent('searchManager', new Microsoft.Maps.Search.SearchManager(Map.map));
      Map.searchManager = Map.map.getComponent('searchManager');
    }
  },
  init: function(cssId, opts) {
    // Given a css id, init Bing maps and attach it to the selector. Opts:
    // beforeInit: a function to run BEFORE maps are initialized. Return false from this function to cancel maps init.
    // afterInit: a function to run AFTER maps are initialized.
    // Fires two events: map.beforeInit (before any initialization and user function) and map.afterInit (after map initialize and user function)
    if(opts === undefined) { opts = {}; }
    $.event.trigger({type: 'map.beforeInit', map: this});
    if(this.runUserFn(opts.beforeInit) === false) { return false; }

    this.mapOptions = {
      credentials: 'AlOZRqEsj0I5xiQrAM-KFXr1zQEL43FnN8EA5JpsmkltmLP4VH5eXVg15dsDCfr7',
      mapTypeId: Microsoft.Maps.MapTypeId.road,
      center: new Microsoft.Maps.Location(43.069452, -89.411373),
      zoom: 11
    };

    this.map = new Microsoft.Maps.Map(document.getElementById(cssId), this.mapOptions);
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', { callback: this.createSearchManager })

    this.runUserFn(opts.afterInit);
    $.event.trigger({type: 'map.afterInit', map: this});
    return this;
  },
  goToSearch: function(searchString) {
    // Given an arbitrary search value (county, street address, city, etc) snap the current viewport to it, retaining zoom. Might want to reset zoom...
    $.event.trigger({type: 'map.beforeSearch', map: this});

    var liveMap = this;
    var request = {
      where: searchString,
      count: 5,
      bounds: this.map.getBounds(),
      callback: function(result, userData) {
        if (result) {
          liveMap.map.entities.clear();
          var topResult = result.results && result.results[0];
          if (topResult) {
            // TODO look into pushpin for selecting a road...
            // var pushpin = new Microsoft.Maps.Pushpin(topResult.location, null);
            // map.entities.push(pushpin);
            liveMap.map.setView({ center: topResult.location, zoom: 13 });
          }
        }
        $.event.trigger({type: 'map.afterSearch', map: liveMap});
      },
      errorCallback: function(result, userData) {
        $.event.trigger({type: 'map.errorSearch', map: liveMap, errors: result});
      },
      userData: { name: 'Maps Test User', id: 'XYZ' }
    };
    this.hidePushPin();
    this.searchManager.geocode(request);
  },
  showPushPin: function() {
    this.hidePushPin();
    var pushpinOptions = {draggable: true};
    this.pushpin = new Microsoft.Maps.Pushpin(this.map.getCenter(), pushpinOptions);
    Microsoft.Maps.Events.addHandler(this.pushpin, 'mouseup', function(e) {
      console.debug(e.target.getLocation());
    });
    this.map.entities.push(this.pushpin);
  },
  hidePushPin: function() {
    this.map.entities.clear();
    this.pushpin = undefined;
  },
  resolveStreetsInView: function() {
    // Grabs a list of all the streets with traffic data in the current viewport.
  }
};
