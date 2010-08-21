var OSM = (function() {
  
  var KEY = 'E282E0EA16754AFB98173BF9A17CF874';
  
  var map;
  
  function init() {
    load_map();
    setup_search();
    setup_right_click();
    setup_context_menu();
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
  
  function setup_search() {
    $('#search').submit(function() {
      var query = $('#query').attr('value');

      var geocoder = new CM.Geocoder(KEY);

      geocoder.getLocations(query, function(response) {
      	var southWest = new CM.LatLng(response.bounds[0][0], response.bounds[0][1]),
      	northEast = new CM.LatLng(response.bounds[1][0], response.bounds[1][1]);

      	map.zoomToBounds(new CM.LatLngBounds(southWest, northEast));

      	for (var i = 0; i < response.features.length; i++) {
      		var coords = response.features[i].centroid.coordinates,
      			latlng = new CM.LatLng(coords[0], coords[1]);

      		var marker = new CM.Marker(latlng, {
      			title: response.features[i].properties.name
      		});
      		map.addOverlay(marker);
      	}
      }, { bounds: map.getBounds() });

      return false;
    });
  }
  
  function setup_right_click() {
    CM.Event.addListener(map, 'rightclick', function(latlng) {
    	alert("You have clicked the map at " + latlng.toString(4));
    });
  }
  
  var context_menu;
  
  function setup_context_menu() {
    CM.DomEvent.addListener(map.getPane(CM.Map.MAP_PANE), 'contextmenu', function(event){

        CM.DomEvent.preventDefault(event);
        if(!context_menu){
            context_menu = new CM.ContextMenu({
                // 'obj':_obj
                map: map
            });
        }
        context_menu.show(event);
    });
  }
  return {
    init: init
  };
})();


$(function() {
  OSM.init();
});