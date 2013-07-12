var data = [];
var tableViewParadas;

function DisplayRuta(nombre, tipo, sentido, id) {

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

	var tipoLabel = Ti.UI.createLabel({
		top : '10 dp',
		left : '5 dp',
		text : tipo,
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
		right : '30 dp'
	});

	var sentido = Ti.UI.createLabel({
		top : '10 dp',
		left : '5 dp',
		text : sentido,
		font : {
			fontWeight : 'bold',
			fontSize : '17 dp'
		}
	});
	var paradas = Ti.UI.createLabel({
		top : '10 dp',
		left : '5 dp',
		text : 'Paradas:',
		font : {
			fontWeight : 'bold',
			fontSize : '17 dp'
		}
	});
	tableViewParadas = Ti.UI.createTableView({
		left : '10 dp',
		top : '10 dp',
		right : '10 dp'
	});

	tableViewParadas.addEventListener('click', function(e) {
		var masInfoWindow = Ti.UI.createWindow({
			backgroundColor : 'white'
		});
		masInfoWindow.title = 'Información de Parada';
		var Parada = require('ui/common/DisplayParada');
		var vistaParada = new Parada(e.row.nombre, e.row.latlng, e.row.id);
		masInfoWindow.add(vistaParada);

		Ti.App.tabPerfiles.open(masInfoWindow);
	});

	var or;
	if (sentido === 'Sentido: Norte -> Sur') {
		or = 0;
	} else {
		or = 1;
	}
	buscarParadas(id, or);

	self.add(titulo);
	self.add(tipoLabel);
	self.add(imageBus);
	self.add(sentido);
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
					textAlign : 'left',
					font : {
						fontSize : '13 dp'
					}
				});

				myView.add(myText);
				row.nombre= result.nombre_parada;
				row.latlng = result.lat +';'+result.lng
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

module.exports = DisplayRuta;
