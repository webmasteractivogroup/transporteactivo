// Nota: Este archivo debe ir incluido en el html ANTES de jQuery Mobile.
// Ref: http://jquerymobile.com/test/docs/api/globalconfig.html


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

	$.mobile.loader.prototype.options.theme = "a";
	$.mobile.loader.prototype.options.text = "Cargando...";
	$.mobile.loader.prototype.options.textVisible = true;
	
	/* Necesario para Phonegap, aunque genera peligro potencial de XSS sin el Whitelist de Phonegap.
	 * Ref: http://jquerymobile.com/test/docs/pages/phonegap.html
	 * Nota: Mirar $.support.cors */
	// $.mobile.allowCrossDomainPages = true;
});

// Transporte Activo
window.ta = {
	nearbyStops: new Array(),
	geoLocation: {
		browserSupportFlag: new Boolean(),

		findLocation: function() {
			if(navigator.geolocation) {
				this.browserSupportFlag = true;
				$.mobile.loading('show', {text: 'Encontrando localización...'});
				navigator.geolocation.getCurrentPosition(this.locationFound, this.locationNotFound);
			}
			else { // browser doesn't support Geolocation
				this.browserSupportFlag = false;
				alert("Geolocation service failed.");
			}
		},
		locationFound: function(position){
			$.mobile.loading('hide');
			// update the current position
			ta.map.currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			// center the map
			ta.map.map.panTo(ta.map.currentPosition);
			// resets the zoom
			ta.map.resetZoom();
			// add the blue point marker
			ta.map.setPositionMarker(ta.map.currentPosition);
		},
		locationNotFound: function(err) {
			$.mobile.loading('hide');
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
		currentPositionMarker: null,
		nearbyStopsMarkers: new Array(),
		ajaxTimeout: null,
		marker_icons: {
			dot: {
				url: 'img/marker_dot.png',
				anchor: new google.maps.Point(16.5,16.5),
				scaledSize: new google.maps.Size(22,22),
			},
			dot_shadow: {
				url: 'img/marker_dot_shadow.png',
				anchor: new google.maps.Point(22,22),
				scaledSize: new google.maps.Size(33,33),
			},
			1: {
				url: 'img/marker_icon_troncal.png',
				anchor: new google.maps.Point(16,35),
				// origin: new google.maps.Point(0,0), //used for sprites, offset
				// size: new google.maps.Size(32,46), //used for sprites, display size
				scaledSize: new google.maps.Size(24,35),
			},
			2: {
				url: 'img/marker_icon_pretroncal.png',
				anchor: new google.maps.Point(16,35),
				scaledSize: new google.maps.Size(24,35),
			},
			3: {
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
				minZoom: 11,
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

		setPositionMarker: function(position) {
			if (this.currentPositionMarker === null) {
				var markerOptions = {
					map: this.map,
					title: "¡Estas aquí!",
					icon: this.marker_icons.dot,
					shadow: this.marker_icons.dot_shadow,
					position: new google.maps.LatLng(position.lat(), position.lng()),
					zIndex: google.maps.Marker.MAX_ZINDEX
					// animation : google.maps.Animation.DROP
				}
				this.currentPositionMarker = new google.maps.Marker(markerOptions);
			} else {
				ta.map.currentPositionMarker.setPosition(position);
			}
		},

		addStopMarker: function(stop) {
			var markerOptions = {
				map: this.map,
				title: stop.nombre,
				// icon: this.marker_icons[stop.type],
				icon: this.marker_icons[stop.tipo_parada],
				shadow: this.marker_icons.shadow,
				position: new google.maps.LatLng(stop.lat, stop.lng),
				// animation : google.maps.Animation.DROP
			}
			var marker = new google.maps.Marker(markerOptions);
			this.nearbyStopsMarkers.push(marker);

			// //Asocio el click del marcador a la ventana con los detalle de la promoción 
			google.maps.event.addListener(marker, "click", function() {
				// ta.map.map.panTo(marker.position);
			})
		},

		loadNearbyStops: function(position, type){
			var data = {lat: position.lat(), lng: position.lng()}

			var distancias = {11: 16000, 12: 8000, 13: 4000, 14: 2000, 15: 1000, 16: 500, 17: 250}
			data.distancia = distancias[this.map.getZoom()];
			// TODO: reemplazar el sistema de zoom y distancias con el uso de los boundaries del mapa

			if (this.map.getZoom() <= 13){
				data.tipo = 1;
			}

			// TODO: Idea: mostrar max 100 puntos, ordenados por tipo y cercania?
			$.ajax({
				url: "http://transporteactivo.com/api/v1/paradas-cercanas/",
				type: "get",
				data: data,
				dataType: "JSON",
				// async: false,
				beforeSend: function(jqXHR, settings) {
					$.mobile.loading('show', {text: 'Cargando estaciones cercanas...'});
				},
				complete: function(jqXHR, settings) {
					$.mobile.loading('hide');
				},
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
		},

		resetZoom: function() {
			this.map.setZoom(15);
		}
	},

	init: function() {
		this.map.init();
		this.geoLocation.findLocation();
	}
};

$(document).on('pageinit', '#plan-trip', function(event){
	window.ta.init();
	// when the map finishes loading
	google.maps.event.addListenerOnce(ta.map.map, 'idle', function() {
		// load the stops nearby to the center of the map
		ta.map.loadNearbyStops(ta.map.map.getCenter());

		// add the custom controls
		ta.map.map.controls[google.maps.ControlPosition.TOP_LEFT].push($('a.control.geolocalizar').get(0));
		$('a.control.geolocalizar').addClass('visible').click(function(){ta.geoLocation.findLocation();});
	});
	// every time the map is moved/dragged or the zoom changed
	google.maps.event.addListener(ta.map.map, 'bounds_changed', function() {
		if (ta.map.ajaxTimeout) {
			window.clearTimeout(ta.map.ajaxTimeout);
		}
		ta.map.ajaxTimeout = window.setTimeout(function() {
			ta.map.loadNearbyStops(ta.map.map.getCenter());
		}, 250);
	});
});

$(window).on('orientationchange resize pageshow', function(event) {
	// fix the content height
	fixgeometry();

	switch($.mobile.activePage.attr('id')) {
		case 'plan-trip':
			// resize the map to fit the content, minus the search form
			$('.map-canvas').height($(".ui-content:visible").height()-$(".planear-viaje").height());
			google.maps.event.trigger(ta.map.map, "resize");
			break;
		case 'search':
			break;
	}
});
