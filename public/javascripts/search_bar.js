OSM.SearchBar = function(osm) {
  this.osm = osm;
}

OSM.SearchBar.prototype = {
	initialize: function(map, position) {
	  
	  var form = $('<form accept-charset="utf-8" id="search"></form>');
	  var input = $('<input type="text" name="query" value="">');
	  form.append(input);
	  
	  var control = this;
	  
	  form.submit(function() {
	    try {
	    control.performSearch(input.attr('value'));
    } catch(e) { console.log(e); }
	    return false;
	  });
	  
	  $(map.getContainer()).append(form);
	  return form[0];
	},
	
	getDefaultPosition: function() {
		return new CM.ControlPosition(CM.TOP_RIGHT, new CM.Size(10, 10));
	},
	
	performSearch: function(query) {
	  query = this.processQuery(query);
	  
	  var geocoder = this.osm.getGeocoder();
	  var map = this.osm.getMap();

    geocoder.getLocations(query, function(response) {
    	var southWest = new CM.LatLng(response.bounds[0][0], response.bounds[0][1]),
    	northEast = new CM.LatLng(response.bounds[1][0], response.bounds[1][1]);

    	map.zoomToBounds(new CM.LatLngBounds(southWest, northEast));

    	for (var i = 0; i < response.features.length; i++) {
    		this.addMarker(response.features[i]);
    	}
    	
    }, { bounds: map.getBounds() });
	},
	
	addMarker: function(data) {
	  var map = this.osm.getMap();
	  var coords = data.centroid.coordinates,
			latlng = new CM.LatLng(coords[0], coords[1]);

		var marker = new CM.Marker(latlng, {
			title: data.properties.name
		});
		
		map.addOverlay(marker);
	},
	
	processQuery: function(query) {
	  
	  // TODO: Inteligence to query (translation, etc)
	  
	  return query;
	  
	}
}
