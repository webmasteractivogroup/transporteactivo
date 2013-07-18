var texto;
var rowData = [];

function RetroAlim(id, tipo, model) {

	var self = Ti.UI.createView({
		layout : 'vertical',
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		top : 0

	});
	var comments = Ti.UI.createView({
		layout : 'vertical',
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,

	});

	var tableView = Ti.UI.createTableView({});

	comments.add(tableView);

	var reporta = Ti.UI.createView({
		layout : 'horizontal',
		top:'-70 dp',
		width : Ti.UI.FILL,
		height : "70dp",
		backgroundColor : 'gray'

	});

	var imagen = Ti.UI.createImageView({
		width : "20%",
		height : Ti.UI.FILL
	});

	if (tipo === 'a') {
		imagen.image = '/images/carita_verde.png';
	} else if (tipo === 'n') {
		imagen.image = '/images/carita_amarilla.png';
	} else {
		imagen.image = '/images/carita_roja.png';
	}

	texto = Ti.UI.createTextArea({
		width : "60%",
		height : '70dp',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		color : '#336699',
		borderWidth : 2,
		borderColor : '#bbb',
		borderRadius : 5,
	});

	var send = Ti.UI.createButton({
		title : 'Envíar',
		width : "20%"
	});

	send.addEventListener('click', function() {
		var url = "http://transporteactivo.com/api/v1/calificar/?model=" + model + "&object_id=" + id + "&tipo=" + tipo + "&comentario=" + texto.value;
		Ti.API.log('REQUEST: ' + url);
		var xhr = Ti.Network.createHTTPClient({
			onload : function() {
				Ti.API.log("STATUS: " + this.status);
				Ti.API.log('RESPUESTA: ' + this.responseText);

				var row = Ti.UI.createTableViewRow({
					height : Ti.UI.SIZE,
					width : Ti.UI.FILL,
					layout : 'horizontal'
				});

				var imagenView = Ti.UI.createImageView({
					left : '5dp',
					top : '5dp',
					bottom: '5dp',
					height : '60dp',
					width : '60dp',
					image : imagen.image
				})

				var labelComment = Ti.UI.createLabel({
					top:'10dp',
					color:'black',
					bottom:'10dp',
					left : '10dp',
					height : Ti.UI.SIZE,
					width : Ti.UI.FILL,
					text : texto.value,
					font:{
						fontSize:'14dp'
					}

				});

				row.add(imagenView);
				row.add(labelComment);

				rowData[rowData.length] = row;
				tableView.data = rowData;
				
				texto.value ='';

				alert("Reporte agregado!");
			},
			onerror : function(e) {
				Ti.API.log("STATUS: " + this.status);
				Ti.API.log("TEXT:   " + this.responseText);
				Ti.API.log("ERROR:  " + e.error);
				alert('No se pudo contactar al servidor, intentelo de nuevo');
			},
			timeout : 5000
		});

		Ti.API.log('Eviando reporte');

		xhr.open("GET", url);
		xhr.send();
		Ti.API.log('reporte request enviado');
	});

	var oldTop = -70;
	var newTop = -70 - 170;

	if (Ti.Platform.osname != 'android') {
		// SLIDE SCREEN UP WHEN ENTERING TITLE
		texto.addEventListener('focus', function() {
			reporta.top = newTop;
		});

		// SLIDE SCREEN BACK TO ORIGINAL POSITION
		texto.addEventListener('blur', function() {
			reporta.top = oldTop;
		});
	}

	reporta.add(imagen);
	reporta.add(texto);
	reporta.add(send);

	self.add(comments);
	self.add(reporta);
	return self;
}

module.exports = RetroAlim;
