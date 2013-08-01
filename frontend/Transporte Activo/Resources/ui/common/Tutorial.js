exports.play = function(id) {
	convert(id);
};

var win = Titanium.UI.createWindow({
	backgroundColor : 'white',

})

function convert(a) {
	//where "a" is video ID;

	if (Ti.Platform.osname === 'android') {
		try {

			var intent = Ti.Android.createIntent({
				action : Ti.Android.ACTION_VIEW,
				data : 'vnd.youtube:' + "//" + a
			});
			intent.putExtra("force_fullscreen", true);
			Ti.Android.currentActivity.startActivity(intent);
		} catch (g) {
			Titanium.Platform.openURL('http://www.youtube.com/watch?v=' + a)
		}
	} else {
		var xhr = Ti.Network.createHTTPClient();
		xhr.setRequestHeader("Referer", "http://www.youtube.com/watch?v=" + a);
		xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/536.26.14 (KHTML, like Gecko) Version/6.0.1 Safari/536.26.14");
		xhr.open("GET", "http://m.youtube.com/watch?ajax=1&feature=related&layout=mobile&tsp=1&&v=" + a);
		xhr.onload = function() {
			var json = decodeURIComponent(decodeURIComponent(decodeURIComponent(decodeURIComponent(this.responseText.substring(4, this.responseText.length)))));
			var response = JSON.parse(json);
			var video = response.content.video;
			var isHighQuality = video['fmt_stream_map'] != null;
			var streamUrl = isHighQuality ? video['fmt_stream_map'][0].url : video.stream_url;
			if (!isHighQuality) {
				Ti.API.info('using low quality video because fmt_stream_map does not exist in json response, User-Agent probably is not being sent correctly');
			}
			Ti.API.info('stream url: ' + streamUrl);

			var movie = Titanium.Media.createVideoPlayer({
				fullscreen : true,
				url : streamUrl,
				autoplay : true,
				width : Ti.UI.FILL,
				height : Ti.UI.FILL,
				backgroundColor : '#111',
				mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
				scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT
			});
			movie.addEventListener('complete', function(e) {
				Ti.API.info('video player complete');
				movie.hide();
				movie.release();
				movie = null;
				win.close();
			});
			movie.addEventListener('fullscreen', function(e) {
				if (!e.entering) {
					Ti.API.info('video player fullscreen exit');
					movie.hide();
					movie.release();
					movie = null;
					win.close();
				}
			});
			win.add(movie)
			win.open();

		};
		xhr.send()
	}

}

