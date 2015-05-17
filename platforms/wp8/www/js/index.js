require(["map", "main", "data", "ads"],  function(map, main, data, ads) {
  data.init();
  ads.init();

  var reloadPeeks = function() {
    var peeks = data.getPeeks();
    var container = $('#index .peek-map-container');
    var template = $('#peek-template').html();

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

    if(content.length == 0) {
      content.push('<p id="no-peeks">Click <i class="glyphicon glyphicon-plus" /> above to add a traffic peek.</p>');
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
  };
  reloadPeeks();

  main.click('.btn-delete', function(e) {
    var name = $(e.target.parentElement).data('name');
    data.deletePeek(name);
    reloadPeeks();
  });

  var newPeekMap = map.new();

  main.click('#btn-save', function(e) {
    var bounds = newPeekMap.map.getBounds();
    var zoom = newPeekMap.map.getZoom();
    data.addPeek({name: $('#name').val(), bounds: bounds, zoom: zoom});
    reloadPeeks();
    $('#btn-back').click();
  });

  $(document).on('submit', '#search-form', function(e) {
    e.preventDefault();
    newPeekMap.goToSearch($('#q').val());
    $('input').trigger('blur');
  });

  $(document).on('submit', '#new-form', function(e) {
    e.preventDefault();
    $('input').trigger('blur');
    $('#btn-save').click();
  });

  main.click('#q + .input-group-addon', function(e) {
    $('#map-controls form').submit();
  });

  newPeekMap.init('map', {
    afterInit: function() {
      newPeekMap.attachSearch();
      newPeekMap.attachTraffic();
    }
  });

  main.click('#btn-new-peek', function(e) {
    $('#app').css('height', $('#new-peek').outerHeight() + 'px').removeClass('showIndex').addClass('showNewPeek');
  });

  main.click('#btn-back', function(e) {
    $('#app').css('height', $('#index').outerHeight() + 'px').removeClass('showNewPeek').addClass('showIndex');
  });
});
