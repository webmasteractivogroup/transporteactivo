/**
 * @author Matheo Fiebiger
 */

Titanium.Geolocation.purpose = "Recieve User Location";
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Titanium.Geolocation.distanceFilter = 10;

var mapview;
var paradas = new Array(); 

function PlanearViaje() {
Ti.API.log('CREANDO MAPA ');
	var mountainView = Titanium.Map.createAnnotation({
		latitude : 37.390749,
		longitude : -122.081651,
		title : "Appcelerator Headquarters",
		subtitle : 'Mountain View, CA',
		pincolor : Titanium.Map.ANNOTATION_RED,
		animate : true,
		leftButton : '../images/appcelerator_small.png',
		myid : 1 // Custom property to uniquely identify this annotation.
	});

	mapview = Titanium.Map.createView({
		mapType : Titanium.Map.STANDARD_TYPE,
		animate : true,
		regionFit : true,
		userLocation : true,
		annotations : [mountainView]
	});

	// Handle click events on any annotations on this map.
	mapview.addEventListener('click', function(evt) {

		Ti.API.info("Annotation " + evt.title + " clicked, id: " + evt.annotation.myid);

		// Check for all of the possible names that clicksouce
		// can report for the left button/view.
		if (evt.clicksource == 'leftButton' || evt.clicksource == 'leftPane' || evt.clicksource == 'leftView') {
			Ti.API.info("Annotation " + evt.title + ", left button clicked.");
		}
	});

	return mapview;
};

function getLocation() {
	//Get the current position and set it to the mapview
	Titanium.Geolocation.getCurrentPosition(function(e) {
		var region = {
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			animate : true,
			latitudeDelta : 0.03,
			longitudeDelta : 0.03
		};

		mapview.setLocation(region);
		Ti.API.log('GET REGION PARA PARADAS ');
		getParadas(region);
		
		Titanium.Geolocation.removeEventListener('location', function() {
			getLocation();
		});
		

	});
}

Titanium.Geolocation.addEventListener('location', function() {
	getLocation();
});

function getMapBounds(region) {
	var b = {};
	b.northWest = {};
	b.northEast = {};
	b.southWest = {};
	b.southEast = {};

	b.northWest.lat = parseFloat(region.latitude) + parseFloat(region.latitudeDelta) / 2.0;
	b.northWest.lng = parseFloat(region.longitude) - parseFloat(region.longitudeDelta) / 2.0;

	b.southWest.lat = parseFloat(region.latitude) - parseFloat(region.latitudeDelta) / 2.0;
	b.southWest.lng = parseFloat(region.longitude) - parseFloat(region.longitudeDelta) / 2.0;

	b.northEast.lat = parseFloat(region.latitude) + parseFloat(region.latitudeDelta) / 2.0;
	b.northEast.lng = parseFloat(region.longitude) + parseFloat(region.longitudeDelta) / 2.0;

	b.southEast.lat = parseFloat(region.latitude) - parseFloat(region.latitudeDelta) / 2.0;
	b.southEast.lng = parseFloat(region.longitude) + parseFloat(region.longitudeDelta) / 2.0;

	return b;
}

function getParadas(region) {

	var bounds = getMapBounds(region);
	var url = "http://transporteactivo.com/api/v1/paradas-cercanas/?ne="+bounds.northEast.lat+","+bounds.northEast.lng+"&sw="+bounds.southWest.lat+","+bounds.southWest.lng;
	Ti.API.log('URL: '+ url);
    var json, parada, i, row, nameLabel, nickLabel;
 
var xhr = Ti.Network.createHTTPClient({
    onload: function() {
    Ti.API.log('RESPUESTA: '+ this.responseText);
 	
    json = JSON.parse(this.responseText);
    for (i = 0; i < json.length; i++) {
        parada = json[i];
       	Ti.API.log("MARKER: " + parada.id);
        }
    },
    onerror: function(e) {
    Ti.API.log("STATUS: " + this.status);
    Ti.API.log("TEXT:   " + this.responseText);
    Ti.API.log("ERROR:  " + e.error);
    alert('There was an error retrieving the remote data. Try again.');
    },
    timeout:5000
});
  Ti.API.log('Paradas request va a abrir');
xhr.open("GET", url);
xhr.send();
Ti.API.log('Paradas request enviado');

	return null;
}

module.exports = PlanearViaje; 