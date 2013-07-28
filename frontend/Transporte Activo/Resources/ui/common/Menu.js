function Menu() {
	var self = Ti.UI.createWindow({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : 'white'

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
	var box = Ti.UI.createView({

		backgroundColor : '#1abbee',
		borderRadius : '5',
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		left : '10dp',
		right : '10dp',
		top : '85dp',
		bottom : '60dp'
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
		text : 'Somos ciudadanos colaborando para mejorar las ciudades! Colabora tu tambien',
		left : '15dp',
		right : '15dp',
		top : '200 dp',
		textAlign : 'center',
		font : {
			fontSize : '18dp'
		},
		color : 'white'
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
		top : '140dp'
	});

	tutorial_button.addEventListener('click', function() {

		////  EVENTO TUTORIAL

	});

	var acerca_nos_button = Ti.UI.createButton({
		title : 'Acerca de',
		width : Ti.UI.FILL,
		right : '15dp',
		left : '15dp',
		top : '90dp'
	});

	acerca_nos_button.addEventListener('click', function() {
		// EVENTO ACERCA DE
	});
	self.add(box);
	self.add(mensaje);
	self.add(tutorial_button);
	self.add(acerca_nos_button);

	self.add(logo);
	self.add(volver);
	return self;
}

module.exports = Menu;
