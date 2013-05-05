var menuWindow = Ti.UI.createWindow({
	top : 0,
	left : 0,
	width : 150
});
menuWindow.open();
//// ---- Menu Table
// Menu Titles
var menuTitles = [{
	title : 'Menu 1'
}, {
	title : 'Menu 2'
}, {
	title : 'Menu 3'
}, {
	title : 'Menu 4'
}, {
	title : 'Menu 5'
}, {
	title : 'Menu 6'
}];
// Tableview
var tableView = Ti.UI.createTableView({
	data : menuTitles
});
menuWindow.add(tableView);

//// ---- Window with navigationGroup
var navWindow = Ti.UI.createWindow({
	width : 320 // Set the width of the sliding window to avoid cut out from animation
});
navWindow.open();
// Main window
var win = Ti.UI.createWindow({
	title : 'Main Window',
	backgroundColor : '#28292c',
	barColor : '#28292c',
	moving : false, // Custom property for movement
	axis : 0 // Custom property for X axis
});
// NavigationGroup
var navGroup = Ti.UI.iPhone.createNavigationGroup({
	window : win
});
navWindow.add(navGroup);
// Top left button
var menuButton = Ti.UI.createButton({
	title : 'Menu',
	toggle : false // Custom property for menu toggle
});
win.setLeftNavButton(menuButton);

menuButton.addEventListener('click', function(e) {
	// If the menu is opened
	if (e.source.toggle == true) {
		navWindow.animate({
			left : 0,
			duration : 400,
			curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
		e.source.toggle = false;
	}
	// If the menu isn't opened
	else {
		navWindow.animate({
			left : 150,
			duration : 400,
			curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
		e.source.toggle = true;
	}
});
win.addEventListener('touchstart', function(e) {
	// Get starting horizontal position
	e.source.axis = parseInt(e.x);
});
win.addEventListener('touchmove', function(e) {
	// Subtracting current position to starting horizontal position
	var coordinates = parseInt(e.x) - e.source.axis;
	// Detecting movement after a 20px shift
	if (coordinates > 20 || coordinates < -20) {
		e.source.moving = true;
	}
	// Locks the window so it doesn't move further than allowed
	if (e.source.moving == true && coordinates <= 150 && coordinates >= 0) {
		// This will smooth the animation and make it less jumpy
		navWindow.animate({
			left : coordinates,
			duration : 20
		});
		// Defining coordinates as the final left position
		navWindow.left = coordinates;
	}
});
win.addEventListener('touchend', function(e) {
	// No longer moving the window
	e.source.moving = false;
	if (navWindow.left >= 75 && navWindow.left < 150) {
		// Repositioning the window to the right
		navWindow.animate({
			left : 150,
			duration : 300
		});
		menuButton.toggle = true;
	} else {
		// Repositioning the window to the left
		navWindow.animate({
			left : 0,
			duration : 300
		});
		menuButton.toggle = false;
	}
}); 