var lon = -71.1;
var lat = -33.286;
var zoom = 4;
var map, layer, markers, routelayer;
var markerFrom, markerTo;
var mode, position;
var permalink, WindowLocation;

var xmlhttp = new Array();

function init(){
	WindowLocation = String(window.location);

	OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '5';
	OpenLayers.Feature.Vector.style['default']['fillColor'] = '#0033FF';
	OpenLayers.Feature.Vector.style['default']['strokeColor'] = '#0033FF';
	OpenLayers.Feature.Vector.style['default']['strokeOpacity'] = '0.6';
	
	map = new OpenLayers.Map ("map", {
                controls:[
                    new OpenLayers.Control.Navigation(),
					new OpenLayers.Control.ZoomBox(),
                    new OpenLayers.Control.PanZoomBar(),
					new OpenLayers.Control.Permalink('editlink', 'http://www.openstreetmap.org/edit.html'),
                    new OpenLayers.Control.LayerSwitcher()
				],
				eventListeners: {
			        "changebaselayer": onChangeBaseLayer
					},
                maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
                maxResolution: 156543.0399,
                numZoomLevels: 19,
                units: 'm',
                projection: new OpenLayers.Projection("EPSG:900913"),
                displayProjection: new OpenLayers.Projection("EPSG:4326")
            } );
	    		
	layerMapnik = new OpenLayers.Layer.TMS( 
		"OSM Chile (CloudMade Custom Style)",
		["http://a.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/1823/256/", "http://b.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/1823/256/", "http://c.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/1823/256/"],
		{type:'png', getURL: get_osm_url, displayOutsideMaxExtent: true }, {'buffer':1} );

	layerOSM = new OpenLayers.Layer.TMS( 
		"Mapnik (OSM Foundation)",
		["http://a.tile.openstreetmap.org/", "http://b.tile.openstreetmap.org/", "http://c.tile.openstreetmap.org/"],
		{type:'png', getURL: get_osm_url, displayOutsideMaxExtent: true }, {'buffer':1} );

	layerCycle = new OpenLayers.Layer.OSM.CycleMap("OpenCycleMap", {
					 displayOutsideMaxExtent: true,
					 wrapDateLine: true
					 });
					 
	layerNoNames = new OpenLayers.Layer.TMS( 
		"NoNames (CloudMade)",
		["http://a.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/3/256/", "http://b.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/3/256/", "http://c.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/3/256/"],
		{type:'png', getURL: get_osm_url, displayOutsideMaxExtent: true }, {'buffer':1} );

	layerMobile = new OpenLayers.Layer.TMS( 
		"Mobile (CloudMade)",
		["http://a.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/2/256/", "http://b.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/2/256/", "http://c.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/2/256/"],
		{type:'png', getURL: get_osm_url, displayOutsideMaxExtent: true }, {'buffer':1} );
		
	layerCMTourist = new OpenLayers.Layer.TMS( 
		"CloudMade Tourist",
		["http://a.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/7/256/", "http://b.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/7/256/", "http://c.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/7/256/"],
		{type:'png', getURL: get_osm_url, displayOutsideMaxExtent: true }, {'buffer':1} );

	layerCMFresh = new OpenLayers.Layer.TMS( 
		"CloudMade Fresh",
		["http://a.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/997/256/", "http://b.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/997/256/", "http://c.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/997/256/"],
		{type:'png', getURL: get_osm_url, displayOutsideMaxExtent: true }, {'buffer':1} );

	layerCMMNC = new OpenLayers.Layer.TMS( 
		"CloudMade Midnight Commander",
		["http://a.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/999/256/", "http://b.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/999/256/", "http://c.tile.cloudmade.com/E282E0EA16754AFB98173BF9A17CF874/999/256/"],
		{type:'png', getURL: get_osm_url, displayOutsideMaxExtent: true }, {'buffer':1} );

	markers = new OpenLayers.Layer.Markers("Markers",
		{
			projection: new OpenLayers.Projection("EPSG:4326"),
			'calculateInRange':	function() { return true; }
		}
	);
	
	routelayer = new OpenLayers.Layer.Vector("Route");
	
	map.addLayers([markers, routelayer]);
	map.addControl(new OpenLayers.Control.KeyboardDefaults());

	// Check if a permalink is used
	if (location.search.length > 0) {
		// Load the permalink
		xmlhttp['url'] = 'gosmore.php'+location.search;
		xmlhttp['what'] = 'route';
		loadxmldoc(xmlhttp);
	
		// Add the To/From markers
		var flonlat = new OpenLayers.LonLat();
		var tlonlat = new OpenLayers.LonLat();
		params = location.search.substr(1).split('&');
		for (i = 0; i < params.length; i++) {
			fields = params[i].split('='); 
			
			switch (fields[0]) {
			case 'flat':
				flonlat.lat = parseFloat(fields[1]);
				break;
			case 'flon':
				flonlat.lon = parseFloat(fields[1]);
				break;
			case 'tlat':
				tlonlat.lat = parseFloat(fields[1]);
				break;
			case 'tlon':
				tlonlat.lon = parseFloat(fields[1]);
				break;
			case 'v':
				switch (fields[1]) {
				case 'bicycle':
					for (j = 0; j < document.forms['parameters'].type.length; j++) {
						if (document.forms['parameters'].type[j].value == 'bicycle') {
							document.forms['parameters'].type[j].checked = true;
						}
					}
					break;
				case 'foot':
					for (j = 0; j < document.forms['parameters'].type.length; j++) {
						if (document.forms['parameters'].type[j].value == 'foot') {
							document.forms['parameters'].type[j].checked = true;
						}
					}
					break;
				default:
					for (j = 0; j < document.forms['parameters'].type.length; j++) {
						if (document.forms['parameters'].type[j].value == 'car') {
							document.forms['parameters'].type[j].checked = true;
						}
					}
					break;
				}
				break;
			case 'fast':
				if (parseInt(fields[1]) == 1) {
					for (j = 0; j < document.forms['parameters'].method.length; j++) {
						if (document.forms['parameters'].method[j].value == 'fast') {
							document.forms['parameters'].method[j].checked = true;
						}
					}
				} else {
					for (j = 0; j < document.forms['parameters'].method.length; j++) {
						if (document.forms['parameters'].method[j].value == 'short') {
							document.forms['parameters'].method[j].checked = true;
						}
					}
				}				
				break;	
			case 'layer':
				switch (fields[1]) {
				case 'cycle':
					map.addLayers([layerCycle, layerMapnik, layerOSM, layerNoNames, layerMobile, layerCMTourist, layerCMFresh, layerCMMNC]);
					break;
				default:
					map.addLayers([layerMapnik, layerOSM, layerCycle, layerNoNames, layerMobile, layerCMTourist, layerCMFresh, layerCMMNC]);
					break;
				}
			}
		}
		if (null == map.baseLayer) {
			//Fallback for old permalinks that don't list the layer property
			map.addLayers([layerMapnik, layerOSM, layerCycle, layerNoNames, layerMobile, layerCMTourist, layerCMFresh, layerCMMNC]);
		}
		
		//markerFrom = new OpenLayers.Marker(flonlat.transform(map.displayProjection,map.projection), marker-green.clone());
		markerFrom = new OpenLayers.Marker(flonlat.transform(map.displayProjection,map.projection));
		addMarker(flonlat, 'from');
		
		//markerTo = new OpenLayers.Marker(tlonlat.transform(map.displayProjection,map.projection), marker-red.clone());
		markerTo = new OpenLayers.Marker(tlonlat.transform(map.displayProjection,map.projection));
		addMarker(tlonlat, 'to');

		map.zoomToExtent(markers.getDataExtent());
		
		document.forms['route'].elements['clear'].disabled = false;
		document.forms['route'].elements['calculate'].disabled = true;
		document.forms['route'].elements['to'].disabled = false;
		document.forms['route'].elements['from'].disabled = false;
	} else {
		//No preference for any layer, load Mapnik layer first
		map.addLayers([layerMapnik, layerOSM, layerCycle, layerNoNames, layerMobile, layerCMTourist, layerCMFresh, layerCMMNC]);
		
		if (!map.getCenter()) {
			var pos;
			pos = new OpenLayers.LonLat(-71.1, -33.286);
			map.setCenter(pos.transform(map.displayProjection,map.projection), 4);
		} 
		if (typeof(document.baseURI) != 'undefined') {
			if (document.baseURI.indexOf('devel') > 0) {
				// Zoom in automatically to save some time when developing
				var pos;
				pos = new OpenLayers.LonLat(6, 52.2);
				map.setCenter(pos.transform(map.displayProjection,map.projection), 14);
			}
	    }
		
		document.forms['route'].elements['clear'].disabled = true;
		document.forms['route'].elements['calculate'].disabled = true;
		document.forms['route'].elements['to'].disabled = false;
		document.forms['route'].elements['from'].disabled = false;
	}
	
    var control = new OpenLayers.Control.SelectFeature(routelayer,
	        {
	            clickout: true, toggle: false,
	            multiple: false, hover: false,
	            toggleKey: "ctrlKey", 			// ctrl key removes from selection
	            multipleKey: "shiftKey"			// shift key adds to selection
	        }
	    );
	
	map.addControl(control);
	
	var click = new OpenLayers.Control.Click();
    map.addControl(click);
	
    click.activate();
} //End of init()

function get_osm_url (bounds) {
    var res = this.map.getResolution();
    var x = Math.round ((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round ((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    var path = z + "/" + x + "/" + y + "." + this.type;
    var url = this.url;
    if (url instanceof Array) {
        url = this.selectUrl(path, url);
    }
    return url + path;
}

// Called when the baselayer is changed
function onChangeBaseLayer(e) {
	if (undefined != map.baseLayer) {
		//alert('Baselayer changed'+map.baseLayer.name);
		switch (map.baseLayer.name) {
		case 'Cycle Networks':
			for (j = 0; j < document.forms['parameters'].type.length; j++) {
				if (document.forms['parameters'].type[j].value == 'foot' || document.forms['parameters'].type[j].value == 'motorcar') {
					document.forms['parameters'].type[j].disabled = true;
				}
				if (document.forms['parameters'].type[j].value == 'bicycle')
					document.forms['parameters'].type[j].checked = true;
			}
			break;
		default:
			for (j = 0; j < document.forms['parameters'].type.length; j++) {
				if (document.forms['parameters'].type[j].value == 'foot' 
					|| document.forms['parameters'].type[j].value == 'bicycle'
					|| document.forms['parameters'].type[j].value == 'motorcar') {
					document.forms['parameters'].type[j].disabled = false;
				}
			}
			break;
		}
	}
}

// Deternines what happens if a user clicks the map
OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
	    defaultHandlerOptions: {
	        'single': true,
	        'double': false,
	        'pixelTolerance': 0,
	        'stopSingle': false,
	        'stopDouble': false
	    },
	
	    initialize: function(options) {
	        this.handlerOptions = OpenLayers.Util.extend(
	            {}, this.defaultHandlerOptions
	        );
	        OpenLayers.Control.prototype.initialize.apply(
	            this, arguments
	        ); 
	        this.handler = new OpenLayers.Handler.Click(
	            this, {
	                'click': this.trigger
	            }, this.handlerOptions
	        );
	    }, 
	
	    trigger: function(e) {
	    	position = this.map.getLonLatFromViewPortPx(e.xy);
	    	switch (mode)
	    	{
	    	case 'to':
	    		//markerTo = new OpenLayers.Marker(position, marker-green.clone());
	    		markerTo = addMarker(position, 'to');
				document.body.style.cursor='default';
				break;
	    	case 'from':
	    		//markerFrom = new OpenLayers.Marker(position, marker-red.clone());
	    		markerFrom = addMarker(position, 'from');
				document.body.style.cursor='default';
				break;
	    	}
	    	if (mode == 'to' || mode == 'from') {
				document.forms['route'].elements['clear'].disabled = false;
				
				markers.clearMarkers();
				if (typeof(markerTo) != 'undefined') {
					markers.addMarker(markerTo);
				}
				if (typeof(markerFrom) != 'undefined') {
					markers.addMarker(markerFrom);
				}
				if (typeof(markerTo) != 'undefined' && typeof(markerFrom) != 'undefined') {
					calculateRoute();
				}
			}
	    }
	}
);
/*
function editMap() {
	lonlat = map.getCenter().transform(map.projection, map.displayProjection);
	zoom = map.getZoom();
	
	window.open('http://www.openstreetmap.org/edit?lat='+lonlat.lat+'&lon='+lonlat.lon+'&zoom='+zoom);
}
*/
function reverseRoute(element) {
	to = document.forms['route'].elements['to_text'].value;
	document.forms['route'].elements['to_text'].value = document.forms['route'].elements['from_text'].value;
	document.forms['route'].elements['from_text'].value = to;
	
	markers.clearMarkers();
	markerTemp = addMarker(markerTo.lonlat, 'from');
	markerTo = addMarker(markerFrom.lonlat, 'to');
	markerFrom = markerTemp;
	
	calculateRoute();
}

// Prepare to do the magic
function calculateRoute() {
	if (markerTo && markerFrom) {
		document.forms['route'].elements['calculate'].disabled = true;
		document.forms['route'].elements['to'].disabled = true;
		document.forms['route'].elements['from'].disabled = true;
		document.forms['route'].elements['to_text'].disabled = true;
		document.forms['route'].elements['from_text'].disabled = true;
		
		// Delete existing route layer
		if (typeof(routelayer) != 'undefined')
			routelayer.destroyFeatures();
		
		var flonlat = markerFrom.lonlat.clone();
		var tlonlat = markerTo.lonlat.clone();
		
		loadGmlLayer(flonlat.transform(map.projection, map.displayProjection), tlonlat.transform(map.projection, map.displayProjection));
	}
}

function loadGmlLayer(flonlat, tlonlat) {
	html = "<img src='img/loading.gif' style='position:relative;'>";
	OpenLayers.Util.getElement('status').innerHTML = html;
	
	routeURL = '?flat='+roundNumber(flonlat.lat, 6)+'&flon='+roundNumber(flonlat.lon, 6)+'&tlat='+roundNumber(tlonlat.lat, 6)+'&tlon='+roundNumber(tlonlat.lon, 6);
	
	for (i = 0; i < document.forms['parameters'].elements.length; i++) {
		element = document.forms['parameters'].elements[i];
		switch (element.name) {
		case 'type':
			if (element.checked == true) {
				routeURL += '&v='+element.value;
			}
			break;
		case 'method':
			if (element.value == 'fast' && element.checked == true) {
				routeURL += '&fast=1';
			} else if (element.value == 'short' && element.checked == true) {
				routeURL += '&fast=0';
			}
			break;
		}
	}
	
	//Layer
	for (i = 0; i < map.layers.length; i++) {
		if (map.layers[i].visibility == true) {
			switch (map.layers[i].name) {
			case 'OpenCycleMap':
				routeURL += '&layer=cycle';
				break;
			case 'OSM Chile (CloudMade Custom Style)':
				routeURL += '&layer=mapnik';
				break;
			case 'Mapnik (OSM Foundation)':
				routeURL += '&layer=mapnik';
				break;
			case 'NoNames (CloudMade)':
				routeURL += '&layer=mapnik';
				break;
			case 'Mobile (CloudMade)':
				routeURL += '&layer=mapnik';
				break;
			case 'CloudMade Tourist':
				routeURL += '&layer=mapnik';
				break;
			case 'CloudMade Fresh':
				routeURL += '&layer=mapnik';
				break;
			case 'CloudMade Midnight Commander':
				routeURL += '&layer=mapnik';
				break;
}
		}
	}
	permalink = location.protocol+'//'+location.host+location.pathname+routeURL;
	
	xmlhttp['url'] = 'gosmore.php'+routeURL;
	xmlhttp['what'] = 'route';
	loadxmldoc(xmlhttp);
}

function addRouteLayer(vector, distance) {
	if (typeof(routelayer) != 'undefined') {
		routelayer.onFeatureInsert = function(feature) {
			feature_info(feature);
		}
		routelayer.addFeatures(vector);
		map.addLayer(routelayer);
	}
}

var distance;
var nodes;
function processRouteXML(request) {
	document.forms['route'].elements['to'].disabled = false;
	document.forms['route'].elements['from'].disabled = false;
	document.forms['route'].elements['from_text'].disabled = false;
	document.forms['route'].elements['to_text'].disabled = false;
	
	if (request.responseText == "" && request.responseXML == null) {
		alert('¡No hay ruta!');
		return;
	} 
	
	var doc = request.responseXML;

	if (!doc || !doc.documentElement) {
		alert('text');
		doc = request.responseText;
	}
	var format = new OpenLayers.Format.XML();
	nodes = format.getElementsByTagNameNS(doc, 'http://earth.google.com/kml/2.0', 'distance');
	distance = format.getChildValue(nodes[0], 'unknown');
    
    var options = {};
	options.externalProjection = map.displayProjection;
	options.internalProjection = map.projection;
        
	var kml = new OpenLayers.Format.KML(options);
	var vect = kml.read(doc);
	
	addRouteLayer(vect, distance);

}


function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function addMarker(lonlat, type) {
	//var size = new OpenLayers.Size(10,17);
	//var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
	//var icon = new OpenLayers.Icon('http://boston.openguides.org/markers/AQUA.png',size,offset);
	var marker;
	switch (type) {
	case 'to':
		var size = new OpenLayers.Size(21,25);
		var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		var icon = new OpenLayers.Icon('http://www.openstreetmap.cl/img/route_icon_2.png',size,offset);
		marker = new OpenLayers.Marker(lonlat, icon);
		//alert('add to');
		markers.addMarker(marker);
		break;
	case 'from':
		var size = new OpenLayers.Size(21,25);
		var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		var icon = new OpenLayers.Icon('http://www.openstreetmap.cl/img/route_icon_1.png',size,offset);
		marker = new OpenLayers.Marker(lonlat, icon);
		//alert('add to');
		markers.addMarker(marker);
		break;	
	default:
		marker = new OpenLayers.Marker(lonlat);
		//alert('add else');
		markers.addMarker(marker);
		break;
	}
	return marker;
}

function getRouteAs() {
	if (routelayer.features.length > 0) {
		for (i = 0; i < document.forms['export'].elements.length; i++) {
			element = document.forms['export'].elements[i];
			if (element.name == 'type') {
				if (element.checked == true) {
					type = element.value;
				}
			}
		}
		if (type == 'wpt') {
			alert('este formato no es soportado aun');
		}
		url = 'saveas.php?type='+type+'&data=';
	
		for (i = 0; i < routelayer.features[0].geometry.components.length; i++) {
			point = routelayer.features[0].geometry.components[i];
	
			lonlat = new OpenLayers.LonLat(parseFloat(point.x), parseFloat(point.y));
			lonlat.transform(map.projection, map.displayProjection);
			if (i > 0) {
				url += ',';
			}
			url += roundNumber(lonlat.lon, 6) + ' ' + roundNumber(lonlat.lat, 6);
		}
		return url;
	} else {
		alert('No hay ruta para exportar');
	} 
}

// Determines which OL control is active
/*
function toggleControls(element) {

}
*/

function elementChange(element) {
	if (element.value.length > 0) {
		switch (element.name) {
		case 'from_text':
			if (typeof(markerTo) != 'undefined') {
				markers.removeMarker(markerFrom);
				markerFrom = undefined;
			}
			nameFinderRequest = 'from';
			document.forms['route'].elements['to_text'].disabled = true;
			xmlhttp['what'] = 'from';
			document.forms['route'].elements['clear'].disabled = false;
			break;
		case 'to_text':
			if (typeof(markerTo) != 'undefined') {
				markers.removeMarker(markerTo);
				markerTo = undefined;
			}
			nameFinderRequest = 'to';
			document.forms['route'].elements['from_text'].disabled = true;
			xmlhttp['what'] = 'to';
			document.forms['route'].elements['clear'].disabled = false;
			break;
		}
		document.forms['route'].elements['calculate'].disabled = true;
		
		url = "http://gazetteer.openstreetmap.org/namefinder/search.xml&find=" + Url.encode(trim(element.value)) + "&max=1";
		
		xmlhttp['url'] = 'transport.php?url=' + url;
		loadxmldoc(xmlhttp);
	}
}

function trim(value) {
  value = value.replace(/^\s+/,'');
  value = value.replace(/\s+$/,'');
  return value;
}

function elementClick(element) {
	if (element.type == "button") {
		mode = element.name;
		switch (mode)
		{
		case 'to':
			document.body.style.cursor='crosshair';
			if (!markerTo)
				element.disabled = true;
	    	break;
	    case 'from':
	    	document.body.style.cursor='crosshair';
	    	if (!markerFrom)
				element.disabled = true;
	    	break;
	    case 'clear':
	    	markers.clearMarkers();
	    	markerTo = undefined;
	    	markerFrom = undefined;
	    	if (typeof(routelayer) != 'undefined') {
	    		routelayer.destroyFeatures();
	    	}
	    	OpenLayers.Util.getElement('feature_info').innerHTML = "";
	    	document.forms['route'].elements['from_text'].value = "";
	    	document.forms['route'].elements['to_text'].value = "";
	    	document.forms['route'].elements['calculate'].disabled = true;
	    	document.forms['route'].elements['clear'].disabled = true;
	    	document.forms['route'].elements['to'].disabled = false;
	    	document.forms['route'].elements['from'].disabled = false;
	    	document.forms['route'].elements['from_text'].disabled = false;
	    	document.forms['route'].elements['to_text'].disabled = false;
	    	break;
	    case 'calculate':
	    	if (markerTo && markerFrom) {
				// So we have two markers, now we can request a route
				calculateRoute();
			}
	    	break;
	    }
    } else {
    	mode = element.name;
		switch (mode)
		{
		case 'to_text':
			if (element.value == "Calle, Ciudad") {
				element.value = "";
			}
	    	break;
	    case 'from_text':
	    	if (element.value == "Calle, Ciudad") {
				element.value = "";
			}
	    	break;
	    }
	}
    //toggleControls(element);
}

var doc;
function processNamefinderXML(which, response) {
	var xml = new OpenLayers.Format.XML();
	var xml_lonlat = new OpenLayers.LonLat();
	var lonlat = new OpenLayers.LonLat();
	
	doc = xml.read(response);
	
	var bError = false;
	if (doc.childNodes.length > 0) {
		if (doc.documentElement.nodeName == "searchresults") {
			error = doc.documentElement;
			for (j = 0; j < error.attributes.length; j++) {
				switch(error.attributes[j].nodeName)
				{
				case "error":
					html = '<font color="red">'+(error.attributes[j].nodeValue)+'</font>';
					bError = true;
					break;
				}
			}
			OpenLayers.Util.getElement('status').innerHTML = html;
		}
		else if (doc.documentElement.nodeName == "parsererror") {
			//html = '<font color="red">Status: Namefinder reports: '+(doc.documentElement.lastChild.textContent)+'</font>';
			html = '<font color="red">¡Error!</font>';
			bError = true;
			OpenLayers.Util.getElement('status').innerHTML = html;
		}
	}
	else {
		html = '<font color="red">¡Error!</font>';
		bError = true;
		OpenLayers.Util.getElement('status').innerHTML = html;
	}
	if (bError == false) {
		for (i = 0; i < doc.documentElement.childNodes.length; i++) {
			if (doc.documentElement.childNodes[i].nodeName == "named") {
				named = doc.documentElement.childNodes[i];
				for (j = 0; j < named.attributes.length; j++) {
					switch(named.attributes[j].nodeName)
					{
					case "lat":
						lat = parseFloat(named.attributes[j].nodeValue);
						break;
					case "lon":
						lon = parseFloat(named.attributes[j].nodeValue);
						break;
					}
				}
				break;
			}
		}
	
		xml_lonlat.lat = lat;
		xml_lonlat.lon = lon;
	
		lonlat = xml_lonlat.transform(map.displayProjection, map.projection);
	
		switch (which) {
		case 'from':
			markerFrom = addMarker(lonlat, 'from');
			document.forms['route'].elements['to_text'].disabled = false;
			break;
		case 'to':
			markerTo = addMarker(lonlat, 'to');
			document.forms['route'].elements['from_text'].disabled = false;
			break;
		}
		document.forms['route'].elements['calculate'].disabled = false;
		map.setCenter(lonlat);
	}
}

function feature_info(feature) {
	map.zoomToExtent(feature.geometry.getBounds());
	
	len = feature.geometry.getLength();

	html = "<p>Rutas: <br>" + feature.layer.features.length + " (debiera ser 1)</p>";
	html += "<p>Esta ruta:<br>";
	html += "Puntos: " + feature.geometry.components.length + "<br>";
	html += "Extensión: " + Math.round(distance*10)/10 + " km<br>";
	if (typeof(permalink) != 'undefined') {
		html += "<a href=" + permalink + ">Permalink</a><br>";
	}
	
    OpenLayers.Util.getElement('feature_info').innerHTML = html;
    
    html = "";
	OpenLayers.Util.getElement('status').innerHTML = html;
}

function onXmlHttpReceived() {
	xmlcheckreadystate(xmlhttp['object']);
	if (xmlhttp['object'].readyState == 4) {
		response = xmlhttp['object'];
		switch (xmlhttp['what']) {
		case 'to':
			html = "";
			processNamefinderXML('to', response.responseText);
			
			if (typeof(markerFrom) != 'undefined') {
				calculateRoute();
			}
			break;
		case 'from':
			html = "";
			processNamefinderXML('from', response.responseText);
			 
			if (typeof(markerTo) != 'undefined') {
				calculateRoute();
			}
			break;
		case 'route':
			document.forms['route'].elements['calculate'].disabled = false;
			if (xmlhttp['object'].responseText.substring(0,5) == '<'+'?xml') { 
				processRouteXML(response);
				html = "";
			} else {
				html = "<font color=red>"+xmlhttp['object'].responseText+"</font>";
			}
			break;
		default:
			alert('Received AJAX response for unknown request origin: '+xmlhttp['url']);
		}
	} else {
		switch (xmlhttp['what']) {
		case 'to':
			html = "<img src='img/loading.gif' style='position:relative;'>";
			break;
		case 'from':
			html = "<img src='img/loading.gif' style='position:relative;'>";
			break;
		case 'route':
			html = "";
			break;
		default:
			alert('Received AJAX response for unknown request origin: '+xmlhttp['url']);
		}
	}
	OpenLayers.Util.getElement('status').innerHTML = html;
}

function loadxmldoc(xmlhttp) {
  xmlhttp['object'] = null;
  if (window.XMLHttpRequest) { xmlhttp['object']=new XMLHttpRequest(); } // Mozilla etc
  else if (window.ActiveXObject) { xmlhttp['object']=new ActiveXObject("Microsoft.XMLHTTP"); } // IE
  if (xmlhttp['object'] != null) {
    xmlhttp['object'].onreadystatechange = onXmlHttpReceived;
    xmlhttp['object'].open("GET", xmlhttp['url'], true);
    xmlhttp['object'].send(null);
  } else {
    alert("¡No estas utilizando un navegador compatible!");
  }
}

function xmlcheckreadystate(obj) {
  if(obj.readyState == 4) {
    var internalerror = false;
    if(obj.status == 200) {
      return false;
    }
    alert("URL: "+xmlhttp.url+"\n\nReturn value: "+obj.status+"\nDescription: "+obj.statusText); 
  }
  return false;
}

/**
*
*  URL encode / decode
*  http://www.webtoolkit.info/
*
**/

var Url = {

    // public method for url encoding
    encode : function (string) {
        return escape(this._utf8_encode(string));
    },

    // public method for url decoding
    decode : function (string) {
        return this._utf8_decode(unescape(string));
    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}
