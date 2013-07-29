var idForComment;
var isFavorito;

function DisplayParada(nombre, latlng, id, tipo) {

	isFavorite(id);

	idForComment = id;
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
		color : 'black',
		font : {
			fontWeight : 'bold',
			fontSize : '20 dp'
		},
	});

	var ubicacionLabel = Ti.UI.createLabel({
		top : '-5 dp',
		left : '5 dp',
		text : 'Ubicación',
		color : 'black',
		font : {
			fontWeight : 'bold',
			fontSize : '17 dp'
		}
	});

	var imageMap = Ti.UI.createImageView({
		height : '30%',
		image : 'http://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng + '&markers=%7C' + lat + ',' + lng + '&size=' + Titanium.Platform.displayCaps.platformWidth + 'x' + parseInt(Titanium.Platform.displayCaps.platformHeight * 0.3) + '&zoom=15&maptype=roadmap&sensor=false',
		top : '5 dp',
		right : '5 dp',
		left : '5 dp',
		width : Ti.UI.FILL,
		preventDefaultImage : true
	});

	Ti.API.info(imageMap.image);
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

	var btngroup = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'horizontal',
		width : "100%",
		top : '5 dp',
		bottom : '5 dp',
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
		left : '15%',

	});

	var laImagen;
	if (isFavorito === true) {
		laImagen = '/images/si_favorito.png';
	} else {
		laImagen = '/images/favoritos.png';
	};

	var btnFavs = Ti.UI.createImageView({
		title : "",
		right : '5dp',
		top : '-20dp',
		width : '40dp',
		height : '40dp',
		image : laImagen,
		backgroundColor : 'gray',
		borderRadius : 10,
	});

	btnFavs.addEventListener('click', function() {
		var db = Ti.Database.open('TACTIVO');
		try {
			if (isFavorito === true) {
				db.execute('DELETE FROM favoritos WHERE id=?', id);
				alert("Parada eliminada de favoritos");
				btnFavs.image = '/images/favoritos.png';
				isFavorito = false;
			} else {
				Ti.API.info("EL TIPO DE PARADA " + tipo);
				db.execute('INSERT INTO favoritos (id,identif,nombre,tipo,extra,extra2,linev) VALUES (?,?,?,?,?,?,?)', id, id, nombre, 'p', tipo, latlng, '0');
				isFavorito = true;
				btnFavs.image = '/images/si_favorito.png';
				alert("Parada agregada a favoritos");
			};

			db.close();

		} catch (exception) {

			alert("Esta parada ya es favorita");
		}

		Ti.App.tab3window.fireEvent('actua');

	});

	btngroup.add(reportaLabel);
	btngroup.add(voteGood);
	btngroup.add(voteMedium);
	btngroup.add(voteBad);
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
					lineV : ruta.linevariant

				});
				rutasquare.addEventListener('click', goToRuta);
				rutasgroup.add(rutasquare);
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
	self.add(btnFavs);
	self.add(ubicacionLabel);
	self.add(imageMap);
	self.add(btngroup);
	self.add(labelRutas);
	self.add(rutasgroup);

	return self;

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
	Ti.App.tabActual.open(masInfoWindow);
}

function goToRuta(e) {
	var masInfoWindow = Ti.UI.createWindow({
		backgroundColor : 'white',

	});
	masInfoWindow.orientationModes = [Titanium.UI.PORTRAIT];
	masInfoWindow.title = 'Información de Ruta';
	var Ruta = require('ui/common/DisplayRuta');
	var vistaRuta = new Ruta(e.source.desc, e.source.tipo, e.source.orient, e.source.id, e.source.nombre, e.source.lineV);
	masInfoWindow.add(vistaRuta);

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
		if (parseInt(elid) === parseInt(id)) {
			isFavorito = true;
			Ti.API.info("SI ES FAVORITO");
		}
		datos.next();
	}
	db.close();
}

module.exports = DisplayParada;
