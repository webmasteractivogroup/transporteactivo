function Menu() {
	var self = Ti.UI.createWindow({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : 'white'

	});
	self.orientationModes = [Ti.UI.PORTRAIT];

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
	
	var box = Ti.UI.createView({

		backgroundColor : '#1abbee',
		borderRadius : '5',
		width : Ti.UI.FILL,
		height : '115dp',
		left : '10dp',
		right : '10dp',
		top : '85dp',
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

	logo.add(imagen);
	logo.add(texto);
	
	var mensaje = Ti.UI.createLabel({
		text : 'Somos ciudadanos colaborando para mejorar las ciudades! Colabora tu también',
		left : '15dp',
		right : '15dp',
		top : '220 dp',
		textAlign : 'center',
		font : {
			fontSize : '16dp'
		},
		color : 'black'
	});


	var volver = Ti.UI.createButton({
		title : 'Volver',
		width : Ti.UI.FILL,
		right : '5dp',
		left : '5dp',
		bottom : '5dp'
	});

	volver.addEventListener('click', function() {
		self.close();
	});

	var tutorial_button = Ti.UI.createButton({
		title : 'Tutorial',
		width : Ti.UI.FILL,
		right : '15dp',
		left : '15dp',
		top : '60dp',
	});

	tutorial_button.addEventListener('click', function() {

		////  EVENTO TUTORIAL

	});

	var acerca_nos_button = Ti.UI.createButton({
		title : 'Acerca de',
		width : Ti.UI.FILL,
		right : '15dp',
		left : '15dp',
		top : '10dp'
	});
acerca_nos_button.addEventListener('click', function() {
		var AcercaDeWindow = require('ui/common/AcercaDe');
		var wtbo = new AcercaDeWindow();
		wtbo.open();
	});
	
	
var texto2 = Ti.UI.createLabel({
		text : 'Una iniciativa de',
		left:'10dp',
		color : 'black',
		textAlign : 'left',
		font : {
			fontSize : '16dp',
			fontWeight : 'bold'
		},
		top:'290 dp'
	});	
	

	
  var box2 = Ti.UI.createView({

		backgroundColor : '#1abbee',
		borderRadius : '5',
		width : Ti.UI.FILL,
		height : '40dp',
		left : '10dp',
		right : '10dp',
		top : '310dp',
	});

	var ciuds = Ti.UI.createImageView({
		width :Ti.UI.FILL,
		height : '30dp',
		left:'10dp',
		right:'10dp',
		image : '/images/logo-ciudadanos.png'
	});
	box2.addEventListener('click', function() {

	    
		Titanium.Platform.openURL('http://www.ciudadanosactivos.com'); 

	});
	box2.add(ciuds);
	
	self.add(box);
	self.add(mensaje);
	self.add(texto2);
	self.add(box2);
	box.add(tutorial_button);
	box.add(acerca_nos_button);
	

	self.add(logo);
	self.add(volver);
	return self;
}

module.exports = Menu;
