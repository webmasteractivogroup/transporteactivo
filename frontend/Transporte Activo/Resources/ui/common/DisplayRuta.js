var data = [];
var tableViewParadas;
var idForComment;

function DisplayRuta(nombre, tipo, sentido, id, desc) {
	idForComment = id;

	Ti.API.info("EL NOMBRE "+ nombre);
	var self = Ti.UI.createView({
		layout : 'vertical',
		width : Ti.UI.FILL,
		height : Ti.UI.FILL

	});

	var titulo = Ti.UI.createLabel({
		top : '5 dp',
		left : '5 dp',
		width: "70%",
		text : nombre,
		color : 'black',
		font : {
			fontWeight : 'bold',
			fontSize : '18 dp'
		},
	});

	var tipoLabel = Ti.UI.createLabel({
		top : '10 dp',
		left : '5 dp',
		text : tipo,
		color : 'black',
		font : {
			fontWeight : 'bold',
			fontSize : '17 dp'
		}
	});

	var imagen;
	if (tipo === 'Tipo: Padron') {
		imagen = '/images/bus_padron.png';
	} else if (tipo == 'Tipo: Alimentador') {
		imagen = '/images/bus_alimentador.png';
	} else {
		imagen = '/images/bus_articulado.png';
	}
	var imageBus = Ti.UI.createImageView({
		image : imagen,
		top : '-30 dp',
		right : '30 dp',
		height : '40 dp',
		width : '80 dp'

	});

	var sentido = Ti.UI.createLabel({
		top : '10 dp',
		left : '5 dp',
		text : sentido,
		color : 'black',
		font : {
			fontWeight : 'bold',
			fontSize : '17 dp'
		}
	});
	var paradas = Ti.UI.createLabel({
		top : '10 dp',
		left : '5 dp',
		text : 'Paradas:',
		color : 'black',
		font : {
			fontWeight : 'bold',
			fontSize : '17 dp'
		}
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
	btngroup.add(reportaLabel);
	btngroup.add(voteGood);
	btngroup.add(voteMedium);
	btngroup.add(voteBad);

	tableViewParadas = Ti.UI.createTableView({
		left : '10 dp',
		top : '10 dp',
		right : '10 dp'
	});

	tableViewParadas.addEventListener('click', function(e) {
		var masInfoWindow = Ti.UI.createWindow({
			backgroundColor : 'white',

		});
		masInfoWindow.orientationModes = [Titanium.UI.PORTRAIT];
		masInfoWindow.title = 'Información de Parada';
		var Parada = require('ui/common/DisplayParada');
		var vistaParada = new Parada(e.row.nombre, e.row.latlng);   // Falta mandar id y tipo
		masInfoWindow.add(vistaParada);

		
	Ti.App.tabActual.open(masInfoWindow);
	});

	var or;
	if (sentido === 'Sentido: Norte -> Sur') {
		or = 0;
	} else {
		or = 1;
	}
	
	var btnFavs = Ti.UI.createImageView({
		title : "",
		right : '5dp',
		top : '-25dp',
		width : '40dp',
		height : '40dp',
		image : '/images/favoritos.png',
		backgroundColor : 'gray',
		borderRadius : 10,
	});

	var primary = id+''+or;
	btnFavs.addEventListener('click', function() {
		var db = Ti.Database.open('TACTIVO');
		try {
	db.execute('INSERT INTO favoritos (id,identif,nombre,tipo,extra,extra2) VALUES (?,?,?,?,?,?)', primary, id, desc, 'r',nombre, or);
	db.close();
	alert("Ruta agregada a favoritos");
	}catch (exception) {

			alert("Esta parada ya es favorita");
		}
		
		Ti.App.tab3window.fireEvent('actua');
		

	});
	
	
	buscarParadas(id, or);
	
	

	self.add(titulo);
	self.add(btnFavs);
	self.add(tipoLabel);
	self.add(imageBus);
	self.add(sentido);
	self.add(btngroup);
	self.add(paradas);
	self.add(tableViewParadas);

	return self;

}

function buscarParadas(id, orient) {
	var url = "http://transporteactivo.com/api/v1/paradas-por-ruta/?ruta_id=" + id + "&orientacion=" + orient;
	Ti.API.log('URL: ' + url);
	var json, result, i;

	var xhr = Ti.Network.createHTTPClient({
		onload : function() {

			Ti.API.log('RESPUESTA: ' + this.responseText);

			json = JSON.parse(this.responseText);
			for ( i = 0; i < json.length; i++) {

				var row = Ti.UI.createTableViewRow({
					height : '40 dp',
				});

				result = json[i];

				var myView = Ti.UI.createView({
					layout : 'horizontal'
				});

				var myText = Ti.UI.createLabel({
					text : result.nombre_parada,
					top : '10 dp',
					left : '5 dp',
					width : '100%',
					height : 'auto',
					color : 'black',
					textAlign : 'left',
					font : {
						fontSize : '13 dp'
					}
				});

				myView.add(myText);
				row.nombre = result.nombre_parada;
				row.latlng = result.lat + ';' + result.lng
				row.id = result.id;
				row.add(myView);
				row.classname = "item";
				data[i] = row;
			}
			tableViewParadas.data = data;
		},
		onerror : function(e) {
			Ti.API.log("STATUS: " + this.status);
			Ti.API.log("TEXT:   " + this.responseText);
			Ti.API.log("ERROR:  " + e.error);
			alert('No se pudo contactar al servidor, intentelo de nuevo');

		},
		timeout : 5000
	});

	Ti.API.log('Search request va a abrir');
	activeRequest = true;
	xhr.open("GET", url);
	xhr.send();
	Ti.API.log('Search request enviado');

}

function goToComment(e) {

	var masInfoWindow = Ti.UI.createWindow({
		backgroundColor : 'white',
	});
	masInfoWindow.orientationModes = [Titanium.UI.PORTRAIT];
	masInfoWindow.title = 'Reportes';
	var newVista = require('ui/common/RetroAlim');
	var vistaComment = new newVista(idForComment, e.source.tipo, 'lines');
	masInfoWindow.add(vistaComment);
	Ti.App.tabActual.open(masInfoWindow);
}

module.exports = DisplayRuta;
