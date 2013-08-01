var texto;
var rowData = [];

function RetroAlim(id, tipo, model) {
	var rowData = [];

	var self = Ti.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		top : 0,
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : true,
		layout : 'vertical'
	});

	var comments = Ti.UI.createView({
		layout : 'vertical',
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		bottom : '15%'

	});

	var tableView = Ti.UI.createTableView({});

	comments.add(tableView);

	var reporta = Ti.UI.createView({
		layout : 'horizontal',
		top : '-15%',
		width : Ti.UI.FILL,
		height : "15%",
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
		width : "55%",
		height : '100%',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		color : '#336699',
		borderWidth : 2,
		borderColor : '#bbb',
		borderRadius : 5,
		top : '0dp'
	});

	var send = Ti.UI.createButton({
		title : 'Envíar',
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
	});

	send.addEventListener('click', function() {

		var params = {
			model : model,
			object_id : id,
			tipo : tipo,
			comentario : texto.value
		};
		var url = "http://transporteactivo.com/api/v1/calificar/";
		Ti.API.log('REQUEST: ' + url);
		var xhr = Ti.Network.createHTTPClient({
			onload : function() {
				Ti.API.log("STATUS: " + this.status);
				Ti.API.log('RESPUESTA: ' + this.responseText);

				var row = Ti.UI.createTableViewRow({
					height : Ti.UI.SIZE,
					width : Ti.UI.FILL,

				});

				var container = Ti.UI.createView({
					width : 'auto',
					height : Ti.UI.SIZE,
					top : '5dp',
					bottom : '5dp',
					layout : 'horizontal'

				});
				var imagenView = Ti.UI.createImageView({
					left : '5dp',
					height : '60dp',
					width : '60dp',
					image : imagen.image
				})
				if (Ti.Platform.osname === 'android') {
					var labelComment = Ti.UI.createLabel({

						color : 'black',
						left : '10dp',
						right : '5dp',
						height : Ti.UI.SIZE,
						width : '70%',
						text : texto.value,
						font : {
							fontSize : '14dp'
						}
					});
				} else {
					var labelComment = Ti.UI.createLabel({

						color : 'black',
						left : '10dp',
						right : '5dp',
						height : Ti.UI.SIZE,
						width : Ti.UI.FILL,
						text : texto.value,
						font : {
							fontSize : '14dp'
						}
					});
				}

				container.add(imagenView);
				container.add(labelComment);
				row.add(container);

				rowData[rowData.length] = row;
				tableView.data = rowData;

				texto.value = '';

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

		xhr.open("POST", url);
		xhr.send(params);
		Ti.API.log('reporte request enviado');
	});

	var json, com, i;
	var url = "http://transporteactivo.com/api/v1/calificar/?id=" + id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {

			Ti.API.log('RESPUESTA: ' + this.responseText);

			json = JSON.parse(this.responseText);
			for ( i = 0; i < json.length; i++) {
				com = json[i];

				var color;
				if (com.tipo === 'positivo') {
					color = '/images/carita_verde.png';
				} else if (com.tipo === 'comentario') {
					color = '/images/carita_amarilla.png';
				} else {
					color = '/images/carita_roja.png';
				}

				var row = Ti.UI.createTableViewRow({
					height : Ti.UI.SIZE,
					width : Ti.UI.FILL,
				});

				var container = Ti.UI.createView({
					width : 'auto',
					height : Ti.UI.SIZE,
					top : '5dp',
					bottom : '5dp',
					layout : 'horizontal'

				});
				var imagenView = Ti.UI.createImageView({
					left : '5dp',

					height : '60dp',
					width : '60dp',
					image : color
				});
				if (Ti.Platform.osname === 'android') {
					var labelComment = Ti.UI.createLabel({

						color : 'black',
						left : '10dp',
						right : '5dp',
						height : Ti.UI.SIZE,
						width : '70%',
						text : com.comentario,
						font : {
							fontSize : '14dp'
						}
					});
				} else {
					var labelComment = Ti.UI.createLabel({

						color : 'black',
						left : '10dp',
						right : '5dp',
						height : Ti.UI.SIZE,
						width : Ti.UI.FILL,
						text : com.comentario,
						font : {
							fontSize : '14dp'
						}
					});
				}

				container.add(imagenView);
				container.add(labelComment);
				row.add(container);
				rowData[i] = row;

			}
			tableView.data = rowData;

		},
		onerror : function(e) {
			Ti.API.log("STATUS: " + this.status);
			Ti.API.log("TEXT:   " + this.responseText);
			Ti.API.log("ERROR:  " + e.error);
			alert('No se pudo contactar al servidor, intentelo de nuevo');
		},
		timeout : 5000
	});

	xhr.open("GET", url);
	xhr.send();

	reporta.add(imagen);
	reporta.add(texto);
	reporta.add(send);

	if (tipo != 0) {
		self.add(comments);
		self.add(reporta);

	} else {
		comments.bottom = 0;
		self.add(comments);
	}

	return self;
}

module.exports = RetroAlim;
