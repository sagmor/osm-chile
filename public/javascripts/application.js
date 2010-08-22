var OSM = (function() {
  
  var KEY = 'E282E0EA16754AFB98173BF9A17CF874';
  
  var map;
  
  function init() {
    load_map();
    setup_search();
    setup_styles();
    
    $('#permalink_edit').click(function() {
        var langlot = map.getCenter()
        var longitud = langlot.lng()
        var latitud = langlot.lat()
        var zoom = map.getZoom()
        //console.log(longitud + ' ' + latitud + ' ' + zoom)
        var url = 'http://www.openstreetmap.org/edit.html?zoom=' + zoom + '&lat=' + latitud + '&lon=' + longitud;
        window.location = url
    });
    
    // var layer = new CM.Tiles.CloudMade.Mobile({ key: KEY });
    // map.setTileLayer(layer);
    
  }
  
  
    var mouseX
    var mouseY
    
    var fromPointer = null;
    var toPointer = null;
    
    var directions = null
  
  function load_map() {
    map = new CM.Map('map', styles[0].tiles);
    map.setCenter(new CM.LatLng(-33.437833, -70.650333), 15);
    
    directions = new CM.Directions(map, 'panel', KEY);

    // Controls
    map.addControl(new CM.LargeMapControl());
    map.addControl(new CM.ScaleControl());
    // map.addControl(new CM.OverviewMapControl());
    
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
        directions.loadFromWaypoints(waypoints, {
          travelMode: $('#travel-mode input:checked').attr('value')
        })
    }
  }
  
  $(function() {
    $('#travel-mode input').change(checkForRouteUpdate);
  });
  
  
  function setup_search() {
    $('#search').submit(function() {
      var query = $('#search input[type="text"]').attr('value');

      var geocoder = new CM.Geocoder(KEY);

      geocoder.getLocations(query, function(response) {
        if (!response.bounds) return false;
        
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
  
  var styles = [
    {
      name: 'OSM Chile',
      tiles: new CM.Tiles.CloudMade.Web({key: KEY, styleId: 1823 })
    },
    {
      name: 'OSM Mapnik',
      tiles: new CM.Tiles.OpenStreetMap.Mapnik()
    },
    {
      name: 'OpenCycleMap',
      tiles: new CM.Tiles.OpenStreetMap.Cycle()
    },
    {
      name: 'CloudMade Mobile',
      tiles: new CM.Tiles.CloudMade.Mobile( { key: KEY } )
    }
  ];
  
  function setup_styles() {
    $.each(styles, function(i) {
      $('#styles').append('<span class="estilo"><input name="style" type="radio" id="style-'+
      i+'" value="'+i+'"><label for="style-'+i+'">'+
      this.name + '</label></span>');
    })
    
    $('#style-0').attr('checked', true)
    $('#styles input').change(function() {
      map.setTileLayer( styles[this.value].tiles );
    });
  }
  return {
    init: init
  };
})();

$(function() {
  OSM.init();

});
