var data = [];
var activeRequest = false;
var tableview;
var times = 0;

function Search() {

	var tblsearch = Ti.UI.createSearchBar({
		hintText : 'Buscar ruta, estación o parada...',
		barColor : 'black'
	});

	tblsearch.addEventListener('change', function(e) {

		if (e.value != "" && times === 0) {
			times = 1;
			consulta(tblsearch.value);

		}
		if (e.value === "") {
			times = 0;

		}

	});
	
	tblsearch.addEventListener('cancel', function(e) {
		
		tblsearch.value="";
		data=[];
		tableview.data=data;
		times=0;
		

	});

if (Ti.Platform.osname === 'android') {
	tableview = Ti.UI.createTableView({
		search : tblsearch,
		filterAttribute : 'title'
	});
}else{
	tableview = Ti.UI.createTableView({
		search : tblsearch,
		filterAttribute : 'nombre'
	});
	
}
	
	tableview.addEventListener('click', function(e) {
		
		tblsearch.value="";
		data=[];
		tableview.data=data;
		times=0;
		

	});

	return tableview;
}

function consulta(q) {

	var url = "http://transporteactivo.com/api/v1/buscar/?q=" + q;
	Ti.API.log('URL: ' + url);
	var json, result, i;

	var xhr = Ti.Network.createHTTPClient({
		onload : function() {

			Ti.API.log('RESPUESTA: ' + this.responseText);

			json = JSON.parse(this.responseText);
			for ( i = 0; i < json.length; i++) {
				result = json[i];
				var imagen;

				var myView = Ti.UI.createView({
					layout : 'horizontal'
				});

				if (result.tipo === 'p') {
					if (result.extra === '1') {
						imagen = '/images/marker_icon_troncal.png';
					} else if (result.extra === '2') {
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
						text : result.nombre,
						top : '10dp',
						left : '5 dp',
						width : Ti.UI.SIZE,
						height : 'auto',
						textAlign : 'left',
						font : {
							fontSize : '14 dp'
						}
					});
					myView.add(av_image);
					myView.add(myText);
				} else {
					//box de ruta//
					var color;
					if (result.nombre.charAt(0) === 'A') {
						color = '#bbbb00';
					} else if (result.nombre.charAt(0) === 'P') {
						color = '#e4004f';
					} else {
						color = '#2e2482';
					}

					var rutasquare = Ti.UI.createLabel({
						color : 'white',
						width : '50 dp',
						height : '22 dp',
						top: '10 dp',
						left: '10 dp',
						backgroundColor : color,
						text : result.nombre,
						font : {
							fontSize : '12 dp',
							fontWeight : 'bold'
						},
						textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					});

					var myText = Ti.UI.createLabel({
						text : result.extra,
						top : '10dp',
						left : '10 dp',
						width : Ti.UI.SIZE,
						height : 'auto',
						textAlign : 'left',
						font : {
							fontSize : '14 dp'
						}
					});
					myView.add(rutasquare);
					myView.add(myText);
				}

				var row = Ti.UI.createTableViewRow({
					height : '40 dp',
				});

				if (Ti.Platform.osname === 'android') {
					row.title = result.nombre;}else{
						row.nombre = result.nombre
					}
				row.add(myView);
				row.classname = "item";
				data[i] = row;
			}
			tableview.data = data;
			activeRequest = false;
		},
		onerror : function(e) {
			Ti.API.log("STATUS: " + this.status);
			Ti.API.log("TEXT:   " + this.responseText);
			Ti.API.log("ERROR:  " + e.error);
			alert('No se pudo contactar al servidor, intentelo de nuevo');
			activeRequest = false;
		},
		timeout : 5000
	});

	if (activeRequest === false) {
		Ti.API.log('Search request va a abrir');
		activeRequest = true;
		xhr.open("GET", url);
		xhr.send();
		Ti.API.log('Search request enviado');
	}

}

module.exports = Search;
