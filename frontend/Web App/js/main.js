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

// Nota: Este archivo debe ir incluido en el html ANTES de jQuery Mobile.
// Ref: http://jquerymobile.com/test/docs/api/globalconfig.html
/* Configuracion global. */
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

		findPosition: function() {
			if(navigator.geolocation) {
				this.browserSupportFlag = true;
				navigator.geolocation.getCurrentPosition(
					function(position) { // success
						ta.map.currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						ta.map.map.setCenter(ta.map.currentPosition);
						ta.map.addPositionMarker(ta.map.currentPosition);
						ta.map.loadNearbyStops(ta.map.currentPosition);
					},
					function() { // error
						alert("Your browser doesn't support geolocation.");
					}
				);
			}
			else { // browser doesn't support Geolocation
				ta.geoLocation.browserSupportFlag = false;
				alert("Geolocation service failed.");
			}
		},
	},

	map: {
		defaultPosition: new google.maps.LatLng(3.422556, -76.517222),
		currentPosition: this.defaultPosition,

		marker_icons: {
			dot: {
				url: 'img/marker_icon_dot.png',
				anchor: new google.maps.Point(6,6),
				scaledSize: new google.maps.Size(11,11),
			},
			troncal: {
				url: 'img/marker_icon_troncal.png',
				anchor: new google.maps.Point(12,35),
				// origin: new google.maps.Point(0,0), //used for sprites, offset
				// size: new google.maps.Size(32,46), //used for sprites, display size
				scaledSize: new google.maps.Size(24,35),
			},
			pretroncal: {
				url: 'img/marker_icon_alimentadora.png',
				anchor: new google.maps.Point(12,35),
				scaledSize: new google.maps.Size(24,35),
			},
			alimentadora: {
				url: 'img/marker_icon_alimentadora.png',
				anchor: new google.maps.Point(12,35),
				scaledSize: new google.maps.Size(24,35),
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
			console.log(this.marker_icons["dot"]);
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
				icon: this.marker_icons["alimentadora"],
				position: new google.maps.LatLng(stop.lat, stop.lng),
				animation : google.maps.Animation.DROP
			}
			var marker = new google.maps.Marker(markerOptions);

			// //Asocio el click del marcador a la ventana con los detalle de la promoción 
			// google.maps.event.addListener(marcador, "click", function() {
			// 	trappt.general.obtenerPromocion(promocion.promoId, promocion.promoSedeId)
			// })
		},

		loadNearbyStops: function(position, type){
			// type: (troncal|pretroncal|alimentadora)
			// ta.nearbyStops = new Array(
			// 	{	id: 12345,
			// 		nombre: "Universidades",
			// 		lat: 3.367148,
			// 		lng: -76.529257,
			// 		type: 'troncal'
			// 	},
			// 	{	id: 12346,
			// 		nombre: "Buitrera",
			// 		lat: 3.372693,
			// 		lng: -76.540195,
			// 		type: 'troncal'
			// 	}
			// );
			// console.log(position);
			$.ajax({
				url: "http://transporteactivo.com/api/v1/paradas-cercanas/",
				type: "get",
				data: {lat: position.lat(), lng: position.lng(), distancia: 1000},
				dataType: "JSON",
				// async: false,
				success: function(data, textStatus, jqXHR) {
					if (textStatus === "success") {
						ta.nearbyStops = data;
						ta.map.addStopMarkers(ta.nearbyStops);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
					//trappt.general.ocultarIndicadorAjax();
					alert("Error cargando las paradas cercanas"); //TODO: Agregar mensaje
				}
			})
		},

		addStopMarkers: function(stopsArray){
			console.log(stopsArray);
			for (i = 0; i < stopsArray.length; ++i) {
				this.addStopMarker(stopsArray[i]);
			}
		}
	},

	init : function() {
		this.map.init();
		this.geoLocation.findPosition();
		// ta.map.loadNearbyStops(ta.map.currentPosition);
		// this.map.map.setCenter(this.map.currentPosition);
	}
};

$(document).on('pageinit', '#plan-trip', function(event){
	window.ta.init();
});

$(document).on('pageshow', '#mapa', function(event){
	google.maps.event.trigger(window.ta.map, "resize");
});