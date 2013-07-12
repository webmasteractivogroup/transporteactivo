var TwitterFeed = require('ui/common/twitter');
var Search = require('ui/common/Search');

function ApplicationWindow(title) {
	var self = Ti.UI.createWindow({
		title : title,
		backgroundColor : 'white'
	});

	if (title === 'Mapa') {
		if (Ti.Platform.osname === 'android') {
			var MapModule = require('ti.map');
			var rc = MapModule.isGooglePlayServicesAvailable()
			switch (rc) {
				case MapModule.SUCCESS:
					Ti.API.info('Google Play services is installed.');
					var Mapview = require('ui/common/PlanearViaje');
					var mapview = new Mapview();
					self.add(mapview);
					break;
				case MapModule.SERVICE_MISSING:
					alert('Google Play services no está instalado. Por favor instale Google Play services de la Google Play store.');
					break;
				case MapModule.SERVICE_VERSION_UPDATE_REQUIRED:
					alert('Google Play services está desactualizado. Por Favor actualice Google Play services.');
					break;
				case MapModule.SERVICE_DISABLED:
					alert('Google Play services está desactivado. Por favor active Google Play services.');
					break;
				case MapModule.SERVICE_INVALID:
					alert('Google Play services no se puede autenticar. Por favor reinstale Google Play services.');
					break;
				default:

					break;
			}
		}else{
			var Mapview = require('ui/common/PlanearViaje');
					var mapview = new Mapview();
					self.add(mapview);
			
		}
		
	};

	if (title === 'Noticias') {
		var noticias = new TwitterFeed();
		self.add(noticias);
	};

	if (title === 'Buscar') {
		var buscar = new Search();
		self.add(buscar);
	};

	return self;
};

module.exports = ApplicationWindow;
