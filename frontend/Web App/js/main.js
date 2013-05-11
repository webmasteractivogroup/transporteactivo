
// $(document).bind("mobileinit", function () {

// 	// Navigation
// 	$.mobile.page.prototype.options.backBtnText = "Go back";
// 	$.mobile.page.prototype.options.addBackBtn      = true;
// 	$.mobile.page.prototype.options.backBtnTheme    = "d";

// 	// Page
// 	$.mobile.page.prototype.options.headerTheme = "a";  // Page header only
// 	$.mobile.page.prototype.options.contentTheme    = "c";
// 	$.mobile.page.prototype.options.footerTheme = "a";

// 	// Listviews
// 	$.mobile.listview.prototype.options.headerTheme = "a";  // Header for nested lists
// 	$.mobile.listview.prototype.options.theme           = "c";  // List items / content
// 	$.mobile.listview.prototype.options.dividerTheme    = "d";  // List divider

// 	$.mobile.listview.prototype.options.splitTheme   = "c";
// 	$.mobile.listview.prototype.options.countTheme   = "c";
// 	$.mobile.listview.prototype.options.filterTheme = "c";
// 	$.mobile.listview.prototype.options.filterPlaceholder = "Filter data...";
// });

var map;
function initialize() {
  var mapOptions = {
    zoom: 12,
    size: new google.maps.Size(200, 200),
    center: new google.maps.LatLng(3.420556, -76.522222),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map($(".map-canvas").get(0), mapOptions);
}

function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyBWdIbq64kbz8B83nx9TS3u5NqiIYFK9r0&sensor=true&callback=initialize";
  document.body.appendChild(script);
}

window.onload = loadScript;