
var MASlidingView = require('lib/MASlidingView');


var HomeView = function(args){
    var self = new MASlidingView({
        backgroundColor:'white'
    });
    
   var toolBarView = Titanium.UI.createView({
    top:0,
    height:'43',
    width: Ti.UI.FILL,
    backgroundImage:'/images/bar_bg.png'
});
    
    var menuButton = Ti.UI.createButton({
    backgroundImage:'/images/menu.png',   
    top:'10',
    left:'10',
    height: '20',
    width:'20'
});

	
	  menuButton.addEventListener('click', function(e) {
		 slidingMenu.forceViewChange();
		
	});
	
	
	self.add(toolBarView);
	toolBarView.add(menuButton);
	

    return self;
};

module.exports = HomeView;