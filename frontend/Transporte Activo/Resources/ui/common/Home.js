function Home() {

	var self = Ti.UI.createWindow({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : '#1abbee',
	

	});
	self.orientationModes = [Ti.UI.PORTRAIT];

	var logo = Ti.UI.createImageView({
		right : '5dp',
		left : '5dp',
		height : '40%',
		top : '-13%',
		image : '/images/logo_grande.png',

	});

	var scroll = Ti.UI.createScrollView({
		left:'5dp',
		right:'5dp',
		contentWidth : 'auto',
		contentHeight : 'auto',
		showVerticalScrollIndicator : true,
		height : '58%',
		width : Ti.UI.FILL,
		top : '20%',
		backgroundColor : 'white',
		borderRadius:'4'
	});

	if (Ti.Platform.osname === 'android') {
		if (Titanium.Platform.displayCaps.platformHeight > 800) {
			scroll.contentHeight= Titanium.Platform.displayCaps.platformHeight+100;
		} else {
			scroll.contentHeight = Titanium.Platform.displayCaps.platformHeight + Titanium.Platform.displayCaps.platformHeight * 0.7;
		};

	};

	var mensaje = Ti.UI.createLabel({
		text : 'Información y participación ciudadana para el sistema de transporte Masivo Integrado de Occidente, MIO de la ciudad de Santiago de Cali.',
		left : '10dp',
		right : '10dp',
		top : '5dp',
		textAlign : 'center',
		font : {
			fontSize : '14sp'
		},
		color : 'black',
		height : '70dp'
	});

	var convenciones = Ti.UI.createLabel({
		text : 'Convenciones',
		left : '10dp',
		right : '10dp',
		top : '90dp',
		textAlign : 'left',
		font : {
			fontSize : '18sp',
			fontWeight : 'bold'
		},
		color : 'black'
	});

	var tipos_de_bus = Ti.UI.createLabel({
		text : 'Tipos de bus',
		left : '10dp',
		right : '10dp',
		top : '130dp',
		textAlign : 'left',
		font : {
			fontSize : '15sp',
			fontWeight : 'bold'
		},
		color : 'black',
		height : '20dp'
	});

	/// ROW CONTENT 1

	var data = [];
	var row1 = Ti.UI.createTableViewRow({
	});
	var rowView1 = Ti.UI.createView({
		top : '5dp',
		layout : 'vertical',
		height : Ti.UI.SIZE,
		bottom : '5dp'
	});

	var imagenIzq1 = Ti.UI.createImageView({
		image : '/images/bus_articulado.png',
		top : '5dp',
		left : '5dp',
		width : '90dp',
		height : '35dp'

	});

	var rowName1 = Ti.UI.createLabel({
		text : 'Articulado',
		color : 'black',
		top : '5dp',
		font : {
			fontSize : '15dp',
			fontWeight : 'bold'
		},
		left : '10dp',
		width : '50%',
		height : '20dp'
	});
	var rowRole1 = Ti.UI.createLabel({
		text : 'Buses con rutas expresas (E) y troncales (T).Se detienen únicamente en estaciones.',
		color : 'black',
		font : {
			fontSize : '12dp'
		},
		top : '-55dp',
		left : '35%',
		width : '60%',
		height : '50dp'

	});

	rowView1.add(rowName1);
	rowView1.add(imagenIzq1);
	rowView1.add(rowRole1);
	row1.add(rowView1);
	//////////////////// ////////////
	var row2 = Ti.UI.createTableViewRow({
	});
	var rowView2 = Ti.UI.createView({
		top : '5dp',
		layout : 'vertical',
		height : Ti.UI.SIZE,
		bottom : '5dp'
	});

	var imagenIzq2 = Ti.UI.createImageView({
		image : '/images/bus_padron.png',
		top : '5dp',
		left : '5dp',
		width : '90dp',
		height : '35dp'

	});

	var rowName2 = Ti.UI.createLabel({
		text : 'Padrón',
		color : 'black',
		top : '5dp',
		font : {
			fontSize : '15dp',
			fontWeight : 'bold'
		},
		left : '10dp',
		width : '50%',
		height : '20dp'
	});
	var rowRole2 = Ti.UI.createLabel({
		text : 'Buses con rutas padronas (P).Se detienen en estaciones y paradas de calle.',
		color : 'black',
		font : {
			fontSize : '12dp'
		},
		top : '-55dp',
		left : '35%',
		width : '60%',
		height : '50dp'

	});

	rowView2.add(rowName2);
	rowView2.add(imagenIzq2);
	rowView2.add(rowRole2);
	row2.add(rowView2);
	//////////////////// ////////////

	var row3 = Ti.UI.createTableViewRow({
	});
	var rowView3 = Ti.UI.createView({
		top : '5dp',
		layout : 'vertical',
		height : Ti.UI.SIZE,
		bottom : '5dp'
	});

	var imagenIzq3 = Ti.UI.createImageView({
		image : '/images/bus_alimentador.png',
		top : '5dp',
		left : '5dp',
		width : '90dp',
		height : '35dp'

	});

	var rowName3 = Ti.UI.createLabel({
		text : 'Alimentador',
		color : 'black',
		top : '5dp',
		font : {
			fontSize : '15dp',
			fontWeight : 'bold'
		},
		left : '10dp',
		width : '50%',
		height : '20dp',
		height : '20dp'
	});
	var rowRole3 = Ti.UI.createLabel({
		text : 'Buses con rutas auxiliares (A).Se detienen únicamente en paradas de calle.',
		color : 'black',
		font : {
			fontSize : '13dp'
		},
		top : '-55dp',
		left : '35%',
		width : '60%',
		height : '50dp'

	});

	rowView3.add(rowName3);
	rowView3.add(imagenIzq3);
	rowView3.add(rowRole3);
	row3.add(rowView3);
	//////////////////// ////////////
	data[0] = row1;
	data[1] = row2;
	data[2] = row3;

	var tableRutas = Ti.UI.createTableView({
		data : data,
		right : '10dp',
		left : '10dp',
		height : Ti.UI.SIZE,
		top : '160dp',
		backgroundColor : '#dddddd',
		separatorColor : 'black',
	});

	//////// DATA PARADAS

	var data1 = [];
	var roww1 = Ti.UI.createTableViewRow({
	});
	var rowVieww1 = Ti.UI.createView({
		top : '5dp',
		layout : 'vertical',
		height : Ti.UI.SIZE,
		bottom : '5dp'
	});

	var imagenIzqq1 = Ti.UI.createImageView({
		image : '/images/marker_icon_troncal@2x.png',
		top : '5dp',
		left : '25dp',
		width : '40dp',
		height : '40dp'

	});

	var rowNamee1 = Ti.UI.createLabel({
		text : 'Troncal',
		color : 'black',
		top : '5dp',
		font : {
			fontSize : '14dp',
			fontWeight : 'bold'
		},
		left : '10dp',
		width : '55%',
		height : '20dp'
	});
	var rowRolee1 = Ti.UI.createLabel({
		text : 'Estaciones donde se detienen buses articulados y padrones',
		color : 'black',
		font : {
			fontSize : '12dp'
		},
		top : '-55dp',
		left : '35%',
		width : '50%',
		height : '50dp'
	});

	rowVieww1.add(rowNamee1);
	rowVieww1.add(imagenIzqq1);
	rowVieww1.add(rowRolee1);
	roww1.add(rowVieww1);
	//////////////////// ////////////
	var roww2 = Ti.UI.createTableViewRow({
	});
	var rowVieww2 = Ti.UI.createView({
		top : '5dp',
		layout : 'vertical',
		height : Ti.UI.SIZE,
		bottom : '5dp'
	});

	var imagenIzqq2 = Ti.UI.createImageView({
		image : '/images/marker_icon_pretroncal@2x.png',
		top : '5dp',
		left : '25dp',
		width : '40dp',
		height : '40dp'

	});

	var rowNamee2 = Ti.UI.createLabel({
		text : 'Pretroncal',
		color : 'black',
		top : '5dp',
		font : {
			fontSize : '14dp',
			fontWeight : 'bold'
		},
		left : '10dp',
		width : '55%',
		height : '20dp'

	});
	var rowRolee2 = Ti.UI.createLabel({
		text : 'Paradas de calle donde se detienen buses padrones y alimentadores.',
		color : 'black',
		font : {
			fontSize : '12dp'
		},
		top : '-55dp',
		left : '35%',
		width : '50%',
		height : '50dp'

	});

	rowVieww2.add(rowNamee2);
	rowVieww2.add(imagenIzqq2);
	rowVieww2.add(rowRolee2);
	roww2.add(rowVieww2);
	//////////////////// ////////////

	var roww3 = Ti.UI.createTableViewRow({
	});
	var rowVieww3 = Ti.UI.createView({
		top : '5dp',
		layout : 'vertical',
		height : Ti.UI.SIZE,
		bottom : '5dp'
	});

	var imagenIzqq3 = Ti.UI.createImageView({
		image : '/images/marker_icon_alimentadora@2x.png',
		top : '5dp',
		left : '25dp',
		width : '40dp',
		height : '40dp'

	});

	var rowNamee3 = Ti.UI.createLabel({
		text : 'Alimentadora',
		color : 'black',
		top : '5dp',
		font : {
			fontSize : '14dp',
			fontWeight : 'bold'
		},
		left : '10dp',
		width : '55%',
		height : '20dp'
	});
	var rowRolee3 = Ti.UI.createLabel({
		text : 'Paradas de calle donde se detienen únicamente buses alimentadores.',
		color : 'black',
		font : {
			fontSize : '12dp'
		},
		top : '-55dp',
		left : '35%',
		width : '50%',
		height : '50dp'

	});

	rowVieww3.add(rowNamee3);
	rowVieww3.add(imagenIzqq3);
	rowVieww3.add(rowRolee3);
	roww3.add(rowVieww3);
	//////////////////// ////////////
	data1[0] = roww1;
	data1[1] = roww2;
	data1[2] = roww3;

	var tipos_de_paradas = Ti.UI.createLabel({
		text : 'Tipos de paradas',
		left : '10dp',
		right : '10dp',
		top : '400dp',
		textAlign : 'left',
		font : {
			fontSize : '15sp',
			fontWeight : 'bold'
		},
		color : 'black',
		height : '20dp'
	});

	var tableParadas = Ti.UI.createTableView({
		data : data1,
		right : '10dp',
		left : '10dp',
		height : Ti.UI.SIZE,
		top : '430dp',
		backgroundColor : '#dddddd',
		separatorColor : 'black',
	});

	var sig_button = Ti.UI.createButton({
		title : 'Continuar',
		width : Ti.UI.FILL,
		right : '5dp',
		left : '5dp',
		bottom : '5dp'
	});

	sig_button.addEventListener('click', function() {
		var Window = require('ui/handheld/ApplicationWindow');
		var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
		var tabGroup = new ApplicationTabGroup(Window);
		if (Ti.Platform.osname === 'android') {
			tabGroup.addEventListener("open", function(e) {
				var activity = tabGroup.getActivity();
				activity.onCreateOptionsMenu = function(e) {
					var menuItem = e.menu.add({
						title : "Menú",
						showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
						//icon : "add_icon.png"
					});
					menuItem.addEventListener("click", function(e) {
						//
						var MenuWindow = require('ui/common/Menu');
						var wtbo = new MenuWindow();
						wtbo.open();
					});

				}
				activity.invalidateOptionsMenu();
			});
		}
		tabGroup.open();

	});

	var tutorial_button = Ti.UI.createButton({
		title : 'Tutorial',
		width : Ti.UI.FILL,
		right : '5dp',
		left : '5dp',
		bottom : '55dp'
	});

	tutorial_button.addEventListener('click', function() {

		////  EVENTO TUTORIAL

	});

	/*var acerca_nos_button = Ti.UI.createButton({
	 title : 'Acerca de',
	 width : Ti.UI.FILL,
	 right : '5dp',
	 left : '5dp',
	 bottom : '105dp'
	 });

	 acerca_nos_button.addEventListener('click', function() {
	 // EVENTO ACERCA DE
	 var AcercaDeWindow = require('ui/common/AcercaDe');
	 var wtbo = new AcercaDeWindow();
	 wtbo.open();
	 });

	 */
	self.add(tutorial_button);
	//self.add(acerca_nos_button);
	self.add(logo);
	scroll.add(mensaje);
	scroll.add(convenciones);
	scroll.add(tipos_de_bus);
	scroll.add(tableRutas);
	scroll.add(tipos_de_paradas);
	scroll.add(tableParadas);
	self.add(scroll);
	self.add(sig_button);

	return self;

}

module.exports = Home;
