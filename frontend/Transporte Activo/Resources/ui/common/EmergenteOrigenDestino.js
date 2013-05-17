/**
 * @author Matheo Fiebiger
 */



exports.popup = function(current,id,nombre) {



	var win = Ti.UI.createView({
		left : 20,
		top : 50,
		right : 20,
		bottom: 100,
	});
	
	var shadow = Ti.UI.createView({
		backgroundColor : 'black',
		height:40
	});
	var frmLog = Ti.UI.createView({
	
		backgroundColor : 'white',
		layout : "vertical"
	});

	var txtuser = Ti.UI.createTextField({

		top : 30,
		left : 30,
		right : 30,
		txtID : "txtuser"
	});
	

	var btngroup = Ti.UI.createView({
		layout : "horizontal",
		height: 31,
		top:5,
		bottom:5
	});
	var btnInicio = Ti.UI.createButton({
		title : "Iniciar Aquí",
		left: 30,
		width : 100,
		height: 30
	});

	btnInicio.addEventListener('click', function() {
		current.remove(win);
		current.activePopUp=false;
		current.remove(current.blur);

	});
	var btnFinal = Ti.UI.createButton({
		title : "Llegar Aquí",
		left:10,
		width : 100,
		height: 30
	});
	
	btnFinal.addEventListener('click', function() {
		current.remove(win);
		current.remove(current.blur);

	});
	
	var btnVerMas = Ti.UI.createButton({
		title : "Ver más información",
		left:10,
		right:10,
		height:30
	});

	btnVerMas.addEventListener('click', function() {
		current.remove(win);
		current.remove(current.blur);

	});
	
	var btnExit = Ti.UI.createButton({
		title : "x",
		right:0,
		width : 40,
		height: 40,
		borderColor: null,
		backgroundColor:'gray',
borderRadius:0,
style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	});

	btnExit.addEventListener('click', function() {
		current.remove(win);
		current.remove(current.blur);

	});
	
	var labelTitulo = Ti.UI.createLabel({
  color: '#FFFF',
  text: nombre,
  font : {
			fontWeight : 'bold',
		},
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  width: shadow.width, height: shadow.height
});
	shadow.add(labelTitulo);
	shadow.add(btnExit);
	frmLog.add(shadow);
	btngroup.add(btnInicio);
	btngroup.add(btnFinal);
	frmLog.add(btngroup);
	frmLog.add(btnVerMas);
	win.add(frmLog);
	return win;
}