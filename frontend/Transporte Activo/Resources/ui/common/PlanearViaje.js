/**
 * @author Matheo Fiebiger
 */

Titanium.Geolocation.purpose = "Recieve User Location";
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Titanium.Geolocation.distanceFilter = 10;

var mapview;
var paradas = new Array(); 
var updateMapTimeout;
var viewContenedora;

function PlanearViaje() {
Ti.API.log('CREANDO MAPA ');
	
	viewContenedora = Ti.UI.createView({
		Height: Ti.FILL,
		Width: Ti.FILL
	});

	mapview = Titanium.Map.createView({
		Height: Ti.FILL,
		Width: Ti.FILL,
		mapType : Titanium.Map.STANDARD_TYPE,
		animate : true,
		regionFit : true,
		userLocation : true
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
	
	var goToMe = Titanium.UI.createButton({
    backgroundImage:'/images/userloc.png',
    top:10,
    right:25,
    width: 40,
    height: 40

});
	var goToMeLabel = Titanium.UI.createLabel({
		color:'black',
		font:{
        fontWeight:'bold',
   },
	text:'ubicame',
    top:50,
    right:6,
    width: 70,
    height: 20

});

	goToMe.addEventListener('click',function(e){
		Titanium.Geolocation.getCurrentPosition(function(e) {
		var region = {
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			animate : true,
			latitudeDelta : 0.01,
			longitudeDelta : 0.01
		};

		mapview.setLocation(region);
		});
	});
	
	viewContenedora.add(mapview);
	viewContenedora.add(goToMe);
	viewContenedora.add(goToMeLabel);

	return viewContenedora;
};

var times =0;

function getLocation() {
	if(times===0)
	{
	times++;
	//Get the current position and set it to the mapview
	Titanium.Geolocation.getCurrentPosition(function(e) {
		var region = {
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			animate : true,
			latitudeDelta : 0.01,
			longitudeDelta : 0.01
		};

		mapview.setLocation(region);
		Ti.API.log('GET REGION PARA PARADAS ');
		getParadas(region);
		
		Titanium.Geolocation.removeEventListener('location', function() {
			getLocation();
		});
		
		mapview.addEventListener('regionchanged', function(e) {
		
		 Ti.API.log('REGION CHANGED');
	var region = {
			latitude : e.latitude,
			longitude : e.longitude,
			animate : true,
			latitudeDelta : e.latitudeDelta,
			longitudeDelta : e.longitudeDelta
		};
		if (updateMapTimeout) clearTimeout(updateMapTimeout);
 
    updateMapTimeout = setTimeout(function() {
        // update your map
    getParadas(region);
    }, 100);
			
		});

	});
}
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

	b.northWest.lat = region.latitude + (region.latitudeDelta / 2.0);
	b.northWest.lng = region.longitude - (region.longitudeDelta / 2.0);

	b.southWest.lat = region.latitude - (region.latitudeDelta / 2.0);
	b.southWest.lng = region.longitude - (region.longitudeDelta / 2.0);

	b.northEast.lat = region.latitude + (region.latitudeDelta / 2.0);
	b.northEast.lng = region.longitude + (region.longitudeDelta / 2.0);

	b.southEast.lat = region.latitude - (region.latitudeDelta / 2.0);
	b.southEast.lng = region.longitude + (region.longitudeDelta / 2.0);

	return b;
}

function getParadas(region) {

	Ti.API.log('LatitudDelta: '+ region.latitudeDelta);
	var delta = region.latitudeDelta;
	var bounds = getMapBounds(region);
	var url = "http://transporteactivo.com/api/v1/paradas-cercanas/?ne="+bounds.northEast.lat+","+bounds.northEast.lng+"&sw="+bounds.southWest.lat+","+bounds.southWest.lng;
	Ti.API.log('URL: '+ url);
    var json, parada, i, row, nameLabel, nickLabel;
 
var xhr = Ti.Network.createHTTPClient({
    onload: function() {
    paradas = new Array();
    mapview.removeAllAnnotations();
    
    
    Ti.API.log('RESPUESTA: '+ this.responseText);
 	
    json = JSON.parse(this.responseText);
    for (i = 0; i < json.length; i++) {
        parada = json[i];
        var imagen;
        
        if(parada.tipo_parada===1){
        	imagen = '/images/marker_icon_troncal.png';
        } else
         if(parada.tipo_parada===2){
        	imagen = '/images/marker_icon_pretroncal.png';
        } else{
        	imagen = '/images/marker_icon_alimentadora.png';
        };
        
       	var pin = Titanium.Map.createAnnotation({
		latitude : parada.lat,
		longitude : parada.lng,
		title : parada.nombre,
		image: imagen,
		animate : true,
		myid : i // Custom property to uniquely identify this annotation.
	}); 
	
	if(delta <0.025){
	paradas.push(pin);
	}else
	{
		if(parada.tipo_parada===1){
			paradas.push(pin);
		}
	};
        }
        Ti.API.log('NUMERO DE PARADAS: '+ paradas.length);
      mapview.addAnnotations(paradas);
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