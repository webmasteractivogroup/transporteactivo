var Mapview = require('ui/common/PlanearViaje');
var TwitterFeed = require('ui/common/twitter');

function ApplicationWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	
	
	if(title==='Planear Viaje'){
	var mapview = new Mapview();
	self.add(mapview);
	};
	
	if(title==='Noticias'){
	var noticias = new TwitterFeed();
	self.add(noticias);
	};
	
	return self;
};

module.exports = ApplicationWindow;
