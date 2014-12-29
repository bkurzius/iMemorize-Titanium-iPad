/**
 * 
 */
var _orientationModes = [ Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT,Titanium.UI.UPSIDE_PORTRAIT];
var modal;
var modalWin;
var setSettingsListeners;
var setPickerData;
var handlePickerDoneBtnClick;
var handlePickerCancelBtnClick;
var handleModalDoneClick;
var handleTableClick;
var picker;

// create the animations

settingsWin = Ti.UI.currentWindow;
settingsWin.orientationModes = _orientationModes;

var nav = Ti.UI.iPhone.createNavigationGroup({window:settingsWin});

var table = Ti.UI.createTableView({
	style:Ti.UI.iPhone.TableViewStyle.GROUPED,
	data:[{title:"Add Quote",hasChild:true, header:'Options and Settings'},
	      {title:"Quote Font Size",hasChild:true},
	      {title:"Email Quote",hasChild:true},
	      {title:"Home",hasChild:true, header:'Navigation'},
	      {title:"Instructions",hasChild:true},
	      {title:"About",hasChild:true}
	      ]
});

var picker_view = Titanium.UI.createView({height:251,bottom:-251});
var picker_cancel_btn =  Titanium.UI.createButton({title:'Cancel',style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED});	 
var picker_done_btn =  Titanium.UI.createButton({title:'Done',style:Titanium.UI.iPhone.SystemButtonStyle.DONE});	 
var spacer =  Titanium.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE});	 
var toolbar =  Titanium.UI.createToolbar({top:0,items:[picker_cancel_btn,spacer,picker_done_btn]});
var picker_data = [];
var fontSizes = [12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,47,50];
var setSettingsListeners;
var setPickerData;
var handlePickerDoneBtnClick;
var handlePickerCancelBtnClick;
var handleModalDoneClick;
var handleTableClick;

setSettingsListeners = function(){
	picker_cancel_btn.addEventListener('click',handlePickerCancelBtnClick);	
	picker_done_btn.addEventListener('click',handlePickerDoneBtnClick);
	modal_done_btn.addEventListener('click',handleModalDoneClick);	
	table.addEventListener('click',handleTableClick);
	table2.addEventListener('click',handleTableClick);
};
/*
 *  build the picker data
 *  this sets the initial selected value for the picker
 *  but it appears that it does not work properly just to set the row to "selected"
 *  so instead we set a fontSizeRowIndex_preference -- indicating which row should be selected
 *  and then we use the picker.setSelectedRow() when the user opens the picker
 *  its a HACK but it works
 */
setPickerData = function(){
	Titanium.API.info('build the picker data');
	var fontSizePref = Titanium.App.Properties.getString("fontSize_preference");
	Titanium.API.info('font size preference:' + fontSizePref);
	for(var i=0;i<fontSizes.length;i++){
		Titanium.API.info('fontSizes[i].toString(): ' + fontSizes[i].toString());
		if(fontSizes[i].toString()==fontSizePref){
			Titanium.API.info('!!!!COOL: set selected for this one');
			Titanium.App.Properties.setString("fontSizeRowIndex_preference",i.toString());
			picker_data.push( Titanium.UI.createPickerRow({title:fontSizes[i].toString(),selected:true}));
		}else{
			Titanium.API.info('Dont set selected for this one');
			picker_data.push( Titanium.UI.createPickerRow({title:fontSizes[i].toString()}));
		}
	}
	

};

// -- event handlers ----

handlePickerDoneBtnClick = function(){
	picker_view.animate(slide_out);
	Titanium.App.fireEvent('fontSizeChanged',{data:picker.getSelectedRow(0).title});
	Titanium.App.Properties.setString("fontSize_preference",picker.getSelectedRow(0).title);
};

handlePickerCancelBtnClick = function (){
	picker_view.animate(slide_out);
};

handleModalDoneClick = function(){
	modal.close();
	win.orientationModes = _orientationModes;
};

handleTableClick = function(e){
	var itemTitle = e.rowData.title;
	if(itemTitle==='Add Quote'){
		Titanium.API.info('clicked Add Quote');
		Titanium.App.Properties.setString("quoteEditAction_preference","add");
		showQuoteEditor();
		modal.close();
	}else if(itemTitle==='Quote Font Size'){
		Titanium.API.info('clicked Font Size');
		picker_view.animate(slide_in);
		picker.setSelectedRow(0,Number(Titanium.App.Properties.getString("fontSizeRowIndex_preference")));
		Titanium.API.info('font preference:' + Titanium.App.Properties.getString("fontSize_preference"));
	}else if(itemTitle==='Email Quote'){
		emailQuote();
	}else if(itemTitle==='Home'){
		hideGameButtons();
		modal.close();
		Titanium.App.fireEvent('showHome');
	}else if(itemTitle==='About'){
		hideGameButtons();
		modal.close();
		Titanium.App.fireEvent('showAbout');
	}else if(itemTitle==='Instructions'){
		//hideGameButtons();
		//modal.close();
		//Titanium.App.fireEvent('showInstructions');
		showInstructions();
	}
};


picker = Titanium.UI.createPicker({top:43,selectionIndicator:true});
settingsWin.add(table);
settingsWin.open();
settingsWin.add(picker_view);
