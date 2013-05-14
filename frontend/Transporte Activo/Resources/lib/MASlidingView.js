var MASlidingView;

if (Ti.Android) {
	MASlidingView = function(args) {
		var Draggable = require('ti.draggable');
		
		// override some arguments
		args.minLeft =  args.minLeft || 0;
		args.maxLeft = args.maxLeft || Ti.Platform.displayCaps.platformWidth*0.8;
		args.axis = args.axis || 'x';
		
		var self = new Draggable.createView(args);
		
		return self;
	};
} else {
	MASlidingView = function(args) {
		return Ti.UI.createView(args);
	};
}

module.exports = MASlidingView;