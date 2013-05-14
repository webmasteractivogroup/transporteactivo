var createTableViewRow = function(rowData){
	var row = Ti.UI.createTableViewRow({
		height:44,
		navView: rowData.view,
		backgroundColor:'transparent',
		backgroundImage:'/images/row_bg.png'
	});

	var title = Ti.UI.createLabel({
		color:'white',
		left:8,
		width:Ti.UI.FILL,
		height:Ti.UI.FILL,
		text:rowData.title,
		font:{
			fontFamily:'Arial-BoldMT',
			fontWeight:'bold',
			fontSize:19
		}
	});
	row.add(title);

	if(rowData.hasDetail){
		var detail = Ti.UI.createImageView({
			right:90,
			width:8,
			height:13,
			image:'/images/arrow.png'
		});
		row.add(detail);
	}

	return row;
};

var MenuView = function(args){
	var self = Ti.UI.createTableView({
		backgroundImage:'/images/table_bg.png',
		separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE
	});

	var rows = [];

	for(i=0; i<args.rowData.length; i++) {
		rows.push(createTableViewRow(args.rowData[i]));
	}

	self.setData(rows);

	return self;
};

module.exports = MenuView;
