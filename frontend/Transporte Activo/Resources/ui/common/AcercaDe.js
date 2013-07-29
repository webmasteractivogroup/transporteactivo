function AcercaDe() {

	var win = Ti.UI.createWindow({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : 'white'

	});
	win.orientationModes = [Ti.UI.PORTRAIT];
	var self = Ti.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		showVerticalScrollIndicator : true,
		height : '87%',
		width : '100%',
		top : '0dp'
	});
	var logo = Ti.UI.createView({
		layout : 'horizontal',
		backgroundColor : '#1abbee',
		borderRadius : '5',
		width : Ti.UI.FILL,
		height : '60dp',
		left : '10dp',
		right : '10dp',
		top : '10dp'

	});
	var imagen = Ti.UI.createImageView({
		width : '60dp',
		height : '60dp',
		image : '/images/logo.png'
	});
	var texto = Ti.UI.createLabel({
		text : 'Transporte Activo',
		color : 'white',
		font : {
			fontSize : '27dp',
			fontWeight : 'bold'
		}
	});

	var mensaje = Ti.UI.createLabel({
		text : 'Transporte Activo es una iniciativa de código abierto de la fundación Ciudadanos Activos para la convocatoria Co-Crea Colombia, con el apoyo del Banco Mundial, MetroCali, y la Alcaldía Municipal de Cali.',
		left : '15dp',
		right : '15dp',
		top : '80 dp',
		textAlign : 'center',
		font : {
			fontSize : '16dp'
		},
		color : 'black'
	});

	var responsables = Ti.UI.createLabel({
		text : 'Responsables:',
		left : '15dp',
		right : '15dp',
		top : '220 dp',
		textAlign : 'left',
		font : {
			fontSize : '16dp',
			fontWeight : 'bold'
		},
		color : 'black'
	});

	/// ROW CONTENT 1

	var data = [];
	var row1 = Ti.UI.createTableViewRow({

		url : 'http://www.ciudadanosactivos.com',
	});
	var rowView1 = Ti.UI.createView({
		top : '5dp',
		layout : 'vertical',
		height : Ti.UI.SIZE,
		bottom : '5dp'
	});
	var rowName1 = Ti.UI.createLabel({
		text : 'Bobby Gordon',
		color : 'black',
		font : {
			fontSize : '15dp',
			fontWeight : 'bold'
		}
	});
	var rowRole1 = Ti.UI.createLabel({
		text : 'Fundador Ciudadanos Activos',
		color : 'black',
		font : {
			fontSize : '12dp'
		}
	});
	rowView1.add(rowName1);
	rowView1.add(rowRole1);
	row1.add(rowView1);
	//////////////////// ////////////
	/// ROW CONTENT 2

	var row2 = Ti.UI.createTableViewRow({

		url : 'http://www.danielgarcia.co',
	});

	var rowView2 = Ti.UI.createView({
		top : '5dp',
		layout : 'vertical',
		height : Ti.UI.SIZE,
		bottom : '5dp'
	});
	var rowName2 = Ti.UI.createLabel({
		text : 'Daniel Garcia',
		color : 'black',
		font : {
			fontSize : '15dp',
			fontWeight : 'bold'
		}
	});
	var rowRole2 = Ti.UI.createLabel({
		text : 'Desarrollo Aplicación Web',
		color : 'black',
		font : {
			fontSize : '12dp'
		}
	});
	rowView2.add(rowName2);
	rowView2.add(rowRole2);
	row2.add(rowView2);
	//////////////////// ////////////
	/// ROW CONTENT 3

	var row3 = Ti.UI.createTableViewRow({

		url : 'http://www.guillermoalvarez.co',

	});

	var rowView3 = Ti.UI.createView({
		top : '5dp',
		layout : 'vertical',
		height : Ti.UI.SIZE,
		bottom : '5dp'
	});
	var rowName3 = Ti.UI.createLabel({
		text : 'Guillermo Alvarez',
		color : 'black',
		font : {
			fontSize : '15dp',
			fontWeight : 'bold'
		}
	});
	var rowRole3 = Ti.UI.createLabel({
		text : 'Desarrollo Back-End',
		color : 'black',
		font : {
			fontSize : '12dp'
		}
	});
	rowView3.add(rowName3);
	rowView3.add(rowRole3);
	row3.add(rowView3);
	//////////////////// ////////////
	/// ROW CONTENT 3

	var row4 = Ti.UI.createTableViewRow({

		url : 'http://www.co-mobile.co',

	});

	var rowView4 = Ti.UI.createView({
		top : '5dp',
		layout : 'vertical',
		height : Ti.UI.SIZE,
		bottom : '5dp'
	});
	var rowName4 = Ti.UI.createLabel({
		text : 'Matheo Fiebiger',
		color : 'black',
		font : {
			fontSize : '15dp',
			fontWeight : 'bold'
		}
	});
	var rowRole4 = Ti.UI.createLabel({
		text : 'Desarrollo Aplicación Nativa',
		color : 'black',
		font : {
			fontSize : '12dp'
		}
	});
	rowView4.add(rowName4);
	rowView4.add(rowRole4);
	row4.add(rowView4);
	//////////////////// ////////////

	data[0] = row1;
	data[1] = row2;
	data[2] = row3;
	data[3] = row4;

	var tableResponsables = Ti.UI.createTableView({
		data : data,
		right : '10dp',
		left : '10dp',

		height : Ti.UI.SIZE,
		top : '250dp',
		backgroundColor : '#dddddd',
		separatorColor : 'black',
	});

	tableResponsables.addEventListener('click', function(e) {
		Titanium.Platform.openURL(e.row.url);
	});

	var codigo = Ti.UI.createLabel({
		text : 'Código Fuente:',
		left : '15dp',
		right : '15dp',
		top : '465 dp',
		textAlign : 'left',
		font : {
			fontSize : '16dp',
			fontWeight : 'bold'
		},
		color : 'black'
	});

	var data2 = [];
	var rowGit = Ti.UI.createTableViewRow({

	});
	var rowNameGit = Ti.UI.createLabel({
		text : 'Repositorio en GitHub',
		color : 'black',
		font : {
			fontSize : '15dp',
			fontWeight : 'bold'
		},
		height : '40dp'
	});
	rowGit.add(rowNameGit);

	data2[0] = rowGit;
	var tableCodigo = Ti.UI.createTableView({
		data : data2,
		right : '10dp',
		left : '10dp',
		height : Ti.UI.SIZE,
		top : '490dp',
		backgroundColor : '#dddddd',
		separatorColor : 'black',
	});

	var volver = Ti.UI.createButton({
		title : 'Volver',
		width : Ti.UI.FILL,
		right : '5dp',
		left : '5dp',
		bottom : '5dp',
		height : '10%'
	});

	volver.addEventListener('click', function() {
		win.close();
	});

	tableCodigo.addEventListener('click', function(e) {
		Titanium.Platform.openURL('https://github.com/webmasteractivogroup/transporteactivo');
	});
	logo.add(imagen);
	logo.add(texto);
	self.add(logo);
	self.add(mensaje);
	self.add(responsables);
	self.add(tableResponsables);
	self.add(codigo);
	self.add(tableCodigo);
	win.add(self);
	win.add(volver);
	return win;
}

module.exports = AcercaDe;
