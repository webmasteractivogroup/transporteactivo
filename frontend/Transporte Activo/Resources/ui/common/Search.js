var data = [];
var activeRequest = false;
var tableview;
var times = 0;

function Search() {

	var tblsearch = Ti.UI.createSearchBar({
		hintText : 'Buscar ruta, estación o parada...',
		barColor : 'black'
	});

	tblsearch.addEventListener('change', function(e) {

		if (e.value != "" && times === 0) {
			times = 1;
			var navActInd = Titanium.UI.createActivityIndicator({
				left : '60 dp',
				top : '18 dp',

			});
			navActInd.show();
			var loadingRow = Ti.UI.createTableViewRow({
				height : '50 dp',
				backgroundColor : 'black'
			});

			var myView = Ti.UI.createView({
				layout : 'horizontal',
				backgroundColor : 'black'

			});
			var myText = Ti.UI.createLabel({
				text : 'Buscando...',
				left : '10 dp',
				top : '10 dp',
				color : 'white',
				width : Ti.UI.SIZE,
				height : 'auto',
				textAlign : 'left',
				font : {
					fontSize : '17 dp',
					fontWeight : 'bold'
				}
			});
			myView.add(navActInd);
			myView.add(myText);
			loadingRow.add(myView);

			data[0] = loadingRow;
			tableview.data = data;
			consulta(tblsearch.value);

		}
		if (e.value === "") {
			data = [];
			times = 0;

		}

	});

	tblsearch.addEventListener('cancel', function(e) {

		tblsearch.value = "";
		data = [];
		tableview.data = data;
		times = 0;

	});

	if (Ti.Platform.osname === 'android') {
		tableview = Ti.UI.createTableView({
			search : tblsearch,
			filterAttribute : 'title'
		});
	} else {
		tableview = Ti.UI.createTableView({
			search : tblsearch,
			filterAttribute : 'titulo'
		});

	}

	tableview.addEventListener('click', function(e) {

		tblsearch.value = "";
		data = [];
		tableview.data = data;
		times = 0;

		var masInfoWindow = Ti.UI.createWindow({
			backgroundColor : 'white',
		});

		Ti.API.info('ROW TIPO =' + e.row.tipores);
		if (e.row.tipores === 'r') {
			masInfoWindow.title = 'Información de Ruta';
			var Ruta = require('ui/common/DisplayRuta');
			var vistaRuta = new Ruta(e.row.nombre, e.row.tipo, e.row.orientacion, e.row.id, e.row.desc,e.row.lineV);
			masInfoWindow.add(vistaRuta);

			Ti.App.tabActual = Ti.App.tabPerfiles;
			Ti.App.tabActual.open(masInfoWindow);

		} else {
			masInfoWindow.title = 'Información de Parada';
			var Parada = require('ui/common/DisplayParada');
			var vistaParada = new Parada(e.row.nombre, e.row.latlng, e.row.id, e.row.tipo);
			masInfoWindow.add(vistaParada);

			Ti.App.tabActual = Ti.App.tabPerfiles;
			Ti.App.tabActual.open(masInfoWindow);

		}

	});

	return tableview;
}

function consulta(q) {

	var url = "http://transporteactivo.com/api/v1/buscar/?q=" + q;
	Ti.API.log('URL: ' + url);
	var json, result, i;

	var xhr = Ti.Network.createHTTPClient({
		onload : function() {

			Ti.API.log('RESPUESTA: ' + this.responseText);

			json = JSON.parse(this.responseText);
			for ( i = 0; i < json.length; i++) {

				var row = Ti.UI.createTableViewRow({
					height : '50 dp',
				});

				result = json[i];
				var imagen;

				var myView = Ti.UI.createView({
					layout : 'horizontal'
				});

				row.tipores = result.tipo;
				if (result.tipo === 'p') {
					if (result.extra === '1') {
						imagen = '/images/marker_icon_troncal@2x.png';
					} else if (result.extra === '2') {
						imagen = '/images/marker_icon_pretroncal@2x.png';
					} else {
						imagen = '/images/marker_icon_alimentadora@2x.png';
					}

					var av_image = Titanium.UI.createImageView({
						image : imagen, // the image for the image view
						top : '5 dp',
						left : '10 dp',
						height : '30 dp',
						width : '30 dp',

					});

					var myText = Ti.UI.createLabel({
						text : result.nombre,
						top : '10 dp',
						left : '5 dp',
						width : '70%',
						height : 'auto',
						textAlign : 'left',
						color : 'black',
						font : {
							fontSize : '13 dp'
						}
					});

					row.tipo = result.extra;
					row.nombre = result.nombre;
					row.latlng = result.extra2;

					myView.add(av_image);
					myView.add(myText);
				} else {
					//box de ruta//
					var color;
					if (result.nombre.charAt(0) === 'A') {
						color = '#bbbb00';
						row.tipo = 'Tipo: Alimentador';
					} else if (result.nombre.charAt(0) === 'P') {
						color = '#e4004f';
						row.tipo = 'Tipo: Padron';
					} else {
						color = '#2e2482';
						row.tipo = 'Tipo: Articulado';
					}

					var rutasquare = Ti.UI.createLabel({
						color : 'white',
						width : '50 dp',
						height : '22 dp',
						top : '10 dp',
						left : '10 dp',
						backgroundColor : color,
						text : result.nombre,
						font : {
							fontSize : '12 dp',
							fontWeight : 'bold'
						},
						textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					});
					var adding;
					if (result.extra2 === '0') {
						
						adding = 'Norte -> Sur';
					} else {
						
						adding = 'Sur -> Norte';
					}
					row.orientacion = result.extra2;

					var myText = Ti.UI.createLabel({
						text : result.extra + ' (' + adding + ')',
						top : '10 dp',
						left : '10 dp',
						width : '70%',
						height : 'auto',
						textAlign : 'left',
						color : 'black',
						font : {
							fontSize : '13 dp'
						}
					});
					row.desc= result.nombre;
					row.lineV = result.linevariant;
					row.nombre = result.extra;
					myView.add(rutasquare);
					myView.add(myText);
				}

				if (Ti.Platform.osname === 'android') {
					row.title = result.nombre;
				} else {
					row.titulo = result.nombre;
				}

				row.id = result.id;
				row.add(myView);
				row.classname = "item";
				data[i] = row;
			}
			tableview.data = data;
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
		Ti.API.log('Search request va a abrir');
		activeRequest = true;
		xhr.open("GET", url);
		xhr.send();
		Ti.API.log('Search request enviado');
	}

}

module.exports = Search;
