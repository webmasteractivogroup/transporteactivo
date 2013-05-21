/**
 * @author Matheo Fiebiger
 */

exports.popup = function(current, id, nombre) {

	var win = Ti.UI.createView({
		left : 20,
		top : 50,
		right : 20,
		bottom : 100,
		height : Ti.UI.SIZE
	});

	var shadow = Ti.UI.createView({
		backgroundColor : 'black',
		height : 40
	});
	var frmLog = Ti.UI.createView({

		backgroundColor : 'white',
		layout : "vertical",
		height : Ti.UI.SIZE
	});

	var txtuser = Ti.UI.createTextField({

		top : 30,
		left : 30,
		right : 30,
		txtID : "txtuser"
	});

	var btngroup = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : "100%",
		top : 5,
		bottom : 5,
	});
	var btnInicio = Ti.UI.createButton({
		title : "Iniciar Aquí",
		width : "45%",
		height : 40,
		left : 10

	});

	btnInicio.addEventListener('click', function() {
		current.remove(win);
		current.activePopUp = false;
		current.remove(current.blur);

	});
	var btnFinal = Ti.UI.createButton({
		title : "Llegar Aquí",
		width : "45%",
		height : 40,
		right : 10
	});

	btnFinal.addEventListener('click', function() {
		current.remove(win);
		current.remove(current.blur);

	});

	var btnVerMas = Ti.UI.createButton({
		title : "Ver más información",
		left : 10,
		right : 10,
		height : 40,
		bottom : 15,
		top : 5
	});

	btnVerMas.addEventListener('click', function() {
		current.remove(win);
		current.remove(current.blur);

	});

	var btnExit = Ti.UI.createButton({
		title : "x",
		right : 0,
		width : "15%",
		height : 40,
		borderColor : null,
		backgroundColor : 'gray',
		borderRadius : 0,
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	});

	btnExit.addEventListener('click', function() {
		current.remove(win);
		current.remove(current.blur);

	});

	var labelTitulo = Ti.UI.createLabel({
		color : '#FFFF',
		text : nombre,
		font : {
			fontWeight : 'bold',
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		width : "100%",
		height : shadow.height,
		left:0
	});
	var labelRutas = Ti.UI.createLabel({
		color : 'black',
		text : 'Rutas',
		font : {
			fontWeight : 'bold',
			fontSize : 18,
		},
		width : Ti.UI.SIZE,
		left : 10,
		top : 3
	});

	var rutasgroup = Ti.UI.createView({
		layout : 'horizontal',
		left : 10,
		right : 10,
		height : Ti.UI.SIZE,
		top : 10,
		bottom : 10
	});

	var json, ruta, i;

	var url = "http://transporteactivo.com/api/v1/rutas-por-parada/?parada_id=" + id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {

			Ti.API.log('RESPUESTA: ' + this.responseText);

			json = JSON.parse(this.responseText);
			Ti.API.log('RUTAS: ' + json.length);
			for ( i = 0; i < json.length; i++) {
				ruta = json[i];
				var color;
				if (ruta.nombre_ruta.charAt(0) === 'A') {
					color = '#bbbb00';
				} else if (ruta.nombre_ruta.charAt(0) === 'P') {
					color = '#e4004f';
				} else {
					color = '#2e2482';
				}

				var rutasquare = Ti.UI.createLabel({
					color : 'white',
					width : 50,
					height : 22,
					right : 1,
					bottom : 1,
					backgroundColor : color,
					text : ruta.nombre_ruta,
					font : {
						fontSize : 12,
						fontWeight : 'bold'
					},
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				});
				rutasgroup.add(rutasquare);
			}

		},
		onerror : function(e) {
			Ti.API.log("STATUS: " + this.status);
			Ti.API.log("TEXT:   " + this.responseText);
			Ti.API.log("ERROR:  " + e.error);
			alert('No se pudo contactar al servidor, intentelo de nuevo');
		},
		timeout : 5000
	});

	Ti.API.log('Rutas por parada');

	xhr.open("GET", url);
	xhr.send();
	Ti.API.log('Rutas por parada request enviado');

	
	shadow.add(labelTitulo);
	shadow.add(btnExit);
	frmLog.add(shadow);
	frmLog.add(labelRutas);
	frmLog.add(rutasgroup);
	btngroup.add(btnInicio);
	btngroup.add(btnFinal);
	frmLog.add(btngroup);
	frmLog.add(btnVerMas);
	win.add(frmLog);
	return win;
}