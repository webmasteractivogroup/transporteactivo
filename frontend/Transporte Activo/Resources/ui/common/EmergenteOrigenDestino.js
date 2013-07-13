/**
 * @author Matheo Fiebiger
 */

var container;
var win;
var shadow;

exports.popup = function(current, id, nombre, latlng) {

	container = current;

	win = Ti.UI.createView({
		left : '20 dp',
		top : '10 dp',
		right : '20 dp',
		bottom : '10 dp',
		height : Ti.UI.SIZE
	});

	shadow = Ti.UI.createView({
		backgroundColor : 'black',
		height : '40 dp'
	});
	var frmLog = Ti.UI.createView({

		backgroundColor : 'white',
		layout : "vertical",
		height : Ti.UI.SIZE
	});

	var btngroup = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : "100%",
		top : '5 dp',
		bottom : '5 dp',
	});
	var btnInicio = Ti.UI.createButton({
		title : "Iniciar Aquí",
		width : "45%",
		height : '40 dp',
		left : '10 dp',
		font : {
			fontWeight : 'bold',
			fontSize : '15 dp'
		}

	});

	btnInicio.addEventListener('click', function() {
		current.remove(win);
		current.activePopUp = false;
		current.remove(current.blur);

	});
	var btnFinal = Ti.UI.createButton({
		title : "Llegar Aquí",
		width : "45%",
		height : '40 dp',
		right : '10 dp',
		font : {
			fontWeight : 'bold',
			fontSize : '15 dp'
		}
	});

	btnFinal.addEventListener('click', function() {
		current.remove(win);
		current.remove(current.blur);

	});

	var btnVerMas = Ti.UI.createButton({
		title : "Ver más información",
		left : '10 dp',
		right : '10 dp',
		height : '40 dp',
		bottom : '15 dp',
		top : '5 dp',
		font : {
			fontWeight : 'bold',
			fontSize : '15 dp'
		}
	});

	btnVerMas.addEventListener('click', function() {

		current.remove(win);
		current.remove(current.blur);
		var masInfoWindow = Ti.UI.createWindow({
			backgroundColor : 'white',
		});
		masInfoWindow.orientationModes=[Titanium.UI.PORTRAIT];
		masInfoWindow.title = 'Información de Parada';
		var Parada = require('ui/common/DisplayParada');
		var vistaParada = new Parada(nombre, latlng, id);
		masInfoWindow.add(vistaParada);

		Ti.App.tabPerfiles.open(masInfoWindow);
		Ti.App.tabgroup.setActiveTab(1);

	});

	var btnExit = Ti.UI.createButton({
		title : "x",
		right : 0,
		width : "15%",
		height : '40 dp',
		borderColor : null,
		backgroundColor : 'gray',
		borderRadius : 0,
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	});

	btnExit.addEventListener('click', function() {
		current.isPopUpActive = false;
		current.remove(win);
		current.remove(current.blur);

	});

	var labelTitulo = Ti.UI.createLabel({
		color : '#FFFF',
		text : nombre,
		font : {
			fontWeight : 'bold',
			fontSize : '13 dp'
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "100%",
		height : shadow.height,
		left : 0
	});
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
		top : '5 dp',
		bottom : '10 dp'
	});
	var rutasgroupNorte = Ti.UI.createView({
		layout : 'horizontal',
		left : '10 dp',
		right : '10 dp',
		height : Ti.UI.SIZE,
		top : '5 dp',
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

	shadow.add(labelTitulo);
	shadow.add(btnExit);
	frmLog.add(shadow);
	frmLog.add(labelRutasSur);
	frmLog.add(rutasgroupSur);
	frmLog.add(labelRutasNorte);
	frmLog.add(rutasgroupNorte);
	//btngroup.add(btnInicio);
	//btngroup.add(btnFinal);
	btngroup.add(btnVerMas);
	frmLog.add(btngroup);
	win.add(frmLog);
	return win;
}
function goToRuta(e) {
	var masInfoWindow = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	masInfoWindow.orientationModes=[Titanium.UI.PORTRAIT];
	masInfoWindow.title = 'Información de Ruta';
	var Ruta = require('ui/common/DisplayRuta');
	var vistaRuta = new Ruta(e.source.nombre, e.source.tipo, e.source.orient, e.source.id);
	masInfoWindow.add(vistaRuta);

	Ti.App.tabPerfiles.open(masInfoWindow);

	container.isPopUpActive = false;
	container.remove(win);
	container.remove(container.blur);
	Ti.App.tabgroup.setActiveTab(1);

}