var MASlidingView = require('lib/MASlidingView');

var HomeView = function(args){
    var self = new MASlidingView({
        backgroundColor:'white'
    });
    
    self.add(Ti.UI.createLabel({
    	text:'Home View',
    	color:'#000',
    	height:24,
    	width:100,
    	textAlign:'center',
    }));

    return self;
};

module.exports = HomeView;