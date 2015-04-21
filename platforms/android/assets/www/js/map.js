var Map = {
  apiKey: 'AlOZRqEsj0I5xiQrAM-KFXr1zQEL43FnN8EA5JpsmkltmLP4VH5eXVg15dsDCfr7',
  settings: {
    severities: [1,2,3,4],
    defaultOrigin: [37.777119,-122.419640],
  },
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
  trafficModuleLoaded: function() {
    Map.trafficManager = new Microsoft.Maps.Traffic.TrafficManager(Map.map);
    // show the traffic Layer
    Map.trafficManager.show();
    Map.trafficManager.showFlow();
    Map.trafficManager.showIncidents();
  },
  init: function(cssId, opts) {
    // Given a css id, init Bing maps and attach it to the selector. Opts:
    // beforeInit: a function to run BEFORE maps are initialized. Return false from this function to cancel maps init.
    // afterInit: a function to run AFTER maps are initialized.
    // severities: an array of non-repeating numbers from 1 to 4 (least to most severe)
    // defaultOrigin: an array of Lat x Long for the starting point on map load
    // Fires two events: map.beforeInit (before any initialization and user function) and map.afterInit (after map initialize and user function)
    if(opts === undefined) { opts = {}; }
    $.event.trigger({type: 'map.beforeInit', map: this});
    if(this.runUserFn(opts.beforeInit) === false) { return false; }

    if(opts.severities !== undefined) { this.settings.severities = opts.severities; }
    if(opts.defaultOrigin !== undefined) { this.settings.defaultOrigin = opts.defaultOrigin; }

    this.mapOptions = {
      credentials: this.apiKey,
      mapTypeId: Microsoft.Maps.MapTypeId.road,
      center: new Microsoft.Maps.Location(this.settings.defaultOrigin[0], this.settings.defaultOrigin[1]),
      zoom: 11
    };

    this.map = new Microsoft.Maps.Map(document.getElementById(cssId), this.mapOptions);
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', { callback: this.createSearchManager })
    Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', { callback: this.trafficModuleLoaded });

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
          var topResult = result.results && result.results[0];
          if (topResult) {
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
    if(this.pushpin === undefined) {
      var pushpinOptions = {draggable: true};
      this.pushpin = new Microsoft.Maps.Pushpin(this.map.getCenter(), pushpinOptions);
      // Microsoft.Maps.Events.addHandler(this.pushpin, 'mouseup', function(e) {
      //   console.debug(e.target.getLocation());
      // });
      this.map.entities.push(this.pushpin);
    }

    this.pushpin.setLocation(this.map.getCenter());
  },
  hidePushPin: function() {
    this.map.entities.remove(this.pushpin);
    this.pushpin = undefined;
  },
  resolveStreetUnderPin: function(callbacks) {
    if(callbacks === undefined) { callbacks = {}; }

    if(this.pushpin === undefined) {
      return false;
    } else {
      $.event.trigger('map.beforeResolve', {map: this});

      var loc = this.pushpin.getLocation();
      var area = [loc.latitude - 0.0001, loc.longitude - 0.0001, loc.latitude + 0.0001, loc.longitude + 0.0001]; // Make a _tiny_ box around the selected point

      // DEBUG: preview polygon
      var polygon = new Microsoft.Maps.Polygon([new Microsoft.Maps.Location(area[0], area[1]), new Microsoft.Maps.Location(area[0], area[3]), new Microsoft.Maps.Location(area[2], area[3]), new Microsoft.Maps.Location(area[2], area[1])], null);
      this.map.entities.push(polygon);

      var opts = {
        url: 'http://dev.virtualearth.net/REST/v1/Traffic/Incidents/' + area.join(',') + '?jsonp=?',
        dataType: 'json',
        method: 'GET',
        data: {
          severity: this.settings.severities,
          type: [1,2,3,4,5,6,7,8,9,10,11], // Almost everything
          key: this.apiKey
        },
        success: function(data) {
          console.debug(data);
          // if length > 0 then there are issues and there is traffic
          if(callbacks.success !== undefined) { callbacks.success(data.resourcesSets[0].resources); }
          $.event.trigger('map.afterResolve', {map: this});
        },
        error: function(xhr, status, err) {
          console.debug('Unable to fetch traffic data:', xhr, status, err);
          if(callbacks.error !== undefined) { callbacks.error(xhr); }
          $.event.trigger('map.afterResolve', {map: this});
        }
      };

      $.ajax(opts);
    }

    return true;
  },
};
