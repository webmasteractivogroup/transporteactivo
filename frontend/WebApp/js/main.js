// Nota: Este archivo debe ir incluido en el html ANTES de jQuery Mobile.
// Ref: http://jquerymobile.com/test/docs/api/globalconfig.html

// 
	// $(document).bind("mobileinit", function () {

	// 	// Navigation
	// 	$.mobile.page.prototype.options.backBtnText = "Go back";
	// 	$.mobile.page.prototype.options.addBackBtn      = true;
	// 	$.mobile.page.prototype.options.backBtnTheme    = "d";

	// 	// Page
	// 	$.mobile.page.prototype.options.headerTheme = "a";  // Page header only
	// 	$.mobile.page.prototype.options.contentTheme    = "c";
	// 	$.mobile.page.prototype.options.footerTheme = "a";

	// 	// Listviews
	// 	$.mobile.listview.prototype.options.headerTheme = "a";  // Header for nested lists
	// 	$.mobile.listview.prototype.options.theme           = "c";  // List items / content
	// 	$.mobile.listview.prototype.options.dividerTheme    = "d";  // List divider

	// 	$.mobile.listview.prototype.options.splitTheme   = "c";
	// 	$.mobile.listview.prototype.options.countTheme   = "c";
	// 	$.mobile.listview.prototype.options.filterTheme = "c";
	// 	$.mobile.listview.prototype.options.filterPlaceholder = "Filter data...";
	// });

// Configuracion global de jQuery Mobile
$(document).on("mobileinit", function () {
	$.mobile.defaultPageTransition = 'none';
	// $.mobile.loadingMessageTextVisible = true;
	// $.mobile.loadingMessage = 'Cargando';
	
	/* Necesario para Phonegap, aunque genera peligro potencial de XSS sin el Whitelist de Phonegap.
	 * Ref: http://jquerymobile.com/test/docs/pages/phonegap.html
	 * Nota: Mirar $.support.cors */
	$.mobile.allowCrossDomainPages = true;
});

// Transporte Activo
window.ta = {
	nearbyStops: new Array(),
	geoLocation: {
		browserSupportFlag: new Boolean(),

		findLocation: function() {
			if(navigator.geolocation) {
				this.browserSupportFlag = true;
				navigator.geolocation.getCurrentPosition(this.locationFound, this.locationNotFound);
			}
			else { // browser doesn't support Geolocation
				this.browserSupportFlag = false;
				alert("Geolocation service failed.");
			}
		},
		locationFound: function(position){
			// update the current position
			ta.map.currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			// center the map
			ta.map.map.setCenter(ta.map.currentPosition);
			// add the blue point marker
			ta.map.addPositionMarker(ta.map.currentPosition);
			// load the nearby stops
			// ta.map.loadNearbyStops(ta.map.currentPosition);
		},
		locationNotFound: function(err) {
			if (err.code == 1) { //PERMISSION_DENIED
				// user denied
			} else if (err.code == 2) { //POSITION_UNAVAILABLE
				// network not available/satellites could not be contacted
			} else if (err.code == 3) { //TIMEOUT
				// network took too long to calculate the user's position
			} else {
				//unexpected error
			}
		}
	},

	map: {
		defaultPosition: new google.maps.LatLng(3.422556, -76.517222),
		currentPosition: this.defaultPosition,
		nearbyStopsMarkers: new Array(),
		ajaxTimeout: null,
		marker_icons: {
			dot: {
				url: 'img/marker_icon_dot.png',
				anchor: new google.maps.Point(6,6),
				scaledSize: new google.maps.Size(11,11),
			},
			troncal: {
				url: 'img/marker_icon_troncal.png',
				anchor: new google.maps.Point(16,35),
				// origin: new google.maps.Point(0,0), //used for sprites, offset
				// size: new google.maps.Size(32,46), //used for sprites, display size
				scaledSize: new google.maps.Size(24,35),
			},
			pretroncal: {
				url: 'img/marker_icon_alimentadora.png',
				anchor: new google.maps.Point(16,35),
				scaledSize: new google.maps.Size(24,35),
			},
			alimentadora: {
				url: 'img/marker_icon_alimentadora.png',
				anchor: new google.maps.Point(16,35),
				scaledSize: new google.maps.Size(24,35),
			},
			shadow: {
				url: 'img/marker_icon_shadow.png',
				anchor: new google.maps.Point(17,34),
				scaledSize: new google.maps.Size(43,35),
			}
		},

		init: function() {
			this.createMap();
		},

		createMap: function() {
			var mapOptions = {
				zoom: 15,
				maxZoom: 17,
				minZoom: 10,
				center: this.defaultPosition,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				panControl: false,
				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.SMALL
				},
			}
			this.map = new google.maps.Map($(".map-canvas").get(0), mapOptions);
		},

		addPositionMarker: function(position) {
			// console.log(this.marker_icons["dot"]);
			var markerOptions = {
				map: this.map,
				title: "¡Estas aquí!",
				icon: this.marker_icons["dot"],
				position: new google.maps.LatLng(position.lat(), position.lng()),
				animation : google.maps.Animation.DROP
			}
			var marker = new google.maps.Marker(markerOptions);

		},

		addStopMarker: function(stop) {
			var markerOptions = {
				map: this.map,
				title: stop.nombre,
				// icon: this.marker_icons[stop.type],
				icon: this.marker_icons['alimentadora'],
				shadow: this.marker_icons.shadow,
				position: new google.maps.LatLng(stop.lat, stop.lng),
				// animation : google.maps.Animation.DROP
			}
			var marker = new google.maps.Marker(markerOptions);
			this.nearbyStopsMarkers.push(marker);

			// //Asocio el click del marcador a la ventana con los detalle de la promoción 
			// google.maps.event.addListener(marcador, "click", function() {
			// 	ta.loadStop(stop.id)
			// })
		},

		loadNearbyStops: function(position, type){
			$.ajax({
				url: "http://transporteactivo.com/api/v1/paradas-cercanas/",
				type: "get",
				data: {lat: position.lat(), lng: position.lng(), distancia: 1000},
				dataType: "JSON",
				// async: false,
				success: function(data, textStatus, jqXHR) {
					if (textStatus === "success") {
						//remove the current markers from the map
						for (i = 0; i < ta.map.nearbyStopsMarkers.length; ++i) {
							ta.map.nearbyStopsMarkers[i].setMap(null);
						}
						ta.nearbyStops = data;
						ta.map.addStopMarkers(ta.nearbyStops);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
					//ocultarIndicadorAjax();
					alert("Error cargando las paradas cercanas"); //TODO: Agregar mensaje
				}
			})
		},

		addStopMarkers: function(stopsArray){
			// console.log(stopsArray);
			for (i = 0; i < stopsArray.length; ++i) {
				this.addStopMarker(stopsArray[i]);
			}
		}
	},

	init: function() {
		this.map.init();
		this.geoLocation.findLocation();
	}
};

$(document).on('pageinit', '#plan-trip', function(event){
	window.ta.init();
	google.maps.event.addListenerOnce(ta.map.map, 'idle', function() {
		// do something only the first time the map is loaded
		ta.map.loadNearbyStops(ta.map.map.getCenter());
	});
	google.maps.event.addListener(ta.map.map, 'bounds_changed', function() {
		if (ta.map.ajaxTimeout) {
			window.clearTimeout(ta.map.ajaxTimeout);
		}
		ta.map.ajaxTimeout = window.setTimeout(function() {
			ta.map.loadNearbyStops(ta.map.map.getCenter());
		}, 250);
	});
});

$(document).on('pageshow', '#mapa', function(event){
	google.maps.event.trigger(window.ta.map, "resize");
});