function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup({navBarHidden:true,barColor: '#0000'});
	Ti.App.tabgroup = self;
	
	
	//create app tabs
	var win1 = new Window('Mapa'),
		win2 = new Window('Buscar'), 
		win3 = new Window('Favoritos'),
		win4 = new Window('Noticias');
		
		
	
	var tab1 = Ti.UI.createTab({
		title: 'Mapa',
		icon: '/images/map.png',
		window: win1
	});
	
	
	var tab2 = Ti.UI.createTab({
		title: 'Buscar',
		icon: '/images/search.png',
		window: win2
	});
	
	Ti.App.tabPerfiles = tab2;
	
	var tab3 = Ti.UI.createTab({
		title: 'Favoritos',
		icon: '/images/favoritos.png',
		window: win3
	});
	
	
	var tab4 = Ti.UI.createTab({
		title: 'Noticias',
		icon: '/images/news.png',
		window: win4
	});
	
	win1.containingTab = tab1;
	win2.containingTab = tab2;
	win3.containingTab = tab3;
	win4.containingTab = tab4;
	
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);
	self.addTab(tab4);
	
	
	
	return self;
};

module.exports = ApplicationTabGroup;
