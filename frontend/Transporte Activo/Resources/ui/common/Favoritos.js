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

		Ti.API.info('ROW TIPO =' + e.row.tipores);
		if (e.row.tipores === 'r') {
			masInfoWindow.title = 'Información de Ruta';
			var Ruta = require('ui/common/DisplayRuta');
			var vistaRuta = new Ruta(e.row.nombre, e.row.tipo, e.row.orientacion, e.row.id);
			masInfoWindow.add(vistaRuta);

			setTimeout(function(e) {
			}, 5000);

			if (borrando === false) {
				Ti.App.tabPerfiles.open(masInfoWindow);
				Ti.App.tabgroup.setActiveTab(1);
			}

		} else {
			masInfoWindow.title = 'Información de Parada';
			var Parada = require('ui/common/DisplayParada');
			var vistaParada = new Parada(e.row.nombre, e.row.latlng, e.row.id);
			masInfoWindow.add(vistaParada);

			setTimeout(function(e) {
			}, 5000);
			if (borrando === false) {
				Ti.App.tabPerfiles.open(masInfoWindow);
				Ti.App.tabgroup.setActiveTab(1);
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
	var datos = db.execute('SELECT id,identif,nombre,tipo,extra,extra2 FROM favoritos');
	var i = 0;
	while (datos.isValidRow()) {
		var id = datos.fieldByName('id');
		var identif = datos.fieldByName('identif');
		var nombre = datos.fieldByName('nombre');
		var tipo = datos.fieldByName('tipo');
		var extra = datos.fieldByName('extra');
		var extra2 = datos.fieldByName('extra2');
		datos.next();

		var row = Ti.UI.createTableViewRow({
			height : '50 dp',
		});
		var imagen;

		var myView = Ti.UI.createView({
			layout : 'horizontal'
		});

		
		
		Ti.API.info('EXTRA'+extra);
		row.tipores = tipo;
		if (tipo === 'p') {
			extra = ''+parseInt(extra);
			if (extra === '1') {
				imagen = '/images/marker_icon_troncal.png';
			} else if (extra === '2') {
				imagen = '/images/marker_icon_pretroncal.png';
			} else {
				imagen = '/images/marker_icon_alimentadora.png';
			}

			var av_image = Titanium.UI.createImageView({
				image : imagen, // the image for the image view
				top : '5 dp',
				left : '10 dp',
				height : '30 dp',
				width : '20 dp',

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
				row.orientacion = 'Sentido: Norte -> Sur';
				adding = 'Norte -> Sur';
			} else {
				row.orientacion = 'Sentido: Sur -> Norte';
				adding = 'Sur -> Norte';
			}

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
			myView.add(rutasquare);
			myView.add(myText);
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
			left:'250dp'
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
