var OSM = (function() {
  
  var KEY = 'E282E0EA16754AFB98173BF9A17CF874';
  
  var map;
  
  function init() {
    load_map();
    setup_search();
    //setup_right_click();
    //setup_context_menu();
    
    $('#permalink_edit').click(function() {
        var langlot = map.getCenter()
        var longitud = langlot.lng()
        var latitud = langlot.lat()
        var zoom = map.getZoom()
        //console.log(longitud + ' ' + latitud + ' ' + zoom)
        var url = 'http://www.openstreetmap.org/edit.html?zoom=' + zoom + '&lat=' + latitud + '&lon=' + longitud;
        window.location = url
    });
  }
  
  
    var mouseX
    var mouseY
    
    var fromPointer = null;
    var toPointer = null;
    
    var directions = null
  
  function load_map() {
    var cloudmade = new CM.Tiles.CloudMade.Web({key: KEY});
    map = new CM.Map('map', cloudmade);
    map.setCenter(new CM.LatLng(-33.437833, -70.650333), 15);
    
    directions = new CM.Directions(map, 'panel', KEY)

    // Controls
    map.addControl(new CM.LargeMapControl());
    map.addControl(new CM.ScaleControl());
    map.addControl(new CM.OverviewMapControl());
    
    $('#map').contextMenu('myMenu1', {

      bindings: {
        'from': function(t) {
            p = new CM.Point(mouseX, mouseY)
            if (fromPointer == null) {
                //console.log('From pointer is null')
            } else {
                //console.log('From pointer is not null')
                map.removeOverlay(fromPointer)
            }
            fromPointer = new CM.Marker(map.fromContainerPixelToLatLng(p), {
	            title: "Desde aca"
            });
            map.addOverlay(fromPointer)
            checkForRouteUpdate()
        },
        
        'to': function(t) {
            //console.log('To: ' + mouseX + ' ' + mouseY)
            p = new CM.Point(mouseX, mouseY)
            if (toPointer == null) {
                //console.log('To pointer is null')
            } else {
                //console.log('To pointer is not null')
                map.removeOverlay(toPointer)
            }
            toPointer = new CM.Marker(map.fromContainerPixelToLatLng(p), {
	            title: "Hasta aca"
            });
            map.addOverlay(toPointer)
            checkForRouteUpdate()
        }
      },
      onContextMenu: function(e) {
        maps = $('#map')
        var x = e.pageX - maps.offset().left;
    	var y = e.pageY - maps.offset().top;

        mouseX = x
        mouseY = y
        return true
      }
    });
  }
  
  function checkForRouteUpdate() {
    if (fromPointer != null && toPointer != null) {
        var waypoints = [fromPointer.getLatLng(), toPointer.getLatLng()];
        directions.loadFromWaypoints(waypoints)
    }
  }
  
  function setup_search() {
    $('#search').submit(function() {
      var query = $('#search input[type="text"]').attr('value');

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
    	//alert("You have clicked the map at " + latlng.toString(4));
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
