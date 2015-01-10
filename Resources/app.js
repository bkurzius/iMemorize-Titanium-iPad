Ti.include("scripts/TiUtils.js");
Ti.include("screens/home.js");
Ti.include("screens/settingsMenu.js");
Ti.include("screens/editMenu.js");
Ti.include("addQuote.js");

var mainWindow = Ti.UI.createWindow({
	backgroundColor : '#000',
	backgroundImage : 'images/bg.png',
	statusBarStyle : Titanium.UI.iPhone.StatusBar.LIGHT_CONTENT,
	fullscreen : true
});

var App = {
	// data
	data : {
		showQuoteEditorInited : false,
		iphoneVersionNumber : '1.1',
		ipadVersionNumber : '1.0',
		androidVersionNumber : '0.96',

		ACTION_DELETED : "QuoteDeleted",
		ACTION_LOADED : "QuotesLoaded",
		currentQuote : {},
		iPhoneStatusBarHeight : 0,
		width : 1,
		height : 1,
		currMode : "chooser",

		orientation : "portrait",
		action : '',
		uiWinOpen : '',
		orientationModes : [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT, Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT],
		inited : false,
		memorizedQuotesArray : [],

		//platform specific values
		quoteFontSize : 20,
		buttonbarHeight : 50,
		toolbarHeight : 40,
		closeBtnHeight : 30,
		previousQuoteText : "<",
		nextQuoteText : ">",
		uiWindowBgImage : 'images/iphone-images/bg.png'

	},
	// ui
	ui : {
		// ui
		quoteWin : {},
		webview : {},
		buttonbar : {},
		buttonbarView : {},
		uiWin : {},
		htmlWin : {},
		settingsMenu : {},
		editMenu : {},
		prevQuoteBtn : {},
		nextQuoteBtn : {},
		hideWordsBtn : {},
		showAllWordsBtn : {}
	},
	//styles
	styles : {
		// styles
		fontFamily : 'Helvetica Neue',
		buttonGradient : {
			type : 'linear',
			//colors:['#888888','#000001'],
			//colors:['#C4D607','#5A7104'],
			colors : ['#FEFEFE', '#898989'],
			startPoint : {
				x : 0,
				y : 0
			},
			endPoint : {
				x : 2,
				y : 50
			},
			backFillStart : false
		},

		toobarGradient : {
			type : 'linear',
			//colors:['#B4D109','#8DA701'],
			colors : ['#888888', '#000001'],
			startPoint : {
				x : 0,
				y : 0
			},
			endPoint : {
				x : 2,
				y : 60
			},
			backFillStart : false
		}
	},
	// functions
	//openUiWindow: {},
	//closeUIWindow: {}
	init : function() {
		Ti.API.info('init1');

		App.data.width = Ti.Platform.displayCaps.platformWidth;
		if (TiUtils.isAndroid()) {
			App.data.height = Ti.Platform.displayCaps.platformHeight;
			Ti.App.Properties.setString("appVersionNumber_preference", App.data.androidVersionNumber);
		} else {
			App.data.height = Ti.Platform.displayCaps.platformHeight;
		}

		// Declare orientation modes
		Ti.App.Properties.setString("currMode_preference", "chooser");
		mainWindow.orientationModes = App.data.orientationModes;
		Ti.API.info('init2');
		// set version number
		// set platform specific values
		if (TiUtils.isiPhone()) {
			Ti.App.Properties.setString("appVersionNumber_preference", App.data.iphoneVersionNumber);
		}

			App.data.quoteFontSize = 30;
			App.data.buttonbarHeight = 80;
			App.data.toolbarHeight = 60;
			App.data.closeBtnHeight = 40;
			App.data.previousQuoteText = "< Previous Quote";
			App.data.nextQuoteText = "Next Quote >";
			Ti.App.Properties.setString("appVersionNumber_preference", App.data.ipadVersionNumber);
			App.data.uiWindowBgImage = 'images/ipad-images/bg.png';

		Ti.App.Properties.setString("fontSize_preference", App.data.quoteFontSize);
		Ti.App.Properties.setString("currQuoteLanguage_preference", "English");
		Ti.App.Properties.setString("languageRowIndex_preference", "5");
		Ti.UI.setBackgroundColor('#000');
		App.draw();
		
		var GA = require("analytics.google");
		App.GATracker = GA.getTracker("UA-2194207-12");
		App.GATracker.trackScreen({
  			 screenName: "home"
		});

	}
};

Ti.API.info('start');

App.draw = function() {
	mainWindow.open();
	App.ui.webview = Ti.UI.createWebView({
		url : 'index.html',
		disableBounce : true
	});

	App.ui.buttonbar = Ti.UI.createButtonBar({
		id : 'buttonbar',
		height : App.data.buttonbarHeight,
		labels : [App.data.previousQuoteText, 'Hide Words', 'Show All', App.data.nextQuoteText],
		backgroundColor : '#AAAAAA',
		style : Ti.UI.iPhone.SystemButtonStyle.BAR
	});

	this.setListeners();
	App.showHome();
	mainWindow.add(App.ui.webview);
	mainWindow.backgroundImage = '';

};

//*
App.setListeners = function() {
	// --------- listeners ---------

	// only good for iOS - android needs a custom button bar
	App.ui.buttonbar.addEventListener('click', App.handleButtonbarClick);

	//
	Ti.App.addEventListener('showGame', App.handleTitaniumShowGame);
	Ti.App.addEventListener('hideGame', App.handleTitaniumHideGame);
	Ti.App.addEventListener('showHome', App.showHome);
	Ti.App.addEventListener('addQuote', App.handleTitaniumAddQuote);
	Ti.App.addEventListener('closeAddQuote', App.handleTitaniumCloseAddQuote);
	Ti.App.addEventListener('editQuote', App.handleTitaniumEditQuote);
	Ti.App.addEventListener('enterQuote', App.handleTitaniumEnterQuote);
	Ti.App.addEventListener('appLoaded', App.handleTitaniumAppLoaded);
	Ti.App.addEventListener('setCurrentQuote', App.handleTitaniumSetCurrentQuote);
	Ti.App.addEventListener('openQuoteURL', App.handleTitaniumOpenQuoteURL);
	Ti.App.addEventListener('memorizedArrayChange', App.handleTitaniumMemorizedArrayChange);
	Ti.App.addEventListener('fireAlert', App.handleTitaniumFireAlert);
	Ti.App.addEventListener('closeInstructions', App.handleTitaniumCloseInstructions);
	Ti.App.addEventListener('AddAndMemorize', App.handleSaveAndMemorize);
	Ti.App.addEventListener('emailQuoteEvent', App.emailQuote);
	Ti.App.addEventListener('copyQuoteEvent', App.copyQuoteToClipboard);
	Ti.App.addEventListener('closeEditMenuEvent', App.closeEditMenu);
	Ti.App.addEventListener('trackScreen', App.trackScreen);
	Ti.App.addEventListener('trackChooseCategoryEvent', App.trackChooseCategoryEvent);
	Ti.App.addEventListener('trackMemorizeEvent', App.trackMemorizeEvent);
	Ti.App.addEventListener('showQuoteEditorEvent', function() {
		Ti.API.info('>>>>>showQuoteEditorEvent fired');
		App.showQuoteEditor();
	});
	Ti.App.addEventListener('deleteQuoteEvent', App.deleteQuote);
	Ti.App.addEventListener('sendFeedback', App.showEmailUsDialog);
	Ti.App.addEventListener('showQuoteSelector', App.showQuoteSelector);
	Ti.Network.addEventListener('change', App.handleTitaniumNetworkChange);
	Ti.Gesture.addEventListener('orientationchange', App.handleTitaniumOrientationChange);

};

Ti.API.info('start2');
// --------- functions -------------


App.trackChooseCategoryEvent = function(e){
	Ti.API.info("trackChooseCategoryEvent: data:"  + e.data);
	Ti.API.info("trackChooseCategoryEvent: data:stringify"  + JSON.stringify(e.data));
	var str = JSON.stringify(e.data);
		App.GATracker.trackEvent({
  			category: "chooseCategory",
 		 	label: str
		});		
};
App.trackMemorizeEvent = function(e){
	var str = JSON.stringify(e.data);
	Ti.API.info("trackMemorizeEvent: str:" + str);
		App.GATracker.trackEvent({
  			category: "memorize",
 		 	label: str
		});		
};
App.trackScreen = function(e){
	var str = JSON.stringify(e.data);
	Ti.API.info("trackScreen: str:" + str);
		App.GATracker.trackScreen({
  			screenName: str
		});		
};


App.showQuoteSelector = function() {
	App.ui.webview.visible = true;
	Home.hideHome();
};

App.updateLayout = function() {
	Ti.API.info("updateLayout: App.data.currMode: " + App.data.currMode);

	var tempHeight = TiUtils.getAppHeight();
	var tempWidth = TiUtils.getAppWidth();
	Ti.API.info('App.data.width: ' + tempWidth);
	Ti.API.info('App.data.height: ' + tempHeight);
	// set the UI elements
	// currMode is chooser then we just set the webview
	// if the currMode is "game" then we set both the webview and the position of the buttonbar
	//*
	try {
		if (App.data.currMode == "chooser") {
			App.ui.webview.height = tempHeight;
		} else {
			App.ui.webview.height = tempHeight - App.ui.buttonbar.height;
			App.ui.buttonbar.top = App.ui.webview.height;
		}
		App.ui.uiWin.height = tempHeight;
		App.ui.uiWin.width = tempWidth;
		App.ui.htmlWin.height = tempHeight;
		App.ui.htmlWin.width = tempWidth;
	} catch(e) {
		Ti.API.info("error in the setting");
	}
	App.ui.webview.top = 0;
	// */
	Ti.API.info("updateLayout2");

};

App.showQuoteEditor = function() {
	if (!App.showQuoteEditorInited) {
		Ti.API.info("===========showQuoteEditor()");
		AddQuote.showQuoteEditor();
		Home.hideHome();
	}
	App.showQuoteEditorInited = true;
};

App.hideQuoteEditor = function() {
	AddQuote.hideQuoteEditor();
	App.showQuoteEditorInited = false;

};

App.showInstructions = function() {
	App.openUiWindow('instructions.html', true, true);
};

App.showAbout = function() {
	App.openUiWindow('about.html', true, true);
};

App.showHome = function() {
	Ti.API.info('showhome1');
	App.ui.webview.visible = false;
	Home.showHome();
};

Ti.API.info('start3');

App.openUiWindow = function(_url, _closeBtn, _html) {
	Ti.API.info("openUiWindow()");
	var tempHeight = TiUtils.getAppHeight();
	var tempWidth = TiUtils.getAppWidth();
	App.data.uiWinOpen = true;
	if (_html) {
		App.ui.htmlWin = Ti.UI.createWebView({
			url : _url,
			width : tempWidth,
			height : tempHeight
		});
	} else {
		App.ui.htmlWin = Ti.UI.createWindow({
			url : _url,
			width : tempWidth,
			height : tempHeight,
			backgroundImage : App.data.uiWindowBgImage,
			statusBarStyle : Titanium.UI.iPhone.StatusBar.LIGHT_CONTENT,
			fullscreen : true

		});
		App.ui.htmlWin.open();
	}
	Ti.API.info("openUiWindow()2");
	App.ui.uiWin = Ti.UI.createView({
		backgroundColor : '#000000',
		width : tempWidth,
		height : tempHeight
	});
	App.ui.htmlWin.orientationModes = App.data.orientationModes;
	if (_closeBtn) {
		App.ui.htmlWin.top = 40;
		App.ui.htmlWin.height = App.data.height - 40;
		var toolBar = Ti.UI.createView({
			width : App.data.width,
			height : App.data.toolbarHeight,
			top : 0,
			backgroundGradient : App.styles.toobarGradient,
			borderWidth : 1,
			borderColor : '#666'
		});
		var closeBtn = Ti.UI.createButton({
			title : 'Close',
			width : 100,
			height : App.data.closeBtnHeight,
			top : 5,
			style : Ti.UI.iPhone.SystemButtonStyle.PLAIN,
			backgroundGradient : App.styles.buttonGradient,
			borderRadius : 10,
			color : '#545454',
			font : {
				fontSize : 16,
				fontFamily : App.styles.fontFamily,
				fontWeight : 'bold'
			}
		});

		closeBtn.addEventListener('click', function() {
			try {
				mainWindow.remove(App.ui.uiWin);
			} catch(e) {
				Ti.API.info('houston we have a problem');
			}

		});
		toolBar.add(closeBtn);
		App.ui.uiWin.add(toolBar);
	}
	App.ui.uiWin.add(App.ui.htmlWin);
	App.ui.uiWin.backgroundImage = App.data.uiWindowBgImage;
};

App.closeUIWindow = function() {
	Ti.API.info('closeUIWindow()1');
	if (App.data.uiWinOpen) {
		mainWindow.remove(App.ui.uiWin);
	}
	App.data.uiWinOpen = false;
	Ti.API.info('closeUIWindow()2');
};

App.openSettingsMenu = function() {
	Titanium.API.info('openSettingsMenu()');
	SettingsMenu.showSettings();
};

// ---- EDIT Menu

App.openEditMenu = function() {
	Titanium.API.info('openEditMenu()');
	EditMenu.showMenu();
};

App.closeEditMenu = function() {
	//alert('close the edit menu');
	EditMenu.hideMenu();
};

App.deleteQuote = function() {
	//alert('delete quote');
	App.data.action = App.data.ACTION_DELETED;
	var id = App.data.currentQuote.id;
	// open the database
	var db = Ti.Database.open('iMemorizeDB');
	var startNumRows = db.execute('SELECT * FROM MYQUOTES WHERE QUOTE_ID = "' + id + '"');
	Ti.API.info('Start ROW COUNT = ' + startNumRows.getRowCount());
	db.execute('DELETE FROM MYQUOTES WHERE QUOTE_ID = "' + id + '"');
	startNumRows = db.execute('SELECT * FROM MYQUOTES WHERE QUOTE_ID = "' + id + '"');
	Ti.API.info('End ROW COUNT = ' + startNumRows.getRowCount());
	db.close();
	App.buildSavedQuotes();
	//handleEditDoneBtnClick();
	App.removeIdFromMemorizedArray(id);
	TiUtils.showAlertDialog('Done', 'The quote has been deleted', ['OK']);
};

App.loadQuotes = function() {
	App.data.action = App.data.ACTION_LOADED;
	this.buildSavedQuotes();
};

App.buildSavedQuotes = function() {
	Ti.API.info('buildSavedQuotes()');
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'savedQuotes.xml');

	if (!f.exists()) {
		Ti.API.info("File " + f.name + " does not exist yet.");
	}

	Ti.API.info('writeable = ' + f.writeable);
	Ti.API.info('readonly = ' + f.readonly);

	var db = Ti.Database.open('iMemorizeDB');
	var rows = db.execute('SELECT * FROM MYQUOTES');
	Ti.API.info('ROW COUNT = ' + rows.getRowCount());
	var tempContent = '<?xml version="1.0" encoding="utf-8"?><quotes><section name="Saved Quotes">';
	while (rows.isValidRow()) {
		// replace any end \n so old errors are fixed
		// var quote = rows.fieldByName('quote');
		// quote = quote.replaceAll('<br/> ','\n');
		// quote = quote.replace(/^\s+|\s+$/g, '');
		// quote = quote.replaceAll('\n','<br/> ');		
		// tempContent += '<quote id=\'' + rows.fieldByName('quote_id') + '\'>' + '<text>' + quote + '</text>' + '<author>' + rows.fieldByName('author') + '</author>' + '<reference>' + rows.fieldByName('source') + '</reference>' + '<language>' + rows.fieldByName('language') + '</language>' + '<checked>' + rows.fieldByName('checked') + '</checked>' + '</quote>';
		// Ti.API.info('ID: ' + rows.field(0) + ' Quote: ' + rows.fieldByName('quote') + ' Language ' + rows.fieldByName('language'));
				// replace any end \n so old errors are fixed
		
		var q = rows.fieldByName('quote');
		Ti.API.info("contents text quote= " + q);
		// q = q.replaceAll('<br/> ','\n');
		// if(q.indexOf('\n')>-1){
			// //quoteString = quoteString.replace(/^\s+|\s+$/g, '');
			// q = q.replace(/^\s+|\s+$/g, '');
		// }
		// q = q.replaceAll('\n','<br/> ');
		tempContent += '<quote id=\'' + rows.fieldByName('quote_id') + '\'>' + '<text>' + q + '</text>' + '<author>' + rows.fieldByName('author') + '</author>' + '<reference>' + rows.fieldByName('source') + '</reference>' + '<language>' + rows.fieldByName('language') + '</language>' + '<checked>' + rows.fieldByName('checked') + '</checked>' + '</quote>';

		
		rows.next();
	}
	tempContent += '</section></quotes>';
	rows.close();
	db.close();
	// now write the new xml file
	f.write(tempContent);
	var contents = f.read();
	Ti.API.info("NOW contents text = " + contents.text);
	Ti.App.fireEvent(App.data.action, {
		data : contents.text
	});
};

Ti.API.info('start4');

// --------- event handlers ----------

App.handleButtonbarClick = function(e) {
	if (e.index === 0) {
		Ti.App.fireEvent('loadPrevQuote', {});
	}
	if (e.index === 1) {
		Ti.App.fireEvent('hideWords', {});
	}
	if (e.index === 2) {
		Ti.App.fireEvent('showAllWords', {});
	}
	if (e.index === 3) {
		Ti.App.fireEvent('loadNextQuote', {});
	}
};

App.handleTitaniumShowGame = function(e) {
	App.data.currMode = "game";
	Ti.App.Properties.setString("currMode_preference", "game");
	App.showGameButtons();
	App.updateLayout();
	Ti.API.info("showGame");
	// this is a HACK to resolve a bug that did not update the layout properly when the app switched
	//between the memorize screen to the choose quotes
	setTimeout(App.updateLayout, 100);
};

App.handleTitaniumFireAlert = function(e) {
	TiUtils.showAlertDialog(e.title, e.text, e.buttons);
};

App.handleTitaniumHideGame = function(e) {
	Ti.API.info("hideGame");
	App.data.currMode = "chooser";
	Ti.App.Properties.setString("currMode_preference", "chooser");
	try {
		Ti.API.info("buttonbar: " + App.ui.buttonbar);
		Ti.API.info("inside hideGame try block");
		//win.remove(buttonbar);
		App.hideGameButtons();

	} catch (f) {
		Ti.API.info("could not remove button bar");
	}
	App.updateLayout();

	// this is a HACK to resolve a bug that did not update the layout properly when the app switched
	//between the memorize screen to the choose quotes
	setTimeout(App.updateLayout, 100);
};

App.handleTitaniumAddQuote = function(e) {
	Ti.API.info("addQuote");
	Ti.App.Properties.setString("quoteEditAction_preference", "add");
	App.openSettingsMenu();
};

App.handleTitaniumCloseAddQuote = function(e) {
	Ti.API.info("closeAddQuote");
	//AddQuote.hideQuoteEditor();
};

App.handleTitaniumEditQuote = function(e) {
	Ti.API.info('editQuote ID: ' + e.data);
	Ti.App.Properties.setString("quoteID_preference", e.data);
	Ti.App.Properties.setString("quoteEditAction_preference", "edit");
	///showQuoteEditor();
	App.openEditMenu();
};

App.handleTitaniumEnterQuote = function() {
	Ti.API.info(">>>>>>>>>>App.handleTitaniumEnterQuote");
	Ti.App.Properties.setString("quoteEditAction_preference", "add");
	//openEditMenu();
	App.ui.webview.visible = true;
	App.showQuoteEditor();
	//closeUIWindow();
};

App.handleTitaniumAppLoaded = function(e) {
	Ti.API.info(">>>>>>>>>>appLoaded");
	// open the database
	var db = Ti.Database.open('iMemorizeDB');
	//db.execute('DROP TABLE MYQUOTES');
	db.execute('CREATE TABLE IF NOT EXISTS MYQUOTES (ID INTEGER PRIMARY KEY AUTOINCREMENT, QUOTE_ID TEXT, QUOTE TEXT, AUTHOR TEXT, SOURCE TEXT, LANGUAGE TEXT, CHECKED INTEGER)');
	db.close();
	// close db when you're done to save resources
	App.loadQuotes();
	App.sendMemorizedArray();
	if (App.data.inited) {
		App.closeUIWindow();

	}
	App.data.inited = true;
	// fire off whether we are connect to the internet so we can either show or not show the links
	// since the app crashes when a user tries to connect to a link but cannot
	var tmpOnline = Ti.Network.online;
	Ti.App.fireEvent('networkOnline', {
		online : tmpOnline
	});
};

// this sets the current quote so if a user wants to email it they can....
App.handleTitaniumSetCurrentQuote = function(e) {
	App.data.currentQuote = e.data;
};

// this is called by the reference and tells the app to open the quote URL
App.handleTitaniumOpenQuoteURL = function() {
	//alert('handleTitaniumOpenQuoteURL(): ' + currentQuote.url);
	Ti.Platform.openURL(App.data.currentQuote.url);
};

App.handleTitaniumMemorizedArrayChange = function(e) {
	Ti.API.info("MemorizedArrayChange: " + e.data);
	App.data.memorizedQuotesArray = e.data;
	App.saveMemorizedQuotes();
};

App.handleSaveAndMemorize = function() {
	App.closeUIWindow();
};

App.saveMemorizedQuotes = function() {
	Ti.API.info("App.saveMemorizedQuotes 1");
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'memorizedQuotes.txt');
	if (!f.exists()) {
		Ti.API.info("File " + f.name + " does not exist yet.");
	}

	Ti.API.info('writeable = ' + f.writeable);
	Ti.API.info('readonly = ' + f.readonly);
	var tempContent = "";
	// now loop through the array and create a text file with comma delimited ids
	// and save it to the documents directory
	// this way the app can crash or be updated and the saved qoutes will be retained
	for (var i = 0; i < App.data.memorizedQuotesArray.length; i++) {
		Ti.API.info("App.saveMemorizedQuotes loop: " + i);
		tempContent = tempContent + App.data.memorizedQuotesArray[i];
		//only add the comma if it is not the last item in the array
		if (i < (App.data.memorizedQuotesArray.length - 1)) {
			tempContent = tempContent + ",";
		}
	}
	f.write(tempContent);
	Ti.API.info("here is revised memorized the text file: " + tempContent);
};

// this reads the memorized array file at app start and sends it to the html
App.sendMemorizedArray = function() {
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'memorizedQuotes.txt');
	if (!f.exists()) {
		Ti.API.info("File " + f.name + " does not exist yet.");
	} else {
		var contents = f.read();
		Ti.API.info("memorized quotes array = " + contents.text);
		Ti.App.fireEvent("MemorizedQuotesArraySent", {
			data : contents.text
		});
	}
};

App.handleTitaniumOrientationChange = function(e) {
	Ti.API.info("orientationchange: " + e.orientation);
	// device orientation
	// if less than 3 its in portrait mode
	if (TiUtils.isAndroid()) {
		App.data.height = TiUtils.getAppHeight();
	} else {
		App.data.height = TiUtils.getAppHeight();
	}
	App.data.width = TiUtils.getAppWidth();
	//- App.data.width;

	// if the orientation is portrait
	if (TiUtils.getOrientation() === "portrait") {
		App.data.orientation = "portrait";
	} else {
		App.data.orientation = "landscape";
	}

	Ti.API.info(" gesture App.data.currMode: " + App.data.currMode);

	App.updateLayout();
	Ti.App.fireEvent('orientationChangeEvent', {
		orientation : App.data.orientation
	});
};

App.handleTitaniumCloseInstructions = function() {
	Ti.API.info('closeInstructions');
};

App.handleTitaniumNetworkChange = function(e) {
	// fire off whether we are connect to the internet so we can either show or not show the links
	// since the app crashes when a user tries to connect to a link but cannot
	var tmpOnline = Ti.Network.online;
	Ti.App.fireEvent('networkOnline', {
		online : tmpOnline
	});
};

// the user can email the quote
App.emailQuote = function() {
	if (App.data.currMode == "game") {

		//alert("currentQuote.isSaved?: " + currentQuote.isSaved);
		// if the quote is a saved quote then send it to the server first
		// and pass control to the sendQuoteToServer() function
		// else - open the email dialog
		Titanium.API.info("emailQuote1");
		if (App.data.currentQuote.isSaved) {
			App.sendQuoteToServer(App.data.currentQuote.quote, App.data.currentQuote.author, App.data.currentQuote.reference, App.data.currentQuote.language);
		} else {

			App.showEmailQuoteDialog(App.data.currentQuote.id);
		}
	} else {
		TiUtils.showAlertDialog("Email Message", "You need to select a quote first in order to send it.", ['OK']);
	}
};

// send the quote to the server and ait for the returned id
App.sendQuoteToServer = function(_text, _author, _source, _language) {
	var client = Ti.Network.createHTTPClient();
	var data = {
		'text' : _text,
		'author' : _author,
		'source' : _source,
		'language' : _language
	};
	client.onload = function() {
		//alert(this.responseText);
		var id = this.responseText;
		// on a succesful response, call the showEmailQuoteDialog and pass the new id
		App.showEmailQuoteDialog(id);
	};
	client.onerror = function() {
		//alert('sorry, your request cannot be competed at this time');
		// if the send fails, call the showEmailQuoteDialog() and leave the id blank
		// this way the app knows not to include the quote memorize url
		App.showEmailQuoteDialog();
	};

	client.open("POST", "http://www.imemorize.org/insert_quote.php");
	client.send(data);
};

// open the email dialog
// if the id is passd then display the memorize url
// otherwise just send the quote and the download url
App.showEmailQuoteDialog = function(_quoteId) {
	Titanium.API.info("App.showEmailQuoteDialog()1");
	var myQuote = "";
	var thisQuote = App.data.currentQuote.quote;
	// create a regex that find the <br/> tag
	var regex = /<[^<>]+>/gi;
	thisQuote = thisQuote.replace(regex, "\n");
	Titanium.API.info("App.showEmailQuoteDialog()2");
	var introText = "I found this quote on iMemorize Mobile:\n\n";
	if (App.data.currentQuote.introText !== undefined) {
		myQuote = App.data.currentQuote.introText + "\n";
	}
	myQuote = myQuote + '"' + thisQuote + '" \n' + App.data.currentQuote.author + ' | ' + App.data.currentQuote.reference;
	var memorizeThisText = '\n\n Go here to memorize this quote: http://www.imemorize.org/lite/?id=' + _quoteId;
	var downloadText = '\n\n Go here to download the app: http://www.imemorize.org/download.html';
	var linkToMemorize = 'http://www.imemorize.org/getapp.html';
	var messageBody = introText + myQuote + memorizeThisText + downloadText;
	Titanium.API.info("App.showEmailQuoteDialog()3");
	if (_quoteId === undefined) {
		messageBody = introText + myQuote + downloadText;
	}
	Titanium.API.info("App.showEmailQuoteDialog()4");
	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.subject = "A quote from iMemorize Mobile";
	emailDialog.messageBody = messageBody;
	emailDialog.open();
	Titanium.API.info("App.showEmailQuoteDialog()5");
};

App.showEmailUsDialog = function() {
	var subjectLine = "Feedback regarding iMemorize for iPhone/iPod Touch";
	if (TiUtils.isiPad()) {
		subjectLine = "Feedback regarding iMemorize for iPad";
	}
	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.subject = subjectLine;
	emailDialog.messageBody = "";
	emailDialog.toRecipients = ["bkurzius@gmail.com"];
	emailDialog.open();
};

App.copyQuoteToClipboard = function() {
	if (App.data.currMode == "game") {
		var thisQuote = App.data.currentQuote.quote;
		var thisAuthor = App.data.currentQuote.author;
		var thisReference = App.data.currentQuote.reference;
		var regex = /<[^<>]+>/gi;
		thisQuote = thisQuote.replace(regex, "\n");
		var copyQuoteText = thisQuote + "\n" + thisAuthor + " | " + thisReference;
		Ti.UI.Clipboard.setText(copyQuoteText);
		Ti.API.info("copy the quote to the clipboard: " + copyQuoteText);
		TiUtils.showAlertDialog("Message", "The quote has now been copied to the clipboard.", ['OK']);
	} else {
		TiUtils.showAlertDialog("Message", "You need to select a quote first in order to copy it.", ['OK']);
	}
};

App.removeIdFromMemorizedArray = function(num) {
	if (App.isInMemorizedArray(num)) {
		Ti.API.info("isInMemorizedArray: true");
		for (var i = 0; i < App.data.memorizedQuotesArray.length; i++) {
			if (App.data.memorizedQuotesArray[i] === num) {
				App.data.memorizedQuotesArray.splice(i, 1);
			}
		}
	} else {
		Ti.API.info("isInMemorizedArray: false");
	}
	App.saveMemorizedQuotes();
};

//check to see if the item is in the memorized array
App.isInMemorizedArray = function(num) {
	for (var i = 0; i < App.data.memorizedQuotesArray.length; i++) {
		if (App.data.memorizedQuotesArray[i] === num) {
			return true;
		}
	}
	return false;
};

App.showGameButtons = function() {

	mainWindow.add(App.ui.buttonbar);
	App.ui.buttonbar.visible = true;

};

App.hideGameButtons = function() {

	Ti.API.info('hideGameButtons()');
	//mainWindow.remove(App.ui.buttonbar);
	App.ui.buttonbar.visible = false;
};

Ti.API.info('start5');
//*/
// start
App.init();
