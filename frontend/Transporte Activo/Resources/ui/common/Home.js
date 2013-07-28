function Home() {

	var self = Ti.UI.createWindow({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : '#1abbee',

	});

	var logo = Ti.UI.createImageView({
		right : '5dp',
		left : '5dp',
		top : '-40 dp',
		image : '/images/logo_grande.png',

	});

	var mensaje = Ti.UI.createLabel({
		text : 'Información y participación ciudadana para el sistema de transporte Masivo Integrado de Occidente, MIO de la ciudad de Santiago de Cali.',
		left : '10dp',
		right : '10dp',
		top : '140 dp',
		textAlign : 'center',
		font : {
			fontSize : '18dp'
		},
		color : 'white'
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
		bottom : '105dp'
	});

	tutorial_button.addEventListener('click', function() {

		////  EVENTO TUTORIAL

	});

	var acerca_nos_button = Ti.UI.createButton({
		title : 'Acerca de',
		width : Ti.UI.FILL,
		right : '5dp',
		left : '5dp',
		bottom : '55dp'
	});

	acerca_nos_button.addEventListener('click', function() {
		// EVENTO ACERCA DE
	});
	self.add(tutorial_button);
	self.add(acerca_nos_button);
	self.add(logo);
	self.add(mensaje);
	self.add(sig_button);

	return self;

}

module.exports = Home;
