var SettingsMenu = {
	// data
	_orientationModes: {},
	inited:false,
	pickerInited:false,
	windowHeight: 500,
	
	// ui
	modal: {},
	modalNav: {},
	picker: {},
	modal_done_btn: {},
	table: {},
	picker_view: {},
	picker_cancel_btn: {},
	picker_done_btn: {},
	spacer: {},
	toolbar: {},
	picker_data: [],
	modalBg: {},
	
	// animations
	slide_in: {},
	slide_out: {},

	// platform specific values
	fontSizes:{},
	_currMode: {},
	
	// handlers
	handlePickerDoneBtnClick: {},
	handlePickerCancelBtnClick: {},
	handleModalDoneClick: {},
	handleTableClick: {},
	
	// styles
	_toolbarGradient: {
		type:'linear',
		colors:['#888888','#000001'],
		startPoint:{x:0,y:0},
		endPoint:{x:0,y:50},
		backFillStart:false
	},
	navHeaderHeight: 40	
};


SettingsMenu.showSettings = function(){
	SettingsMenu.init();

	Titanium.API.info('SettingsMenu.showSettings()');
	SettingsMenu.table = Ti.UI.createTableView({
		style:Ti.UI.iPhone.TableViewStyle.GROUPED,
		backgroundImage: "images/" + TiUtils.getOsName() + "-images/bg.png",
		data:[{title:"Enter your own quote",hasChild:true, header:'Options and Settings'},
		      {title:"Quote Font Size",hasChild:true},
		      {title:"Email Quote",hasChild:true},
			  {title:"Copy Quote to Clipboard",hasChild:true},
		      {title:"Send Feedback",hasChild:true, header:''}
		      ]
	});
	SettingsMenu.table.addEventListener('click',SettingsMenu.handleTableClick);
	SettingsMenu.modal.add(SettingsMenu.table);
	// open as modal if not android	
	if (TiUtils.isAndroid()) {
		SettingsMenu.table.backgroundColor = "#000000";
		SettingsMenu.table.fontWeight = "bold";
		SettingsMenu.table.top = 40;
		SettingsMenu.modal.open({
			modal: false
		});
	}else{
		SettingsMenu.modal.open({
			modal: true
		});
	}
};
SettingsMenu.hideSettings = function(){
	SettingsMenu.modal.close();
};


SettingsMenu.init = function(){
	SettingsMenu._orientationModes = [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT, Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT];
	SettingsMenu.slide_in = Titanium.UI.createAnimation({
		bottom: 0
	});
	SettingsMenu.slide_out = Titanium.UI.createAnimation({
		bottom: -251
	});
	SettingsMenu.modal = Ti.UI.createWindow({
		height: TiUtils.getAppHeight(),
		top: 0,
		backgroundColor: "#FFFFFF",
		backgroundImage: "images/" + TiUtils.getOsName() + "-images/bg.png",
	});
	
	SettingsMenu.modalBg = Ti.UI.createView({
		height: TiUtils.getAppHeight(),
		top: 0,
		backgroundColor: "#FFFFFF"
	});
	SettingsMenu.modal.add(SettingsMenu.modalBg);
	SettingsMenu.modal.orientationModes = SettingsMenu._orientationModes;
	SettingsMenu.modal_done_btn = Titanium.UI.createButton({
		title: "Done",
		height: 35,
		width: 200
	});
	
	
	SettingsMenu._currMode = Titanium.App.Properties.getString("currMode_preference");
	

	if (!TiUtils.isAndroid()) {
		SettingsMenu.modal.setRightNavButton(SettingsMenu.modal_done_btn);
	}else {
		SettingsMenu.modal_done_btn.height=35;
		SettingsMenu.modalNav = Titanium.UI.createView({
			height: SettingsMenu.navHeaderHeight,
			backgroundColor: "#000001",
			top: 0
		});
		SettingsMenu.modalNav.add(SettingsMenu.modal_done_btn);
		SettingsMenu.modal.add(SettingsMenu.modalNav);
	}

	SettingsMenu.setSettingsListeners();
	if (Titanium.UI.orientation < 3) {
		SettingsMenu.toolbar.top = 0;
	} else if (Titanium.UI.orientation > 2 && Titanium.UI.orientation < 5) {
		SettingsMenu.toolbar.top = 13;
	}
};



SettingsMenu.setSettingsListeners = function(){
	try{
		SettingsMenu.modal_done_btn.removeEventListener('click',SettingsMenu.handleModalDoneClick);
		Titanium.Gesture.removeEventListener('orientationchange',SettingsMenu.resetLayout);
	}finally{
		SettingsMenu.modal_done_btn.addEventListener('click',SettingsMenu.handleModalDoneClick);
		Titanium.Gesture.addEventListener('orientationchange',SettingsMenu.resetLayout);
	}
};

SettingsMenu.resetLayout = function(e){
	var tempAppHeight =  TiUtils.getAppHeight();
	var tempAppWidth =  TiUtils.getAppWidth();
	var pickerViewHeight = TiUtils.getPickerViewHeight();
	Ti.API.info("SettingsMenu.resetLayout:" + TiUtils.getOrientation() );
	// if the orientation is portrait	
	SettingsMenu.toolbar.top = 0;
	if(TiUtils.getOrientation()==="landscape" && !TiUtils.isiPad()){
		SettingsMenu.toolbar.top = 13;
	}
	Ti.API.info("tempAppWidth" + tempAppWidth);
	Ti.API.info("tempAppHeight" + tempAppHeight);
	SettingsMenu.picker_view.width= tempAppWidth;
	SettingsMenu.toolbar.width = tempAppWidth;
	SettingsMenu.picker.width= tempAppWidth;
	Ti.API.info("pickerViewHeight:" + pickerViewHeight);
	SettingsMenu.picker_view.height = pickerViewHeight;
	Ti.API.info("tempAppHeight-pickerViewHeight: "+ (tempAppHeight-pickerViewHeight));
	SettingsMenu.picker_view.top = (tempAppHeight-pickerViewHeight);
};
/*
 *  build the picker data
 *  this sets the initial selected value for the picker
 *  but it appears that it does not work properly just to set the row to "selected"
 *  so instead we set a fontSizeRowIndex_preference -- indicating which row should be selected
 *  and then we use the picker.setSelectedRow() when the user opens the picker
 *  its a HACK but it works
 */
SettingsMenu.setPickerData = function(){
	Titanium.API.info('build the picker data');
	var fontSizePref = Titanium.App.Properties.getString("fontSize_preference");
	Titanium.API.info('font size preference:' + fontSizePref);
	for(var i=0;i<SettingsMenu.fontSizes.length;i++){
		Titanium.API.info('fontSizes[i].toString(): ' + SettingsMenu.fontSizes[i].toString());
		if(SettingsMenu.fontSizes[i].toString()==fontSizePref){
			Titanium.API.info('!!!!COOL: set selected for this one');
			Titanium.App.Properties.setString("fontSizeRowIndex_preference",i.toString());
			SettingsMenu.picker_data.push( Titanium.UI.createPickerRow({title:SettingsMenu.fontSizes[i].toString(),selected:true}));
		}else{
			Titanium.API.info('Dont set selected for this one');
			SettingsMenu.picker_data.push( Titanium.UI.createPickerRow({title:SettingsMenu.fontSizes[i].toString()}));
		}
	}
};

// -- event handlers ----

SettingsMenu.handlePickerDoneBtnClick = function(){
	Titanium.API.info("handlePickerDoneBtnClick");
	Titanium.App.fireEvent('fontSizeChanged',{data:SettingsMenu.picker.getSelectedRow(0).title});
	Titanium.App.Properties.setString("fontSize_preference",SettingsMenu.picker.getSelectedRow(0).title);
	if(SettingsMenu._currMode!=='game'){
		TiUtils.showAlertDialog('Alert','The font size will be changed on the game memorizer screen.',['OK']);
	}
	SettingsMenu.hidePicker();
};


SettingsMenu.handleModalDoneClick = function(){
	SettingsMenu.hideSettings();
};

SettingsMenu.handleTableClick = function(e){
	var itemTitle = e.rowData.title;
	if(itemTitle==='Enter your own quote'){
		Titanium.API.info('clicked Enter your own quote');
		Titanium.App.Properties.setString("quoteEditAction_preference","add");
		SettingsMenu.modal.close();
		Titanium.App.fireEvent('closeSettingsMenuEvent',{});
		Titanium.App.fireEvent('showQuoteEditorEvent',{});
	}else if(itemTitle==='Quote Font Size'){
		SettingsMenu.showPicker();
	}else if(itemTitle==='Email Quote'){
		Titanium.App.fireEvent('emailQuoteEvent',{});
	}else if(itemTitle==='Copy Quote to Clipboard'){
		Titanium.App.fireEvent('copyQuoteEvent',{});	
	}else if(itemTitle==='Send Feedback'){
		Titanium.App.fireEvent('sendFeedback',{});

	}
};




SettingsMenu.showPicker = function(){
	Titanium.API.info('clicked Font Size');
	if (!SettingsMenu.pickerInited) {
		SettingsMenu.pickerInit();
		SettingsMenu.pickerInited = true;
	}else{
		SettingsMenu.setPickerData();
	}
	SettingsMenu.modal.add(SettingsMenu.picker_view);
	SettingsMenu.picker_view.height = TiUtils.getPickerViewHeight();
	SettingsMenu.picker_view.top = TiUtils.getAppHeight()-TiUtils.getPickerViewHeight();
	SettingsMenu.picker_view.width= TiUtils.getAppWidth();
	SettingsMenu.picker.setSelectedRow(0,Number(Titanium.App.Properties.getString("fontSizeRowIndex_preference")));
	Titanium.API.info('font preference:' + Titanium.App.Properties.getString("fontSize_preference"));	
//*
	
	//if (TiUtils.isAndroid()) {
		SettingsMenu.picker_view.visible = true;
	//}else{
	//	SettingsMenu.picker_view.bottom = -251;
	//	SettingsMenu.picker_view.visible = true;
	//	SettingsMenu.picker_view.animate(SettingsMenu.slide_in);
	//}
//*/
	
};

SettingsMenu.hidePicker = function(){
	//if (TiUtils.isAndroid()) {
		SettingsMenu.picker_view.visible = false;
	//}else{
	//	SettingsMenu.picker_view.animate(SettingsMenu.slide_out);
	//}
};

SettingsMenu.pickerInit = function(){
	var buttonStyleBordered = Titanium.UI.iPhone.SystemButtonStyle.BORDERED;
	var buttonStyleDone = Titanium.UI.iPhone.SystemButtonStyle.DONE;
	
	if (TiUtils.isAndroid()) {
		buttonStyleBordered = {};
		buttonStyleDone = {};
	}
	Titanium.API.info("pickerInit()1");
	// create the picker view
	SettingsMenu.picker_view = Titanium.UI.createView({
		width:TiUtils.getAppWidth(),
		backgroundColor:"#666666"
	});

	// create picker done btn
	SettingsMenu.picker_done_btn = Titanium.UI.createButton({
		title: 'Done',
		style:buttonStyleDone
	});
	SettingsMenu.picker_done_btn.addEventListener('click',SettingsMenu.handlePickerDoneBtnClick);

	// now create the picker
	SettingsMenu.picker = Titanium.UI.createPicker({
		top: 43,
		selectionIndicator: true
	});

	// create a toolbar -- iOS only use a view for Android
	if (!TiUtils.isAndroid()) {
		SettingsMenu.toolbar = Titanium.UI.createToolbar({
			top: 0,
			items: [SettingsMenu.picker_done_btn]
		});
	}else{
		SettingsMenu.toolbar = Titanium.UI.createView({
			top: 0,
			height:40,
			backgroundColor:"#000000",
			opacity:".6"
		});
		SettingsMenu.toolbar.add(SettingsMenu.picker_done_btn);
		SettingsMenu.picker_done_btn.width = 100;
	}
	
	// platform specific values
	SettingsMenu.fontSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
	if (TiUtils.isiPad()) {
		SettingsMenu.fontSizes = [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 47, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70];
	}
	SettingsMenu.setPickerData();
	SettingsMenu.picker.add(SettingsMenu.picker_data);
	SettingsMenu.picker_view.add(SettingsMenu.toolbar);
	SettingsMenu.picker_view.add(SettingsMenu.picker);
	Titanium.API.info("pickerInit()1");
};

