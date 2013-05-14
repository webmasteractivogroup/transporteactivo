var MASlidingMenu = require('/lib/MASlidingMenu');
var HomeView = require('/ui/HomeView');
var FavoritosView = require('/ui/FavoritosView');
var PerfilView = require('/ui/PerfilView');
var MenuView = require('/ui/MenuView');
var BusquedaView = require('/ui/BusquedaView');

var load = new HomeView();
var home = new HomeView();
var favoritos = new FavoritosView();
var busqueda = new BusquedaView();
var perfil = new PerfilView();

// Each row with a view property when clicked will change to that view (any view works except tabgroups and windows)
// If the row does not have a view property, but the switch event still fires
var data = [
   { title:'Transporte Activo', view: load },
	{ title:'Home', hasDetail:true, view: home },
	{ title:'Favoritos', hasDetail:true, view: favoritos},
	{ title:'Busqueda', hasDetail:true, view: busqueda },
	{ title:'Perfil', hasDetail:true, view: perfil }
];

var menu = new MenuView({
	rowData: data
});

var slidingMenu = new MASlidingMenu({
	left: menu, // the menu... only accepts a tableview
	draggable: true // set false to only use the API to open / close
});
slidingMenu.open();

// event fired when user selects a view from the nav
slidingMenu.addEventListener('buttonclick', function(e) {
	if (e.index === 3) {
		alert('You clicked on Button');
	}
});

// event fired when user selects a view from the nav
slidingMenu.addEventListener('switch', function(e) {
	
	//alert(e.menuRow);
	//alert(e.index);
	//alert(e.view); // This is the new view your switching to
});

// event fired while user is dragging the view to expose the menu
slidingMenu.addEventListener('sliding', function(e) {
	//alert(e.distance);
	
});


//Expose / close the menu programaticly
	//slidingMenu.slideView('left');
	//slidingMenu.slideView('view');

// Access the currently displayed view
	//slidingMenu.activeView();
