require(["main", "map", "main", "data"],  function(main, map, index, data) {
  data.init();

  for(var i in data.peeks) {
    var peek = data.peeks[i];
    console.debug(peek);
  }

  map.init('map');
});
