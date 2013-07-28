var Codebird = require('ui/backup/codebird');
var cb = new Codebird();
var rowData = [];
var tableView = Titanium.UI.createTableView({ });
var currentSize;
var updating = false;

var lastId = '';
var refresh;

function TwitterFeed() {

	cb.setConsumerKey('aVPtAQULNrnq5IP65OTGA', 'F7AnSOLvuFB7EV7rhVD5u2PHFTFQdqxfXZoQ7WU7T08');

	/// UPDATE TABLE INDICATORS

	var navActInd = Titanium.UI.createActivityIndicator({
		left : '60 dp',
		top : '18 dp',

	});
	navActInd.show();
	var loadingRow = Ti.UI.createTableViewRow({
		height : '50 dp',
	});

	/////////////////////////////

	var myView = Ti.UI.createView({
		layout : 'horizontal',
		backgroundColor : 'black'
	});
	var myText = Ti.UI.createLabel({
		text : 'Cargando Tweets',
		left : '5 dp',
		top : '15 dp',
		color: 'white',
		backgroundColor : 'black',
		width : Ti.UI.SIZE,
		height : 'auto',
		textAlign : 'left',
		font : {
			fontSize : '20 dp',
			fontWeight : 'bold'
		}
	});
	myView.add(navActInd);
	myView.add(myText);
	loadingRow.add(myView);

	var bearerToken = Ti.App.Properties.getString('TwitterBearerToken', null);
	if (bearerToken == null) {
		cb.__call('oauth2_token', {}, function(reply) {
			var bearer_token = reply.access_token;
			cb.setBearerToken(bearer_token);
			Ti.App.Properties.setString('TwitterBearerToken', bearer_token);
			fetchTwitter();
		});
	} else {
		Ti.API.info("We do have a bearer token...");
		cb.setBearerToken(bearerToken);
		fetchTwitter();
	}

	var lastDistance = 0;
	// calculate location to determine direction

	tableView.addEventListener('scroll', function(e) {

		if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {

			var offset = e.contentOffset.y;
			var height = e.size.height;
			var total = offset + height;
			var theEnd = e.contentSize.height;
			var distance = theEnd - total;

			// going down is the only time we dynamically load,
			// going up we can safely ignore -- note here that
			// the values will be negative so we do the opposite
			if (distance < lastDistance) {
				// adjust the % of rows scrolled before we decide to start fetching
				var nearEnd = theEnd * .75;

				if (!updating && (total >= nearEnd)) {
					tableView.appendRow(loadingRow);
					updating = true;
					fetchTwitter();
				}
			}
			lastDistance = distance;

		} else if (Ti.Platform.osname === 'android') {
			var firstVisibleItemIndex = e.firstVisibleItem;
			var totalItems = e.totalItemCount;
			var visibleItemCount = e.visibleItemCount;
			if (!updating && ((firstVisibleItemIndex + visibleItemCount) >= (totalItems * 0.75))) {
				updating = true;
				fetchTwitter();
			}
		}

	});

	var viewContenedora = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		layout : 'vertical'
	});

	refresh = Ti.UI.createButton({
		title : 'Presiona aquí para actualizar',
		backgroundColor : 'gray',
		color : 'white',
		backgroundImage : 'none',
		height : '30 dp',
		width : Ti.UI.FILL,
	});

	// Listen for click events.
	refresh.addEventListener('click', function() {
		if (!updating) {
			refresh.title = 'Actualizando...'
			tableView.appendRow(loadingRow);
			updating = true;
			rowData = [];
			lastId = '';
			fetchTwitter();
		}
	});

	// Add to the parent view.

	viewContenedora.add(refresh);
	viewContenedora.add(tableView);

	return viewContenedora;
};

function fetchTwitter() {

	cb.__call('search_tweets', "q=" + Ti.Network.encodeURIComponent("metrocali") + "&count=16&result_type=recent" + lastId, function(reply) {
		// ...
		try {
			currentSize = rowData.length;

			for (var i = 0; i < reply.statuses.length; i++) {
				var tweet = reply.statuses[i].text;
				// The tweet message

				var user = reply.statuses[i].user.screen_name;
				// The screen name of the user
				var avatar = reply.statuses[i].user.profile_image_url;
				// The profile image

				// Create a row and set its height to auto
				var row = Titanium.UI.createTableViewRow({
					height : Ti.UI.SIZE,
				});
				// Create the view that will contain the text and avatar
				var post_view = Titanium.UI.createView({
					height : '110 dp',
					layout : 'vertical',
					top : '5 dp',
					right : '5 dp',
					left : '5 dp',
					bottom : '5dp'
				});

				var av_image = Titanium.UI.createImageView({
					image : avatar, // the image for the image view
					top : 0,
					left : '10 dp',
					height : '50 dp',
					width : '50 dp',
					borderColor : '#888888',
					borderRadius : 10,
					preventDefaultImage : true
				});
				post_view.add(av_image);

				// Create the label to hold the screen name
				var user_lbl = Titanium.UI.createLabel({
					text : user,
					left : '74 dp',
					width : Ti.UI.FILL,
					top : '-50 dp',
					bottom : '2 dp',
					height : '16 dp',
					textAlign : 'left',
					color : 'black',
					font : {
						fontFamily : 'Trebuchet MS',
						fontSize : '14 dp',
						fontWeight : 'bold'
					}
				});
				post_view.add(user_lbl);

				// Create the label to hold the tweet message
				var tweet_lbl = Titanium.UI.createLabel({
					text : tweet,
					left : '74 dp',
					top : 0,
					bottom : '2 dp',
					height : Ti.UI.SIZE,
					width : Ti.UI.FILL,
					color : 'black',
					textAlign : 'left',
					font : {
						fontSize : '14 dp'
					}
				});
				post_view.add(tweet_lbl);

				// Add the post view to the row
				row.add(post_view);
				// Give each row a class name
				row.className = "item";
				// Add row to the rowData array

				if ((reply.statuses.length - 1) === i) {
					lastId = '&max_id=' + reply.statuses[i].id;
				} else {
					rowData[currentSize + i] = row;
				}
			}
			tableView.data = rowData;
			endUpdate();
		} catch(e) {
			alert("no hay conexion a internet");
		}
	}, true // this parameter required
	);
};

function endUpdate() {

	updating = false;

	if (refresh.title === 'Actualizando...') {
		tableView.scrollToIndex(0, {
			animated : true,
			position : Ti.UI.iPhone.TableViewScrollPosition.TOP
		});
		refresh.title = 'Presiona aquí para actualizar';
	}

}

module.exports = TwitterFeed;

