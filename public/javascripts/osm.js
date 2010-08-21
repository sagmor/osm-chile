var OSM = (function() {
  
  var KEY = 'E282E0EA16754AFB98173BF9A17CF874';
  
  var map;
  
  function init() {
    load_map();
  }
  
  function load_map() {
    var cloudmade = new CM.Tiles.CloudMade.Web({key: KEY});
    map = new CM.Map('map', cloudmade);
    map.setCenter(new CM.LatLng(-33.437833, -70.650333), 15);

    // Controls
    map.addControl(new CM.LargeMapControl());
    map.addControl(new CM.ScaleControl());
    map.addControl(new CM.OverviewMapControl());
  }
  
  return {
    init: init
  };
})();


$(function() {
  OSM.init();
});