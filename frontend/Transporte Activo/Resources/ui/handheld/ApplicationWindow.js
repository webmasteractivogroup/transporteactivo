var Mapview = require('ui/common/PlanearViaje');


function ApplicationWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	
	if(title==='Planear Viaje'){
	var mapview = new Mapview();
	self.add(mapview);
	};
	
	return self;
};

module.exports = ApplicationWindow;
