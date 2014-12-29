
var AddQuote = {
	inited:false,
	ACTION_UPDATED: "QuoteEdited",
	ACTION_EDIT_LABEL_TEXT: 'Edit quote:',
	ACTION_ADDED: "QuoteAdded",
	ACTION_ADD_LABEL_TEXT: 'Add your quote:',
	ACTION_ADD_AND_MEMORIZE: "AddAndMemorize",
	ORIENTATION_PORTRAIT: "portrait",
	ORIENTATION_LANDSCAPE: "landscape",
	KEYBOARD_BOTTOM_PORTRAIT: 112,
	KEYBOARD_BOTTOM_LANDSCAPE: 160,
	_orientation: this.ORIENTATION_PORTRAIT,
	language_picker_data: [],
	languageArray: ['Afrikaans','Albanian','Arabic','Armenian','Azerbaijani','Basque','Belarusian','Bulgarian','Catalan','Chinese','Croatian','Czech','Danish','Dutch','English','Estonian','Filipino','French','Galician','Georgian','German','Greek','Haitian Creole','Hebrew','Hindi','Hungarian','Icelandic','Indonesian','Irish','Italian','Japanese','Korean','Latvian','Lithuanian','Macedonian','Malay','Maltese','Norwegian','Persian','Polish','Portuguese','Romanian','Russian','Serbian','Slovak','Slovenian','Spanish','Swahili','Swedish','Thai','Turkish','Ukrainian','Urdu','Vietnamese','Welsh','Yiddish'],
	quoteLanguage: "English",
	labelText: "Add your quote",
	addButtonText: "Save",
	languagePref:"",
	_inputGap: 10,
	iPhoneStatusBarHeight: 20,
	_width: {},
	_height: {},
	_quotePromptText: 'Quote',
	_authorPromptText: ' Author',
	_sourcePromptText: ' Reference',
	quoteText: "",
	authorText: "",
	sourceText: "",
	_action: "",
	_actionLabelText: "",
	keyboardOpened: false,
	currOrientation: "",
	

	// ui
	win: {},
	language_picker:{},
	quoteTxt:"",
	sourceTxt:"",
	authorTxt:"",
	language_picker_view:{},
	addButton:{},
	closeButton:{},
	cancelButton:{},
	drop_button:{},
	memorizeNowButton:{},
	label:{},
	language_label:{},
	done:{},
	spacer:{},
	keyboardBtnBar:{},
	enterQuoteWin:{},
	toolBar:{},
	languageToolbar:{},
	closeKeyboardBtn: {},
	
	// styles
	slide_in:  Titanium.UI.createAnimation({bottom:0}),
	slide_out:  Titanium.UI.createAnimation({bottom:-251}),
	slide_in_top_btnbar: Titanium.UI.createAnimation({top:300}),
	slide_out_top_btnbar: Titanium.UI.createAnimation({top:600}),
	slide_out_btm_btnbar: Titanium.UI.createAnimation({bottom:-400}),
	fade_in: Titanium.UI.createAnimation({opacity:1}),
	fade_out: Titanium.UI.createAnimation({opacity:0}),
	_fontFamily: 'Helvetica Neue',
	_buttonGradient: {
		type:'linear',
		colors:['#888888','#000001'],
		startPoint:{x:0,y:0},
		endPoint:{x:0,y:60},
		backFillStart:false
	},
	
	_closeButtonGradient: {
			type:'linear',
			//colors:['#C4D607','#5A7104'],
			colors:['#FEFEFE','#898989'],
			startPoint:{x:0,y:0},
			endPoint:{x:0,y:60},
			backFillStart:false
		},
	
	_toolbarGradient: {
		type:'linear',
		//colors:['#B4D109','#8DA701'],
		colors:['#888888','#000001'],
		startPoint:{x:0,y:0},
		endPoint:{x:0,y:60},
		backFillStart:false
	},
	_disabledButtonGradient: {
			type:'linear',
			colors:['#CCCCCC','#888888'],
			startPoint:{x:0,y:0},
			endPoint:{x:0,y:60},
			backFillStart:false
		},
	_uiWindowGradient: {
			type:'linear',
			colors:['#B4D109','#8DA701'],
			startPoint:{x:0,y:0},
			endPoint:{x:0,y:50},
			backFillStart:false
		},
	_buttonBarGradient: {
			type:'linear',
			colors:['#565F6D','#8E96A1'],
			startPoint:{x:0,y:0},
			endPoint:{x:0,y:50},
			backFillStart:false
	},
	buttonStyle: {},
	barStyle: {},

	// platform specific values
	_toolbarHeight: 40,
	_closeBtnHeight: 30,
	_closeBtnTop: 5,
	_labelTop: 45,
	_quoteTextTop: 75,
	_quoteTextHeight: 150,
	_authorTextTop: 235,
	_sourceTextTop: 275,
	_languageOptionsTop: 315,
	_marginRight: 10,
	_marginLeft: 10,
	_textBoxMargin: 20,
	_addBtnTop: 355,
	_memorizeNowBtnTop: 405

};



// ------- functions

AddQuote.init = function(){
	
	AddQuote.quoteText = AddQuote._quotePromptText;
	AddQuote.authorText = AddQuote._authorPromptText;
	AddQuote.sourceText = AddQuote._sourcePromptText;
	AddQuote._width = Titanium.Platform.displayCaps.platformWidth;
	AddQuote._height = Titanium.Platform.displayCaps.platformHeight - AddQuote.iPhoneStatusBarHeight;
	AddQuote.win = Titanium.UI.createWindow({
		backgroundColor:"#000000",
		top:0,
		backgroundImage: "images/" + TiUtils.getOsName() + "-images/bg.png"
	});
	// platform specific values
	if(TiUtils.isiPad()){
		AddQuote._toolbarHeight = 60;
		AddQuote._closeBtnHeight = 40;
		AddQuote._closeBtnTop = 10;
		AddQuote._marginRight = 50;
		AddQuote._marginLeft = 50;
		AddQuote._textBoxMargin = 100;
		AddQuote._labelTop = 65;
		AddQuote._quoteTextHeight = 400;
		AddQuote._quoteTextTop = 95;
		AddQuote._authorTextTop = 505;
		AddQuote._sourceTextTop = 545;
		AddQuote._languageOptionsTop = 595;
		AddQuote._addBtnTop = 635;
		AddQuote._memorizeNowBtnTop = 685;
	
	}
	
	if(TiUtils.isIos()){
		AddQuote.buttonStyle = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
		AddQuote.barStyle = Titanium.UI.iPhone.SystemButtonStyle.BAR;
	}else{
		AddQuote.buttonStyle = "";
		AddQuote.barStyle = "";
	}
	
	Titanium.App.Properties.setString("currQuoteLanguage_preference","English");
	Titanium.App.Properties.setString("languageRowIndex_preference","5");
	AddQuote.setOrientation();
	if(Titanium.App.Properties.getString("quoteEditAction_preference")=="edit"){
		AddQuote.getQuote();
		AddQuote._actionLabelText = AddQuote.ACTION_EDIT_LABEL_TEXT;
	}else{
		AddQuote._actionLabelText = AddQuote.ACTION_ADD_LABEL_TEXT;
	}
	AddQuote.draw();
	AddQuote.addEventListeners();
	// Declare orientation modes
	AddQuote.win.orientationModes = [Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT,Titanium.UI.UPSIDE_PORTRAIT];
	
};


//-- create ui	

AddQuote.draw = function(){
	//*
	AddQuote.toolBar = Ti.UI.createView({
		width:'auto',
		height:AddQuote._toolbarHeight,
		top:0,
		left:0,
		//backgroundGradient:AddQuote._toolbarGradient,
		backgroundColor:"#000000",
		borderWidth:1,
		borderColor:'#666'
	});
	//*/
	AddQuote.closeButton = Ti.UI.createButton({
		title:'Close',
		width:100,
		height:AddQuote._closeBtnHeight,
		top:AddQuote._closeBtnTop,
		style:AddQuote.buttonStyle,
		backgroundGradient:AddQuote._closeButtonGradient,
		borderRadius:10,
		font:{fontSize:16,fontFamily:AddQuote._fontFamily,fontWeight:'bold'},
		color:'#545454'
	});
	//*/

	//*
	AddQuote.keyboardBtnBar = Ti.UI.createView({
		id:'buttonbar',
		height:40,
		top:100,
		backgroundColor:"#000000",
		style:AddQuote.barStyle,
		backgroundGradient:AddQuote._buttonBarGradient
	});
	
	AddQuote.closeKeyboardBtn = Titanium.UI.createButton({
		title: "Close Keyboard",
		height:30,
		width:200,
		backgroundGradient:AddQuote._closeButtonGradient,
		borderRadius:10,
		font:{fontSize:16,fontFamily:AddQuote._fontFamily,fontWeight:'bold'},
		color:'#545454'		
	});
	if(TiUtils.isIos()){
		AddQuote.closeKeyboardBtn.style= Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
	}
	AddQuote.closeKeyboardBtn.addEventListener("click",AddQuote.handleKeyboardClose);
	AddQuote.keyboardBtnBar.add(AddQuote.closeKeyboardBtn);
	
	//*/
	AddQuote.enterQuoteWin = Titanium.UI.createScrollView({
		contentWidth:'auto',
		contentHeight:'auto',
		top:0,
		backgroundImage:'images/' + AddQuote.osName + '/bg.png',
		showVerticalScrollIndicator:true,
		scrollType:"vertical",
		layout:"vertical"
	});
	
	AddQuote.label = Titanium.UI.createLabel({
		text:AddQuote._actionLabelText,
		top:5,
		left:AddQuote._marginLeft,
		height:'auto',
		width:'auto',
		color:'#FFFFFF',
		font:{fontSize:16,fontFamily:AddQuote._fontFamily,fontWeight:'bold'}
	});
	
	AddQuote.quoteTxt = Titanium.UI.createTextArea({
		value:AddQuote.quoteText,
		left:AddQuote._marginLeft,	
		width: AddQuote._width - AddQuote._textBoxMargin,
		height:AddQuote._quoteTextHeight,
		top:5,
		editable:true,
		borderRadius:10,
		borderColor:'#CCC',
		borderWidth:2,
		font:{fontSize:16,fontFamily:AddQuote._fontFamily},
		suppressReturn:false
	});
	
	AddQuote.authorTxt = Titanium.UI.createTextField({
		value:AddQuote.authorText,
		left:AddQuote._marginLeft,
		width: AddQuote._width - 20,
		height:30,
		top:5,
		editable:true,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font:{fontSize:16,fontFamily:AddQuote._fontFamily},
		suppressReturn:false
	});
	
	AddQuote.sourceTxt = Titanium.UI.createTextField({	
		value:AddQuote.sourceText,
		left:AddQuote._marginLeft,
		width: AddQuote._width - 20,
		height:30,
		top:5,
		editable:true,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font:{fontSize:16,fontFamily:AddQuote._fontFamily},
		suppressReturn:false
	});
	
	AddQuote.languageOptionHolder = Titanium.UI.createView({top:5,height:40});
	AddQuote.drop_button =  Titanium.UI.createImageView({
		backgroundImage:"images/dropdown-btn.png",
		width:25,
		height:25,
		top:4,
		left:220
	});
	
	AddQuote.languageInfo_label =  Titanium.UI.createLabel({
		text:'?',
		width:30,
		height:30,
		textAlign:'center',
		borderWidth:1,
		top:0,
		borderColor:'#999',
		backgroundGradient:{
			type:'linear',
			colors:['#AAAAAA','#EEEEEE'],
			startPoint:{x:0,y:30},
			endPoint:{x:0,y:0},
			backFillStart:true
		}
		
	});
	
	AddQuote.language_label =  Titanium.UI.createTextField({
		value:'Quote language: ' + AddQuote.quoteLanguage,
		left:AddQuote._marginLeft,
		width:250,
		height:30,
		top:0,
		enabled:false,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font:{fontSize:14,fontFamily:AddQuote._fontFamily,color:'#999999'}
	});
	
	AddQuote.languageOptionHolder.add(		
		AddQuote.language_label,
		AddQuote.languageInfo_label,
		AddQuote.drop_button
	);

	AddQuote.done =  Titanium.UI.createButton({
		title:'Done'
	});
	
	if (!TiUtils.isAndroid()) {
		AddQuote.languageToolbar = Titanium.UI.createToolbar({
			top: 0,
			items: [AddQuote.done]
		});
		AddQuote.language_picker_view = Titanium.UI.createView({height:251,bottom:-251});
	}else{
		AddQuote.languageToolbar = Ti.UI.createView({height:50,backgroundColor:"#2299FF",top:0});
		AddQuote.languageToolbar.add(AddQuote.done);
		AddQuote.language_picker_view = Titanium.UI.createView({height:251,top:200,backgroundColor:"#11FF95"});
	}
	
	AddQuote.language_picker = Titanium.UI.createPicker({top:43});	
	if(Titanium.UI.orientation > 2 &&  Titanium.UI.orientation < 5 && TiUtils.isiPhone()){
		AddQuote.languageToolbar.top = 10;
		AddQuote.language_picker_view.height = 200;
		AddQuote.language_picker.top = 60;
	}

	AddQuote.addButton = Titanium.UI.createButton({
		title:AddQuote.addButtonText,
		width:100,
		height:40,
		top:5,
		style:AddQuote.buttonStyle,
		borderRadius:10,
		font:{fontSize:16,fontFamily:AddQuote._fontFamily,fontWeight:'bold'},
		backgroundGradient:AddQuote._buttonGradient,
		borderWidth:1,
		borderColor:'#666'
	});
	// disable the save button until user enters data
	if(Titanium.App.Properties.getString("quoteEditAction_preference")!="edit"){
		AddQuote.disableSaveButton();
	}
	
	AddQuote.memorizeNowButton = Titanium.UI.createButton({
		title:'Save and memorize now >',
		width:250,
		height:40,
		top:5,
		style:AddQuote.buttonStyle,
		borderRadius:10,
		font:{fontSize:16,fontFamily:AddQuote._fontFamily,fontWeight:'bold'},
		backgroundGradient:AddQuote._buttonGradient,
		borderWidth:1,
		borderColor:'#666'
	});
	
	AddQuote.disableMemorizeNowButton();
	AddQuote.language_picker.selectionIndicator=true;
	AddQuote.language_picker_view.add(AddQuote.languageToolbar);
	AddQuote.language_picker_view.add(AddQuote.language_picker);
	
	AddQuote.toolBar.add(AddQuote.closeButton);
	AddQuote.toolBar.add(AddQuote.closeButton);
	AddQuote.enterQuoteWin.add(AddQuote.toolBar);
	AddQuote.enterQuoteWin.add(AddQuote.label);
	AddQuote.enterQuoteWin.add(AddQuote.quoteTxt);
	AddQuote.enterQuoteWin.add(AddQuote.authorTxt);
	AddQuote.enterQuoteWin.add(AddQuote.sourceTxt);	
	AddQuote.enterQuoteWin.add(AddQuote.languageOptionHolder);
	AddQuote.enterQuoteWin.add(AddQuote.addButton);
	Ti.API.info('Titanium.App.Properties.getString("quoteEditAction_preference")');
	if(Titanium.App.Properties.getString("quoteEditAction_preference")==="add"){
		AddQuote.enterQuoteWin.add(AddQuote.memorizeNowButton);
	}
	AddQuote.win.add(AddQuote.enterQuoteWin);
	AddQuote.enterQuoteWin.backgroundImage = 'images/bg.png';
	Ti.API.info('win.add(enterQuoteWin);');
	AddQuote.resetLayout();
	
	AddQuote.win.open();
	
	if(TiUtils.isAndroid()){
		AddQuote.languageInfo_label.height = 40;
		AddQuote.sourceTxt.height = 40;
		AddQuote.authorTxt.height = 40;
	}
};

// --------- general functions ---------


AddQuote.enterQuote = function (saveAndMemorize){
	Ti.API.info('enterQuote()');
	// open the database
	var quoteString;
	var cleanString = TiUtils.trim(AddQuote.quoteTxt.value);
	if(cleanString.indexOf('\n')>-1 && AddQuote.isLogogramLanguage()===false){
		quoteString = cleanString.replaceAll('\n','<br/> ');
	}else{
		quoteString = cleanString;
	}
	var db = Titanium.Database.open('iMemorizeDB');
	Ti.API.info('opened db');
	db.execute('INSERT INTO MYQUOTES (QUOTE, AUTHOR, SOURCE, LANGUAGE, CHECKED) VALUES(?,?,?,?,?)',Titanium.Network.encodeURIComponent(quoteString),Titanium.Network.encodeURIComponent(AddQuote.authorTxt.value),Titanium.Network.encodeURIComponent(AddQuote.sourceTxt.value),Titanium.App.Properties.getString("currQuoteLanguage_preference"),0);
	Ti.API.info('inserted into db');
	
	// now get the id of the quote
	var lastQuote = db.execute('SELECT * FROM MYQUOTES ORDER BY ID DESC');
	Ti.API.info('The id of the last entered quote is : ' + lastQuote.fieldByName('id'));
	var currQuoteId = lastQuote.fieldByName('id');
	
	// now append the id to the device id and update the quote_id on the entry
	// this way the id is descreet from the ids that are assigned to the standard quote sets
	var uniqueQuoteId = 'UID' + '-' + currQuoteId;
	Ti.API.info('uniqueQuoteId : ' + uniqueQuoteId);
	db.execute('UPDATE MYQUOTES SET QUOTE_ID = "' + uniqueQuoteId + '" WHERE ID = ' + currQuoteId);
	
	// now get the id of the quote
	lastQuote = db.execute('SELECT * FROM MYQUOTES WHERE ID = ' + currQuoteId);
	Ti.API.info('The updated quote_id is : ' + lastQuote.fieldByName('quote_id'));

	db.close(); // close db when you're done to save resources		
	// set the action so we can fire the correct event
	if(saveAndMemorize){
		AddQuote._action = AddQuote.ACTION_ADD_AND_MEMORIZE;
	}else{
		AddQuote._action = AddQuote.ACTION_ADDED;
	}
	AddQuote.buildSavedQuotes();	
	// now reset the input fields
	AddQuote.resetInputFields();
};

AddQuote.updateQuote = function(){
	Ti.API.info('updateQuote()');
	var inputString = AddQuote.quoteTxt.value;
	var processedString = inputString;
	if(!AddQuote.isLogogramLanguage()){
		processedString = inputString.replaceAll('\n','<br/> ');
	}
	var finalString;
	// this handles a bug where sometimes the replaceAll function would return a function
	if(processedString === false){
		finalString = inputString;
	}else{
		finalString = processedString;
	}
	Ti.API.info('updateQuote():' +  processedString);
	var db = Titanium.Database.open('iMemorizeDB');
	db.execute('UPDATE MYQUOTES SET QUOTE = "' + Titanium.Network.encodeURIComponent(finalString) + '", AUTHOR="' + Titanium.Network.encodeURIComponent(AddQuote.authorTxt.value) + '", SOURCE="' + Titanium.Network.encodeURIComponent(AddQuote.sourceTxt.value) +'", LANGUAGE="' + Titanium.App.Properties.getString("currQuoteLanguage_preference") + '", CHECKED = 0 WHERE QUOTE_ID = "' + Titanium.App.Properties.getString("quoteID_preference") + '"');
	db.close();
	Ti.API.info('finished updateQuote()');
	// set the action so we can fire the correct event
	AddQuote._action = AddQuote.ACTION_UPDATED;	
	AddQuote.buildSavedQuotes();
};

AddQuote.buildSavedQuotes = function(){
	Ti.API.info('buildSavedQuotes()');
	var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'savedQuotes.xml');
	
	if (!f.exists()) {
		Titanium.API.info("File " + f.name + " does not exist yet.");
	}
	
	Ti.API.info('writeable = ' + f.writeable);
	Ti.API.info('readonly = ' + f.readonly);
	
	var db = Titanium.Database.open('iMemorizeDB');
	var rows = db.execute('SELECT * FROM MYQUOTES');
	Titanium.API.info('ROW COUNT = ' + rows.getRowCount());
	var tempContent = '<?xml version="1.0" encoding="utf-8"?><quotes><section name="Saved Quotes">';
	Titanium.API.info("start rows.isValidRow()");
	while (rows.isValidRow()){
		Ti.API.info('The unique id is: ' + rows.fieldByName('quote_id'));
		tempContent += '<quote id=\'' + rows.fieldByName('quote_id') + '\'>' + 
		'<text>' + rows.fieldByName('quote') + '</text>' + 
		'<author>' + rows.fieldByName('author') + '</author>' + 
		'<reference>' + rows.fieldByName('source') + '</reference>' + 
		'<checked>' + rows.fieldByName('checked') + '</checked>' + 
		'<language>' + rows.fieldByName('language') + '</language>' + 
		'</quote>';
		Titanium.API.info('ID: ' + rows.field(0) + ' Quote: ' + rows.fieldByName('quote') + ' Language ' + rows.fieldByName('language'));
		rows.next();
	}
	Titanium.API.info("end rows.isValidRow()");
	tempContent += '</section></quotes>';
	rows.close();
	db.close();
	// now write the new xml file	
	f.write(tempContent);
	var contents = f.read();
	//Ti.API.info("NOW contents text = " + contents.text);
	// dispatch the event so that we update the variable in the main html game screen
	Titanium.App.fireEvent('myQuotesLoaded',{data:contents.text});	
	
	// if the action is add and memorize, then show the alert
	if(AddQuote._action != AddQuote.ACTION_ADD_AND_MEMORIZE){
		TiUtils.showAlertDialog('Done','Your quote has been saved.',['OK']);
	}	
	
	// fire the event based on the action so we can listen for it in the HTML
	Titanium.App.fireEvent(AddQuote._action,{data:contents.text});
	
	Ti.API.info('After edit / add _action: ' + AddQuote._action);
	
};



AddQuote.setLanguagePickerData = function(){
	Titanium.API.info('build the language data');
	AddQuote.languagePref = Titanium.App.Properties.getString("currQuoteLanguage_preference");
	Titanium.API.info('languagePref: ' + AddQuote.languagePref);
	//Titanium.API.info('language preference:' + languagePref);
	for(var i=0;i<AddQuote.languageArray.length;i++){
		var thisLang = AddQuote.languageArray[i];
		//var thisLangCode = languageCodeArray[i];
		Titanium.API.info('thisLang: ' + thisLang);
		
		if(AddQuote.languageArray[i]===AddQuote.languagePref){
			Titanium.API.info('!!!!COOL: set selected for this one');
			Titanium.App.Properties.setString("languageRowIndex_preference",i.toString());
			AddQuote.language_picker_data.push(Titanium.UI.createPickerRow({title:thisLang,selected:true}));
		}else{
			Titanium.API.info('Dont set selected for this one');
			AddQuote.language_picker_data.push(Titanium.UI.createPickerRow({title:thisLang}));
		}
	}
	Titanium.API.info('END build the language data');
};

AddQuote.resetInputFields = function(){	
	AddQuote.quoteTxt.value = AddQuote._quotePromptText;
	AddQuote.language_label.text = "Language";
	AddQuote.disableMemorizeNowButton();
	AddQuote.disableSaveButton();
};

AddQuote.resetLayout = function(){
	// if the orientation is portrait	
	if(TiUtils.isiPhone()){
		if(AddQuote._orientation===AddQuote.ORIENTATION_PORTRAIT){
			AddQuote.language_picker.top = 43;
		}else{
			AddQuote.language_picker.top = 32;
		}
	}
	AddQuote.enterQuoteWin.height = AddQuote._height;
	AddQuote.enterQuoteWin.width = AddQuote._width;
	AddQuote.toolBar.width = AddQuote._width;
	AddQuote.quoteTxt.width = AddQuote._width - AddQuote._textBoxMargin;
	AddQuote.authorTxt.width = AddQuote._width - AddQuote._textBoxMargin;
	AddQuote.sourceTxt.width = AddQuote._width - AddQuote._textBoxMargin;
	//AddQuote.drop_button.top = AddQuote.language_label.top + 3;
	//AddQuote.drop_button.left = AddQuote.language_label.width + AddQuote.language_label.left - AddQuote.drop_button.width - 4;
	AddQuote.drop_button.left = 225;
	AddQuote.languageInfo_label.left = 270;
	
	//AddQuote.languageInfo_label.left = AddQuote.language_label.width + AddQuote.language_label.left + 5;
	//AddQuote.addButton.left = (AddQuote._width - AddQuote.addButton.width) / 2;
	//AddQuote.memorizeNowButton.left = (AddQuote._width - AddQuote.memorizeNowButton.width) / 2;
	// now set the keyboard close button to the proper location based on orientation
	if(AddQuote.keyboardOpened){
		AddQuote.positionKeyboardButtonBar();
	}
};



// ******************************************


AddQuote.getQuote = function(){
	Ti.API.info('getQuote()');
	var quoteID = Titanium.App.Properties.getString("quoteID_preference");
	var db = Titanium.Database.open('iMemorizeDB');
	var quote = db.execute('SELECT * FROM MYQUOTES WHERE QUOTE_ID = "' + quoteID + '"');	
	Ti.API.info("Edit this quote = " + quote.fieldByName('quote'));
	var quoteFromDB = Titanium.Network.decodeURIComponent(quote.fieldByName('quote'));
	var quoteString;
	if(quoteFromDB.indexOf('<br/>')>-1){
		quoteString = quoteFromDB.replaceAll('<br/>','\n');
	}else{
		quoteString = quoteFromDB;
	}
	AddQuote.quoteText = quoteString;
	AddQuote.authorText = Titanium.Network.decodeURIComponent(quote.fieldByName('author'));
	AddQuote.sourceText = Titanium.Network.decodeURIComponent(quote.fieldByName('source'));
	AddQuote.quoteLanguage = Titanium.Network.decodeURIComponent(quote.fieldByName('language'));
	Titanium.App.Properties.setString("currQuoteLanguage_preference",AddQuote.quoteLanguage);
	db.close();
	AddQuote.addButtonText = "Save";
	AddQuote.labelText = "Edit Quote";	
};	




// ------- quoteTxt listeners

AddQuote.addEventListeners = function(){
	AddQuote.quoteTxt.addEventListener("focus",AddQuote.handleQuoteTxtFocus);
	AddQuote.quoteTxt.addEventListener("change", AddQuote.handleQuoteTxtChange);
	AddQuote.authorTxt.addEventListener("blur",AddQuote.handleAuthorTxtBlur);
	AddQuote.authorTxt.addEventListener("focus",AddQuote.handleAuthorTxtFocus);
	AddQuote.authorTxt.addEventListener("blur",AddQuote.handleAuthorTxtBlur);
	AddQuote.sourceTxt.addEventListener("focus",AddQuote.handleSourceTxtFocus);
	AddQuote.sourceTxt.addEventListener("blur",AddQuote.handleSourceTxtBlur);
	AddQuote.drop_button.addEventListener('click',AddQuote.handleDropButtonClick);
	AddQuote.done.addEventListener('click',AddQuote.handleDoneButtonClick);
	AddQuote.addButton.addEventListener("click",AddQuote.handleAddButtonClick);
	AddQuote.closeButton.addEventListener("click",AddQuote.handleCloseButtonClick);
	AddQuote.memorizeNowButton.addEventListener("click",AddQuote.handleMemorizeNowButtonClick);
	Ti.Gesture.addEventListener('orientationchange',AddQuote.orientationChangeListener);
	AddQuote.languageInfo_label.addEventListener('click', AddQuote.handleLanguageQuestionClick);
};


AddQuote.blurTextFields = function(){
	AddQuote.quoteTxt.blur();
	AddQuote.authorTxt.blur();
	AddQuote.sourceTxt.blur();
};


// event handlers


AddQuote.handleDropButtonClick = function(){
	Titanium.API.info('show the language dropdown');
	AddQuote.resetLayout();
	AddQuote.setLanguagePickerData();
	AddQuote.language_picker.add(AddQuote.language_picker_data);
	AddQuote.win.add(AddQuote.language_picker_view);
	AddQuote.language_picker.setSelectedRow(0,Number(Titanium.App.Properties.getString("languageRowIndex_preference")));
	AddQuote.language_picker_view.animate(AddQuote.slide_in);
	AddQuote.blurTextFields();
};

AddQuote.handleLanguageQuestionClick = function(){
	var alertDialog = Titanium.UI.createAlertDialog({
		title: 'Language Selection',
		message: 'The language selection allows the application to determine how your quote needs to be displayed. This includes texts like Arabic that display right to left instead of left to right, or if the quote requires any special characters.',
		buttonNames: ['Done']
	});
	alertDialog.show();
};
 

AddQuote.handleDoneButtonClick = function(){
	AddQuote.language_picker_view.animate(AddQuote.slide_out);
	Titanium.App.fireEvent('languageChanged',{data:AddQuote.language_picker.getSelectedRow(0).title});
	Titanium.App.Properties.setString("currQuoteLanguage_preference",AddQuote.language_picker.getSelectedRow(0).title);
	AddQuote.language_label.value = "Quote language: " + AddQuote.language_picker.getSelectedRow(0).title;
	AddQuote.setLanguagePickerData();
	//AddQuote.enterQuoteWin.scrollTo(0,0);
	AddQuote.resetLayout();
};


AddQuote.handleAddButtonClick = function(){
	Titanium.API.info("addButton clicked");
	AddQuote.win.title = "Saved quote";
	if(AddQuote.quoteTxt.value!=="" && AddQuote.quoteTxt.value !== AddQuote._quotePromptText){
		if(Titanium.App.Properties.getString("quoteEditAction_preference")=="edit"){
			Titanium.API.info("addButton clicked: updateQuote()");
			AddQuote.updateQuote();
		}else{
			Titanium.API.info("addButton clicked: enterQuote()");
			AddQuote.enterQuote();
		}
	}else{
		AddQuote.showAlertDialog('','Please enter a quote.',['OK']);		
	}
	AddQuote.blurTextFields();
};

AddQuote.handleCloseButtonClick = function(){
	Titanium.API.info("clicked close");
	//Titanium.App.fireEvent('closeAddQuote',{});	
	//AddQuote.blurTextFields();
	AddQuote.hideQuoteEditor();
};

AddQuote.handleMemorizeNowButtonClick = function(){
	// we call enterQuote and set the param to true -- meaning we want to save and memorize
	if (AddQuote.quoteTxt.value !== "" && AddQuote.quoteTxt.value !== AddQuote._quotePromptText) {
		AddQuote.enterQuote(true);
		AddQuote.handleCloseButtonClick();
	}
	else {
		TiUtils.showAlertDialog('', 'You must enter a quote before memorizing it. If you have already entered the quote you want to memorize, go to the Saved Quotes menu and select it from there', ['OK']);
	}
};

AddQuote.handleQuoteTxtFocus = function(){
	if(AddQuote.quoteTxt.value === AddQuote._quotePromptText){AddQuote.quoteTxt.value = '';}
	Titanium.API.info("focused on quoteTxt");
	AddQuote.showKeyboardButtonBar();
};

AddQuote.handleQuoteTxtChange = function(){
	if(AddQuote.quoteTxt.value !== "" && AddQuote.quoteTxt.value !== AddQuote._quotePromptText){
		AddQuote.enableMemorizeNowButton();
		AddQuote.enableSaveButton();
	}else{
		AddQuote.disableMemorizeNowButton();
		AddQuote.disableSaveButton();
	}
};

AddQuote.enableMemorizeNowButton = function(){
	AddQuote.memorizeNowButton.enabled = true;
	AddQuote.memorizeNowButton.opacity = 1;
};

AddQuote.disableMemorizeNowButton = function(){
	AddQuote.memorizeNowButton.enabled = false;
	AddQuote.memorizeNowButton.opacity = ".5";
};

AddQuote.enableSaveButton = function(){
	AddQuote.addButton.enabled = true;
	AddQuote.addButton.opacity = 1;
};

AddQuote.disableSaveButton = function(){
	AddQuote.addButton.enabled = false;
	AddQuote.addButton.opacity = ".5";
};

// ---------

AddQuote.handleAuthorTxtBlur =function(){
	Titanium.API.info("quoteTxt blur");
};


AddQuote.handleAuthorTxtFocus =function(){
	if(AddQuote.authorTxt.value === AddQuote._authorPromptText){AddQuote.authorTxt.value = '';}
	Titanium.API.info("authorText focus");
	AddQuote.showKeyboardButtonBar();
};

AddQuote.handleAuthorTxtBlur =function(){
	Titanium.API.info("authorText blur");
};



AddQuote.handleSourceTxtFocus = function(){
	if(AddQuote.sourceTxt.value === AddQuote._sourcePromptText){AddQuote.sourceTxt.value = '';}
	Titanium.API.info("sourceTxt focus");
	AddQuote.showKeyboardButtonBar();
};

AddQuote.handleSourceTxtBlur = function(){
	Titanium.API.info("sourceTxt blur :" + AddQuote.quoteTxt.value);
	AddQuote.resetLayout();
};

AddQuote.handleKeyboardButtonBarClick = function(e){
	AddQuote.blurTextFields();
	AddQuote.hideKeyboardButtonBar();
};

AddQuote.orientationChangeListener = function(e){
	AddQuote._width = Titanium.Platform.displayCaps.platformWidth;
	AddQuote._height = Titanium.Platform.displayCaps.platformHeight - AddQuote.iPhoneStatusBarHeight;
	AddQuote.setOrientation();
	AddQuote.resetLayout();
};

AddQuote.setOrientation = function(){
	AddQuote.currOrientation = Titanium.Gesture.orientation;
	if(AddQuote.currOrientation < 3){
		AddQuote._orientation = AddQuote.ORIENTATION_PORTRAIT;
	}else if(AddQuote.currOrientation < 5 && AddQuote.currOrientation >=3){
		AddQuote._orientation = AddQuote.ORIENTATION_LANDSCAPE;
	}
};

AddQuote.showKeyboardButtonBar = function(){
	Titanium.API.info("showKeyboardButtonBar()1");
	// only show this if its not iPad
	if(!TiUtils.isiPad() && !TiUtils.isAndroid()){
		if(!AddQuote.keyboardOpened){
			AddQuote.win.add(AddQuote.keyboardBtnBar);
			//AddQuote.keyboardBtnBar.addEventListener('click',AddQuote.handleKeyboardButtonBarClick);
			//AddQuote.keyboardBtnBar.opacity = 0;
			//if(AddQuote._orientation === AddQuote.ORIENTATION_PORTRAIT){
			//	AddQuote.keyboardBtnBar.bottom = AddQuote.KEYBOARD_BOTTOM_PORTRAIT;
			//}else{
			//	AddQuote.keyboardBtnBar.bottom = AddQuote.KEYBOARD_BOTTOM_LANDSCAPE;
			//}
			//AddQuote.keyboardBtnBar.animate(AddQuote.fade_in);
			AddQuote.positionKeyboardButtonBar();
			AddQuote.keyboardOpened = true;
		}
	}
	Titanium.API.info("showKeyboardButtonBar()2");
};

AddQuote.hideKeyboardButtonBar = function(){
	Titanium.API.info("AddQuote.hideKeyboardButtonBar");
	AddQuote.win.remove(AddQuote.keyboardBtnBar);
	AddQuote.keyboardOpened = false;
	AddQuote.resetLayout();
};

AddQuote.positionKeyboardButtonBar = function(){
	if(AddQuote._orientation === AddQuote.ORIENTATION_PORTRAIT){
		//alert("put keyboard toolbar here - portrait: " + AddQuote.KEYBOARD_BOTTOM_PORTRAIT);
		AddQuote.keyboardBtnBar.bottom = AddQuote.KEYBOARD_BOTTOM_PORTRAIT;
	}else{
		//alert("else put keyboard toolbar here - Landscape: " + AddQuote.KEYBOARD_BOTTOM_LANDSCAPE);
		AddQuote.keyboardBtnBar.bottom = AddQuote.KEYBOARD_BOTTOM_LANDSCAPE;
	}
	if(TiUtils.isAndroid()){
		AddQuote.keyboardBtnBar.top = 100;
	}
};

AddQuote.handleKeyboardClose = function(){
	AddQuote.blurTextFields();
	Titanium.API.info("handleKeyboardClose()");
	AddQuote.hideKeyboardButtonBar();
};

AddQuote.showAlertDialog = function(_title,_message,_buttonNames){
	var alertDialog = Titanium.UI.createAlertDialog({
		title: _title,
		message: _message,
		buttonNames: _buttonNames
	});	
	alertDialog.show();
};

// 

String.prototype.replaceAll = function(stringToFind,stringToReplace){
	var temp = this;
	var index = temp.indexOf(stringToFind);
	if(index>-1){
		while(index != -1){
			temp = temp.replace(stringToFind,stringToReplace);
			index = temp.indexOf(stringToFind);
		}
		return temp;
	}else{
		return false;
	}	
};

AddQuote.isLogogramLanguage = function(){
	var currLang = Titanium.App.Properties.getString("currQuoteLanguage_preference");
	currLang = currLang.toUpperCase();
	var isLogogramLang = false;
	if(currLang==="CHINESE" || currLang==="JAPANESE" || currLang==="KOREAN" || currLang==="VIETNAMESE"){
		isLogogramLang = true;
	}
	return isLogogramLang;
};

AddQuote.showQuoteEditor = function(){
	//alert('AddQuote.showQuoteEditor()');
	AddQuote.init();
	//AddQuote.win.visible = true;	
};

AddQuote.hideQuoteEditor = function(){
	AddQuote.win.close();
	App.showQuoteEditorInited = false;
	//AddQuote.win.visible = false;
	//AddQuote.enterQuoteWin.visible = false;
	//alert('addQuote.hideQuoteEditor --try this 3');
};


