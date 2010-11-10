/**
 *
 * Copyright (c) 2010 Digitales por Chile ( http://digitalesporchile.org )
 * Dual licensed under the MIT and GPL licenses.
 * Check LICENCE-MIT and LICENSE-GPL for details.
 *
 **/
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
    map.setCenter(new CM.LatLng(-39.63953756436669, -71.279296875), 4);
    
    directions = new CM.Directions(map, 'panel', KEY);

    var controlPoss = new CM.ControlPosition(CM.TOP_LEFT, new CM.Size(4, 115));

    // Controls
    map.addControl(new CM.LargeMapControl(), controlPoss);
    //map.addControl(new CM.ScaleControl());
    // map.addControl(new CM.OverviewMapControl());
    
    $('#map').contextMenu('myMenu1', {

      bindings: {
        'from': function(t) {
          if (!fromPointer) fromPointer = new_route_marker("Desde aca");
          move_route_marker(fromPointer, mouseX, mouseY);
        },
        
        'to': function(t) {
          if (!toPointer) toPointer = new_route_marker("Hasta aca");
          move_route_marker(toPointer, mouseX, mouseY);
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
  
  function new_route_marker(title) {
    var marker = new CM.Marker(new CM.LatLng(0, 0), {title: title, draggable: true});
    CM.Event.addListener(marker, 'dragend', update_route);
    map.addOverlay(marker);
    return marker;
  }

  function move_route_marker(marker, mouseX, mouseY) {
    var p = new CM.Point(mouseX, mouseY);
    var latlng = map.fromContainerPixelToLatLng(p);
    marker.setLatLng(latlng);
    update_route();
  }

  function update_route() {
    if (fromPointer != null && toPointer != null) {
      var waypoints = [fromPointer.getLatLng(), toPointer.getLatLng()];
      directions.loadFromWaypoints(waypoints, {
        travelMode: $('#travel-mode input:checked').attr('value')
      })
    }
  }
  
  $(function() {
    $('#travel-mode input').change(update_route);
  });
  
  function setup_search() {
    $('#search').submit(function() {
      var query = to_cloudmade_query($('#query').attr('value'));
      var geocoder = new CM.Geocoder(KEY);

      geocoder.getLocations(query, function(response) {
        if (!response.bounds) return;
        
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
  
  function to_cloudmade_query(query) {
    // Put the first number at the front, and append "Chile"
    // e.g:
    // "Cirujano Guzman 25, Providencia" => "25, Cirujano Guzman, Providencia, Chile"
    return query.replace(/^(.[^0-9]*)\s([0-9]+)(.*)$/, "$2, $1$3") + ", Chile";
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
      name: 'OSM Foundation',
      tiles: new CM.Tiles.OpenStreetMap.Mapnik()
    },
    {
      name: 'OpenCycleMap',
      tiles: new CM.Tiles.OpenStreetMap.Cycle()
    },
    {
    name: 'NoNames',
      tiles: new CM.Tiles.CloudMade.Web( {key: KEY, styleId: 3 } )
    },
    {
    name: 'Fresh',
      tiles: new CM.Tiles.CloudMade.Web( {key: KEY, styleId: 997 } )
    },
    {
      name: 'Mobile',
      tiles: new CM.Tiles.CloudMade.Mobile( { key: KEY } )
    },
    {
    name: 'Tourist',
      tiles: new CM.Tiles.CloudMade.Web({key: KEY, styleId: 7 })
    },
    {
    name: 'Midnight Commander',
      tiles: new CM.Tiles.CloudMade.Web( {key: KEY, styleId: 999 } )
    },
    {
    name: 'Pale Dawn',
      tiles: new CM.Tiles.CloudMade.Web( {key: KEY, styleId: 998 } )
    },
    {
    name: 'Red Alert',
      tiles: new CM.Tiles.CloudMade.Web( {key: KEY, styleId: 8 } )
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
