function OSM(options) {
  this.options = options;
  this.init();
}

OSM.prototype = (function() {
  return {
    init: function() {
      var cloudmade = new CM.Tiles.CloudMade.Web({key: this.options.key});
      this.map = new CM.Map(this.options.container, cloudmade);
      this.map.setCenter(this.options.location, 15);


      var controllPoss = new CM.ControlPosition(CM.TOP_LEFT, new CM.Size(2, 110));

      // Controls
      this.map.addControl(new CM.LargeMapControl(), controllPoss);
      this.map.addControl(new CM.ScaleControl());
      this.map.addControl(new CM.OverviewMapControl());
      
      // this.map.addControl(new OSM.SearchBar(this));
      
      this.getCurrentLocation();
    },
    
    getGeocoder: function() {
      return new CM.Geocoder(this.options.key);
    },
    
    getMap: function() {
      return this.map;
    },
    
    getCurrentLocation: function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          // Success
          var coord = new CM.LatLng(position.coords.latitude, position.coords.longitude);
          this.map.setCenter(coord);
        }, function(message) {
          // Fail
        });
      }
    }
    
  }
})();
