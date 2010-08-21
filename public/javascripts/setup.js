$(function() {
  KEY = "E282E0EA16754AFB98173BF9A17CF874";
  DEFAULT_LOCATION = new CM.LatLng(-33.437833, -70.650333);
  
  new OSM({
    key: KEY,
    location: DEFAULT_LOCATION,
    container: 'map'
  })
});

