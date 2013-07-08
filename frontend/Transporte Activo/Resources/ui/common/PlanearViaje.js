/**
 * @author Matheo Fiebiger
 */

Titanium.Geolocation.purpose = "Recieve User Location";
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Titanium.Geolocation.distanceFilter = 10;

var MapModule;
var mapview;
var paradas = new Array();
var updateMapTimeout;
var viewContenedora;
var activeRequest = false;
var isPopUpActive = false;
var popupWindow;

function PlanearViaje() {
	Ti.API.log('CREANDO MAPA ');

	var temp = Ti.App.tabgroup;
	temp.addEventListener('android:back', function(e) {

		if (isPopUpActive === false) {
			var dialog = Titanium.UI.createAlertDialog({
				message : '¿Quiere Salir de la App?',
				buttonNames : ['Si', 'No'],
			});
			dialog.show();
			dialog.addEventListener('click', function(e) {
				if (e.index == 0) {
					temp.close();

				}
			});
		} else {
			isPopUpActive = false;
			viewContenedora.remove(blur);
			viewContenedora.remove(popupWindow);

		}
	});

	var blur = Ti.UI.createView({
		opacity : 0.8,
		backgroundColor : 'gray',
		height : Ti.UI.FILL,
		width : Ti.UI.FILL
	});

	viewContenedora = Ti.UI.createView({
		blur : blur,
		Height : Ti.FILL,
		Width : Ti.FILL
	});

	if (Ti.Platform.osname === 'android') {
			MapModule = require('ti.map');
		/// GOOGLE MAPS API V2 INSERT HERE
		mapview = MapModule.createView({
			userLocation : true,
			userLocationButton : false,
			mapType : MapModule.NORMAL_TYPE,
			animate : true,
		});
	} else {
		mapview = Titanium.Map.createView({
			Height : Ti.FILL,
			Width : Ti.FILL,
			mapType : Titanium.Map.STANDARD_TYPE,
			animate : true,
			regionFit : true,
			userLocation : true
		});

	}

	// Handle click events on any annotations on this map.
	mapview.addEventListener('click', function(evt) {

		Ti.API.info('source:' + evt.clicksource);

		// Check for all of the possible names that clicksouce
		// can report for the left button/view.
		if (evt.clicksource == 'leftButton' || evt.clicksource == 'leftPane' || evt.clicksource == 'leftView') {
			Ti.API.info("Annotation " + evt.title + ", left button clicked.");
		}
		if (evt.clicksource === 'pin') {
			
			if (Ti.Platform.osname === 'android') {
				
			} else {

				mapview.deselectAnnotation(evt.title);
			}
			
			var popUpRuta = require("/ui/common/EmergenteOrigenDestino");
			isPopUpActive = true;
			popupWindow = popUpRuta.popup(viewContenedora, evt.annotation.myid, evt.annotation.eltitle);
			viewContenedora.add(blur);
			viewContenedora.add(popupWindow);

		}
	});

	var goToMe = Titanium.UI.createButton({
		backgroundImage : '/images/userloc.png',
		top : '10 dp',
		right : '25 dp',
		width : '40 dp',
		height : '40 dp'

	});
	var goToMeLabel = Titanium.UI.createLabel({
		color : 'black',
		font : {
			fontWeight : 'bold',
			fontSize : '15 dp'
		},
		text : 'ubicame',
		top : '50 dp',
		right : '6 dp',
		width : '70 dp',
		height : '20 dp'

	});

	goToMe.addEventListener('click', function(e) {
		Titanium.Geolocation.getCurrentPosition(function(e) {
			var region = {
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				animate : true,
				latitudeDelta : 0.01,
				longitudeDelta : 0.01
			};

			if (Ti.Platform.osname === 'android') {
				mapview.setRegion(region);
			} else {

				mapview.setLocation(region);
			}

		});
	});

	viewContenedora.add(mapview);
	viewContenedora.add(goToMe);
	viewContenedora.add(goToMeLabel);

	return viewContenedora;
};

var times = 0;

function getLocation() {
	if (times === 0) {
		times++;
		//Get the current position and set it to the mapview
		Titanium.Geolocation.getCurrentPosition(function(e) {

			Ti.API.log('USER ENCONTRADO, CAMBIANDO CAMARA HACIA ' + e.coords.latitude + ',' + e.coords.longitude);

			var region = {
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				animate : true,
				latitudeDelta : 0.01,
				longitudeDelta : 0.01
			};

			if (Ti.Platform.osname === 'android') {
				mapview.setRegion(region);
			} else {

				mapview.setLocation(region);
			}
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
				if (updateMapTimeout)
					clearTimeout(updateMapTimeout);

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

/// SERVICIO CONSULTA PARADAS
function getParadas(region) {

	Ti.API.log('LatitudDelta: ' + region.latitudeDelta);
	var delta = region.latitudeDelta;
	var bounds = getMapBounds(region);
	var url = "http://transporteactivo.com/api/v1/paradas-cercanas/?ne[]=" + bounds.northEast.lat + "&ne[]=" + bounds.northEast.lng + "&sw[]=" + bounds.southWest.lat + "&sw[]=" + bounds.southWest.lng;
	Ti.API.log('URL: ' + url);
	var json, parada, i;

	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			paradas = new Array();
			mapview.removeAllAnnotations();

			Ti.API.log('RESPUESTA: ' + this.responseText);

			json = JSON.parse(this.responseText);
			for ( i = 0; i < json.length; i++) {
				parada = json[i];
				var imagen;

				if (parada.tipo_parada === 1) {
					imagen = '/images/marker_icon_troncal.png';
				} else if (parada.tipo_parada === 2) {
					imagen = '/images/marker_icon_pretroncal.png';
				} else {
					imagen = '/images/marker_icon_alimentadora.png';
				}
				

				if (Ti.Platform.osname === 'android') {
					var pin = MapModule.createAnnotation({
						latitude : parada.lat,
						longitude : parada.lng,
						eltitle : parada.nombre,
						image : imagen,
						animate : true,
						myid : parada.id // Custom property to uniquely identify this annotation.
					});
				} else {

					var pin = Titanium.Map.createAnnotation({
						latitude : parada.lat,
						longitude : parada.lng,
						title : parada.nombre,
						image : imagen,
						animate : true,
						myid : parada.id, // Custom property to uniquely identify this annotation.
						eltitle : parada.nombre
					});
				}

				if (delta < 0.025) {
					paradas.push(pin);
				} else {
					if (parada.tipo_parada === 1) {
						paradas.push(pin);
					}
				};
			}
			Ti.API.log('NUMERO DE PARADAS: ' + paradas.length);
			mapview.addAnnotations(paradas);
			activeRequest = false;
		},
		onerror : function(e) {
			Ti.API.log("STATUS: " + this.status);
			Ti.API.log("TEXT:   " + this.responseText);
			Ti.API.log("ERROR:  " + e.error);
			alert('No se pudo contactar al servidor, intentelo de nuevo');
			activeRequest = false;
		},
		timeout : 5000
	});

	if (activeRequest === false) {
		Ti.API.log('Paradas request va a abrir');
		activeRequest = true;
		xhr.open("GET", url);
		xhr.send();
		Ti.API.log('Paradas request enviado');
	}

	return null;
}

function setOrigen(id, nombre) {

};

module.exports = PlanearViaje;
