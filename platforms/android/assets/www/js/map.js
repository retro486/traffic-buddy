var Map = {
  apiKey: 'AlOZRqEsj0I5xiQrAM-KFXr1zQEL43FnN8EA5JpsmkltmLP4VH5eXVg15dsDCfr7',
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
    // Fires two events: map.beforeInit (before any initialization and user function) and map.afterInit (after map initialize and user function)
    if(opts === undefined) { opts = {}; }
    $.event.trigger({type: 'map.beforeInit', map: this});
    if(this.runUserFn(opts.beforeInit) === false) { return false; }

    this.mapOptions = {
      credentials: this.apiKey,
      mapTypeId: Microsoft.Maps.MapTypeId.road,
      center: new Microsoft.Maps.Location(43.069452, -89.411373),
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
      var area = [loc.longitude - 0.001, loc.latitude - 0.001, loc.longitude + 0.001, loc.latitude + 0.001].join(','); // Make a _tiny_ box around the selected point
      var opts = {
        url: 'http://dev.virtualearth.net/REST/v1/Traffic/Incidents/' + area + '?jsonp=?',
        dataType: 'json',
        method: 'GET',
        data: {
          severity: '2,3,4',
          type: 9,
          key: this.apiKey
        },
        success: function(data) {
          console.debug(data);
          if(callbacks.success !== undefined) { callbacks.success(data); }
          $.event.trigger('map.afterResolve', {map: this});
        },
        error: function(xhr, status, err) {
          console.debug('Unable to fetch traffic data:', xhr, status, err);
          if(callbacks.error !== undefined) { callbacks.error(xhr); }
          $.event.trigger('map.afterResolve', {map: this});
        }
      };

      $.ajax(opts);
      // $.getJSON('http://dev.virtualearth.net/REST/v1/Traffic/Incidents/' + area + '?severity=2,3,4&type=9&key=' + this.apiKey + '&jsonp=?', function(data) {
      //   console.debug(data);
      // });
    }

    return true;
  },
};
