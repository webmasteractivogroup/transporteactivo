function DisplayParada(nombre, latlng, id) {

	var latlngs = latlng.split(';');
	var lat = latlngs[0];
	var lng = latlngs[1];

	var self = Ti.UI.createView({
		layout : 'vertical',
		width : Ti.UI.FILL,
		height : Ti.UI.FILL

	});

	var titulo = Ti.UI.createLabel({
		top : '5 dp',
		left : '5 dp',
		text : nombre,
		font : {
			fontWeight : 'bold',
			fontSize : '20 dp'
		},
	});

	var ubicacionLabel = Ti.UI.createLabel({
		top : '10 dp',
		left : '5 dp',
		text : 'Ubicación',
		font : {
			fontWeight : 'bold',
			fontSize : '17 dp'
		}
	});

	var imageMap = Ti.UI.createImageView({
		image : 'http://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng + '&markers=%7C' + lat + ',' + lng + '&size=460x153&zoom=15&maptype=roadmap&sensor=false',
		top : '5 dp',
		right : '5 dp',
		left : '5 dp',
		preventDefaultImage : true
	});

	Ti.API.info(imageMap.image);
	var labelRutasSur = Ti.UI.createLabel({
		color : 'black',
		text : 'Rutas Norte -> Sur',
		font : {
			fontWeight : 'bold',
			fontSize : '16 dp',
		},
		width : Ti.UI.SIZE,
		left : '10 dp',
		top : '3 dp'
	});

	var labelRutasNorte = Ti.UI.createLabel({
		color : 'black',
		text : 'Rutas Sur -> Norte',
		font : {
			fontWeight : 'bold',
			fontSize : '16 dp',
		},
		width : Ti.UI.SIZE,
		left : '10 dp',
		top : '3 dp'
	});

	var rutasgroupSur = Ti.UI.createView({
		layout : 'horizontal',
		left : '10 dp',
		right : '10 dp',
		height : Ti.UI.SIZE,
		top : '10 dp',
		bottom : '10 dp'
	});
	var rutasgroupNorte = Ti.UI.createView({
		layout : 'horizontal',
		left : '10 dp',
		right : '10 dp',
		height : Ti.UI.SIZE,
		top : '10 dp',
		bottom : '10 dp'
	});

	var json, ruta, i;

	var url = "http://transporteactivo.com/api/v1/rutas-por-parada/?parada_id=" + id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {

			Ti.API.log('RESPUESTA: ' + this.responseText);

			json = JSON.parse(this.responseText);
			Ti.API.log('RUTAS: ' + json.length);
			for ( i = 0; i < json.length; i++) {
				ruta = json[i];

				var color;
				if (ruta.nombre_ruta.charAt(0) === 'A') {
					color = '#bbbb00';
				} else if (ruta.nombre_ruta.charAt(0) === 'P') {
					color = '#e4004f';
				} else {
					color = '#2e2482';
				}

				var elTipo;
				if (ruta.nombre_ruta.charAt(0) === 'A') {

					elTipo = 'Tipo: Alimentador';
				} else if (ruta.nombre_ruta.charAt(0) === 'P') {

					elTipo = 'Tipo: Padron';
				} else {

					elTipo = 'Tipo: Articulado';
				}
				var or;
				if (ruta.orientacion === '0') {
					or = 'Sentido: Norte -> Sur';

				} else {
					or = 'Sentido: Sur -> Norte';

				}
				var rutasquare = Ti.UI.createLabel({
					color : 'white',
					width : '50 dp',
					height : '22 dp',
					right : '1 dp',
					bottom : '1 dp',
					backgroundColor : color,
					text : ruta.nombre_ruta,
					font : {
						fontSize : '12 dp',
						fontWeight : 'bold'
					},
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					nombre : ruta.nombre_ruta,
					tipo : elTipo,
					orient : or,
					id : ruta.id_ruta
				});

				rutasquare.addEventListener('click', goToRuta);

				if (ruta.orientacion === 0) {
					rutasgroupSur.add(rutasquare);
				} else {
					rutasgroupNorte.add(rutasquare)
				}
			}

		},
		onerror : function(e) {
			Ti.API.log("STATUS: " + this.status);
			Ti.API.log("TEXT:   " + this.responseText);
			Ti.API.log("ERROR:  " + e.error);
			alert('No se pudo contactar al servidor, intentelo de nuevo');
		},
		timeout : 5000
	});

	Ti.API.log('Rutas por parada');

	xhr.open("GET", url);
	xhr.send();
	Ti.API.log('Rutas por parada request enviado');

	self.add(titulo);
	self.add(ubicacionLabel);
	self.add(imageMap);
	self.add(labelRutasSur);
	self.add(rutasgroupSur);
	self.add(labelRutasNorte);
	self.add(rutasgroupNorte);

	return self;

}

function goToRuta(e) {
	var masInfoWindow = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	masInfoWindow.title = 'Información de Ruta';
	var Ruta = require('ui/common/DisplayRuta');
	var vistaRuta = new Ruta(e.source.nombre, e.source.tipo, e.source.orient, e.source.id);
	masInfoWindow.add(vistaRuta);
	
	Ti.App.tabPerfiles.open(masInfoWindow);
}

module.exports = DisplayParada;
