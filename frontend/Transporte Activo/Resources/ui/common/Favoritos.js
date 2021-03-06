var rowData = [];
var tableView;
var currentid;
var borrando = false;

function Favoritos() {
	var self = Ti.UI.createView({
		layout : 'vertical',
		width : Ti.UI.FILL,
		height : Ti.UI.FILL

	});

	tableView = Titanium.UI.createTableView({
	});

	update();

	tableView.addEventListener('click', function(e) {

		var masInfoWindow = Ti.UI.createWindow({
			backgroundColor : 'white',
		});

		if (e.row.tipores === 'r') {
			masInfoWindow.title = 'Información de Ruta';
			var Ruta = require('ui/common/DisplayRuta');
			Ti.API.info('LINEV FAVS' + e.row.lineV);
			var vistaRuta = new Ruta(e.row.nombre, e.row.tipo, e.row.orientacion, e.row.id, e.row.desc, parseInt(e.row.lineV));
			masInfoWindow.add(vistaRuta);

			setTimeout(function(e) {
			}, 5000);

			if (borrando === false) {
				Ti.App.tabActual = Ti.App.tabFavoritos;
				Ti.App.tabActual.open(masInfoWindow);
			}

		} else {
			masInfoWindow.title = 'Información de Parada';
			var Parada = require('ui/common/DisplayParada');
			var vistaParada = new Parada(e.row.nombre, e.row.latlng, e.row.id, e.row.tipo);
			masInfoWindow.add(vistaParada);

			setTimeout(function(e) {
			}, 5000);
			if (borrando === false) {
				Ti.App.tabActual = Ti.App.tabFavoritos;
				Ti.App.tabActual.open(masInfoWindow);
			}
		}

	});

	self.add(tableView);
	self.addEventListener('actua', update);

	return self;
}

function update() {
	rowData = [];
	var db = Ti.Database.open('TACTIVO');
	var datos = db.execute('SELECT id,identif,nombre,tipo,extra,extra2,linev FROM favoritos');
	var i = 0;
	while (datos.isValidRow()) {
		var id = datos.fieldByName('id');
		var identif = datos.fieldByName('identif');
		var nombre = datos.fieldByName('nombre');
		var tipo = datos.fieldByName('tipo');
		var extra = datos.fieldByName('extra');
		var extra2 = datos.fieldByName('extra2');
		var lineV = datos.fieldByName('linev');

		datos.next();

		var row = Ti.UI.createTableViewRow({
			height : '50 dp',
		});
		var imagen;

		var myView = Ti.UI.createView({
			layout : 'horizontal'
		});

		row.tipores = tipo;
		if (tipo === 'p') {
			extra = '' + parseInt(extra);
			row.tipo = extra;
			if (extra === '1') {
				imagen = '/images/marker_icon_troncal@2x.png';
			} else if (extra === '2') {
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
				text : nombre,
				top : '10 dp',
				left : '5 dp',
				width : '60%',
				height : 'auto',
				textAlign : 'left',
				color : 'black',
				font : {
					fontSize : '13 dp'
				}
			});

			row.nombre = nombre;
			row.latlng = extra2;

			myView.add(av_image);
			myView.add(myText);
		} else {
			//box de ruta//
			var color;
			if (nombre.charAt(0) === 'A') {
				color = '#bbbb00';
				row.tipo = 'Tipo: Alimentador';
			} else if (nombre.charAt(0) === 'P') {
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
				text : nombre,
				font : {
					fontSize : '12 dp',
					fontWeight : 'bold'
				},
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			});
			var adding;
			if (extra2 === '0') {

				adding = 'Norte -> Sur';
			} else {
				
				adding = 'Sur -> Norte';
			}
			row.orientacion = extra2;
			var myText = Ti.UI.createLabel({
				text : extra + ' (' + adding + ')',
				top : '10 dp',
				left : '10 dp',
				width : '60%',
				height : 'auto',
				textAlign : 'left',
				color : 'black',
				font : {
					fontSize : '13 dp'
				}
			});

			row.nombre = extra;
			row.lineV = lineV;
			myView.add(rutasquare);
			myView.add(myText);
			row.desc = nombre;
		}

		var bt = Ti.UI.createButton({
			title : 'X',
			nombre : nombre,
			top : '10dp',
			right : '5dp',
			borderColor : null,
			style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
			height : '20dp',
			width : '30dp',
			color : 'white',
			backgroundColor : 'red',
			borderRadius : 3,
			id : id,
			font : {
				fontSize : '16 dp',
				fontWeight : 'bold'
			}
		});
		bt.addEventListener('click', function(e) {
			borrando = true;
			currentid = e.source.id;
			var dialog = Titanium.UI.createAlertDialog({
				message : '¿Borrar ' + e.source.nombre + ' de favoritos?',
				buttonNames : ['Si', 'No'],
			});
			dialog.show();
			dialog.addEventListener('click', function(e) {
				if (e.index == 0) {
					var db = Ti.Database.open('TACTIVO');
					db.execute('DELETE FROM favoritos WHERE id=?', currentid);
					db.close();
					update();
				}
				borrando = false;
			});
		});

		var myView2 = Ti.UI.createView({
			left : '250dp'
		});

		myView2.add(bt);

		row.id = "" + identif;
		row.add(myView);
		row.add(myView2);
		row.classname = "item";
		rowData[i] = row;
		i++;

	}
	db.close();
	tableView.data = rowData;
}

module.exports = Favoritos;
