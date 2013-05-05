var MASlidingView = require('lib/MASlidingView');

var SampleView = function(args){
	var view = new MASlidingView({
		backgroundColor:'white'
	});
    
    view.add(Ti.UI.createLabel({
    	text:'Sample View',
    	color:'#000',
    	height:24,
    	width:100,
    	textAlign:'center',
    }));

	return view;
};

module.exports = SampleView;