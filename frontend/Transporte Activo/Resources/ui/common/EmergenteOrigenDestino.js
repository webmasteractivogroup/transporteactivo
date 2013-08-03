/**
 * @author Matheo Fiebiger
 */

var win;
var shadow;
var idForComment;
var isFavorito;

exports.popup = function(current, id, nombre, latlng, tipo) {
	idForComment = id;
	

	isFavorite(id);

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

		var masInfoWindow = Ti.UI.createWindow({
			backgroundColor : 'white',
		});
		masInfoWindow.orientationModes = [Titanium.UI.PORTRAIT];
		masInfoWindow.title = 'Información de Parada';
		var Parada = require('ui/common/DisplayParada');
		var vistaParada = new Parada(nombre, latlng, id, tipo);
		masInfoWindow.add(vistaParada);

		Ti.App.tabActual = Ti.App.tabMapa;
		Ti.App.tabActual.open(masInfoWindow);

	});

	var btnExit = Ti.UI.createButton({
		title : "X",
		right : 0,
		width : "15%",
		height : '40 dp',
		borderColor : null,
		backgroundColor : 'gray',
		borderRadius : 0,
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	});

	var laImagen;
	if (isFavorito === true) {
		laImagen = '/images/si_favorito.png';
	} else {
		laImagen = '/images/favoritos.png';
	};

	var btnFavs = Ti.UI.createImageView({
		title : "",
		left : 0,
		width : '40dp',
		height : '40dp',
		image : laImagen,
		backgroundColor : 'gray',
		borderRadius : 0,
	});

	btnFavs.addEventListener('click', function() {
		var db = Ti.Database.open('TACTIVO');
		try {
			if (isFavorito === true) {
				db.execute('DELETE FROM favoritos WHERE id=?', id);
				alert("Parada eliminada de favoritos");
				btnFavs.image = '/images/favoritos.png';
				isFavorito=false;
			} else {
				db.execute('INSERT INTO favoritos (id,identif,nombre,tipo,extra,extra2,linev) VALUES (?,?,?,?,?,?,?)', id, id, nombre, 'p', tipo, latlng,'0');
				isFavorito=true;
				btnFavs.image = '/images/si_favorito.png';
				alert("Parada agregada a favoritos");
			};
			
			db.close();
			
		} catch (exception) {

			alert("Esta parada ya es favorita");
		}

		Ti.App.tab3window.fireEvent('actua');

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
	var labelRutas = Ti.UI.createLabel({
		color : 'black',
		text : 'Rutas',
		font : {
			fontWeight : 'bold',
			fontSize : '16 dp',
		},
		width : Ti.UI.SIZE,
		left : '10 dp',
		top : '3 dp'
	});


	var rutasgroup = Ti.UI.createView({
		layout : 'horizontal',
		left : '10 dp',
		right : '10 dp',
		height : Ti.UI.SIZE,
		top : '5 dp',
		bottom : '10 dp'
	});
	
	var grupoReporta = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'horizontal',
		width : "100%",
		top : '5 dp',
		backgroundColor : 'gray'
	});
	var voteGood = Ti.UI.createButton({
		title : "",
		top : '5dp',
		bottom : '5dp',
		left : '5dp',
		width : '40dp',
		height : '40 dp',
		borderRadius : 10,
		backgroundImage : '/images/carita_verde.png',
		tipo : 'a'
	});

	voteGood.addEventListener('click', goToComment);

	var voteMedium = Ti.UI.createButton({
		title : "",
		width : '40dp',
		height : '40 dp',
		left : '10 dp',
		borderRadius : 10,
		backgroundImage : '/images/carita_amarilla.png',
		tipo : 'n'
	});

	voteMedium.addEventListener('click', goToComment);

	var voteBad = Ti.UI.createButton({
		title : "",
		width : '40dp',
		height : '40 dp',
		left : '10 dp',
		borderRadius : 10,
		backgroundImage : '/images/carita_roja.png',
		tipo : 'd'
	});

	voteBad.addEventListener('click', goToComment);

	var reportaLabel = Ti.UI.createLabel({
		color : 'white',
		text : 'Reporta:',
		font : {
			fontWeight : 'bold',
			fontSize : '16 dp',
		},
		width : Ti.UI.SIZE,
		left : '10%',

	});
	grupoReporta.add(reportaLabel);
	grupoReporta.add(voteGood);
	grupoReporta.add(voteMedium);
	grupoReporta.add(voteBad);

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
					orient : ruta.orientacion,
					id : ruta.id_ruta,
					desc : ruta.descripcion,
					lineV: ruta.linevariant
				});

				rutasquare.addEventListener('click', goToRuta);
				rutasgroup.add(rutasquare);
				//// SENTIDO SUR-NORTE
				/*if (ruta.orientacion === 0) {
					rutasgroupSur.add(rutasquare);
				} else {
					rutasgroupNorte.add(rutasquare);
				}*/
				
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
	shadow.add(btnFavs);
	shadow.add(btnExit);
	frmLog.add(shadow);
	frmLog.add(labelRutas);
	frmLog.add(rutasgroup);
	//btngroup.add(btnInicio);
	//btngroup.add(btnFinal);
	btngroup.add(btnVerMas);
	frmLog.add(btngroup);
	frmLog.add(grupoReporta);
	win.add(frmLog);
	return win;
}
function goToRuta(e) {
	var masInfoWindow = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	masInfoWindow.orientationModes = [Titanium.UI.PORTRAIT];
	masInfoWindow.title = 'Información de Ruta';
	var Ruta = require('ui/common/DisplayRuta');
	var vistaRuta = new Ruta(e.source.desc, e.source.tipo, e.source.orient, e.source.id, e.source.nombre,e.source.lineV);
	masInfoWindow.add(vistaRuta);

	Ti.App.tabActual = Ti.App.tabMapa;
	Ti.App.tabActual.open(masInfoWindow);

}

function isFavorite(id) {
	Ti.API.info("CHECKING FAVS");
	isFavorito = false;
	var db = Ti.Database.open('TACTIVO');
	var datos = db.execute('SELECT id FROM favoritos');
	var i = 0;
	while (datos.isValidRow()) {
		var elid = datos.fieldByName('id');
		if (elid === id) {
			isFavorito = true;
		}
		datos.next();
	}
	db.close();
}

function goToComment(e) {

	var masInfoWindow = Ti.UI.createWindow({
		backgroundColor : 'white',
	});
	masInfoWindow.orientationModes = [Titanium.UI.PORTRAIT];
	masInfoWindow.title = 'Reportes';
	var newVista = require('ui/common/RetroAlim');
	var vistaComment = new newVista(idForComment, e.source.tipo, 'miostops');
	masInfoWindow.add(vistaComment);
	Ti.App.tabActual = Ti.App.tabMapa;
	Ti.App.tabActual.open(masInfoWindow);
}