function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//create app tabs
	var win1 = new Window(L('Planear Viaje')),
		win2 = new Window(L('Buscar')), 
		win3 = new Window(L('Favoritos')),
		win4 = new Window(L('Noticias'));
	
	var tab1 = Ti.UI.createTab({
		title: L('Planear Viaje'),
		icon: '/images/KS_nav_ui.png',
		window: win1
	});
	
	
	var tab2 = Ti.UI.createTab({
		title: L('Buscar'),
		icon: '/images/KS_nav_views.png',
		window: win2
	});
	
	var tab3 = Ti.UI.createTab({
		title: L('Favoritos'),
		icon: '/images/KS_nav_ui.png',
		window: win3
	});
	
	
	var tab4 = Ti.UI.createTab({
		title: L('Noticias'),
		icon: '/images/KS_nav_views.png',
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
