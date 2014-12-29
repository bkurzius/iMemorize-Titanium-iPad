var Home = {
	
		inited: false,
		fontFamily: 'Helvetica Neue',	
		width: {},
		height: {},
		appVersionNumber: {},
		xhr: '',
		dontRemindVersionAlert: false,
		
		//platform Specific values
		buttonStyleHeight: 35,
		buttonStyleWidth: 200,
		logoHeight: 74,
		logoWidth: 74,
		toolbarHeight: 40,
		closeBtnHeight: 30,
		closeBtnTop: 5,
		marginTopPortrait: 60,
		marginTopLandscape: 10,
		orientationModes:{},

	
		win: {},
		logo: '',	
		HTML: {},
		uiWin: {},
		toolBar: {},
		startBtn: {},
		enterQuoteBtn: {},
		instructionsBtn: {},
		aboutBtn: {},
		
		buttonGradient: {
			type:'linear',
			colors:['#888888','#000001'],
			startPoint:{x:0,y:0},
			endPoint:{x:0,y:40},
			backFillStart:false
		},

		closeButtonGradient: {
			type:'linear',
			colors:['#FEFEFE','#898989'],
			startPoint:{x:0,y:0},
			endPoint:{x:0,y:50},
			backFillStart:false
		},

		uiWindowGradient: {
			type:'linear',
			colors:['#888888','#000001'],
			startPoint:{x:0,y:0},			
			backFillStart:false
		},

		toolbarGradient: {
			type:'linear',
			colors:['#888888','#000001'],
			startPoint:{x:0,y:0},
			endPoint:{x:0,y:60},
			backFillStart:false
		},

		buttonStyle: {
			width:200,
			height:40,
			borderRadius:10,		
			backgroundSelectedImage: "../images/black-bg.png",
			borderWidth: 1,
			borderColor: '#666'
		}
		

	
};




Home.init = function(){
	//alert('TiUtils.osName: ' + TiUtils.getOsName());
	Home.win = Ti.UI.createWindow({
		layout:"vertical",
		backgroundColor: "#662211",
		backgroundImage: "images/" + TiUtils.getOsName() + "-images/bg.png",
			statusBarStyle : Titanium.UI.iPhone.StatusBar.LIGHT_CONTENT,
	fullscreen : true

	});
	Home.width = Titanium.Platform.displayCaps.platformWidth;
	Home.height = Titanium.Platform.displayCaps.platformHeight;
	Home.appVersionNumber = Titanium.App.Properties.getString("appVersionNumber_preference");
	Home.orientationModes = [ 
		Titanium.UI.LANDSCAPE_LEFT,
		Titanium.UI.LANDSCAPE_RIGHT,
		Titanium.UI.PORTRAIT,
		Titanium.UI.UPSIDE_PORTRAIT
	];
	Home.uiWindowGradient.endPoint = {x:0,y:Home.height};
	Home.buttonStyle.backgroundGradient = Home.buttonGradient;
	Home.buttonStyle.font = {fontSize:16,fontFamily:Home.fontFamily,fontWeight:'bold'};		
	Home.checkVersion();
		Home.buttonStyleHeight = 45;
		Home.buttonStyleWidth = 300;
		Home.marginTopPortrait = 300;
		Home.marginTopLandscape = 200;
		Home.logoHeight = 100;
	Home.draw();
};

Home.draw = function(){
	var osname = Ti.Platform.osname;
	Titanium.API.info("home build 1");
	
	Home.logo = Ti.UI.createImageView({
		image: 'images/' + TiUtils.getOsName() + '-images/logo.png',
		height:Home.logoHeight,
		width: Home.logoHeight
	});
	Home.startBtn = Ti.UI.createButton({
		borderRadius:10,
		font:{fontSize:16,fontFamily:AddQuote._fontFamily,fontWeight:'bold'}
	});
	Home.startBtn.title = 'Choose Quote';
	Home.startBtn.height = Home.buttonStyleHeight;
	Home.startBtn.width = Home.buttonStyleWidth;
	Home.startBtn.top = 5;
	
	Home.enterQuoteBtn = Ti.UI.createButton({
		borderRadius:10,
		font:{fontSize:16,fontFamily:AddQuote._fontFamily,fontWeight:'bold'}
	});
	Home.enterQuoteBtn.title = 'Enter your own quote';
	Home.enterQuoteBtn.height = Home.buttonStyleHeight;
	Home.enterQuoteBtn.width = Home.buttonStyleWidth;
	Home.enterQuoteBtn.top = 5;	
	
	Home.instructionsBtn = Ti.UI.createButton({
		borderRadius:10,
		font:{fontSize:16,fontFamily:AddQuote._fontFamily,fontWeight:'bold'}
	});
	Home.instructionsBtn.title = 'Instructions';
	Home.instructionsBtn.height = Home.buttonStyleHeight;
	Home.instructionsBtn.width = Home.buttonStyleWidth;
	Home.instructionsBtn.top = 5;
	
	Home.aboutBtn = Ti.UI.createButton({
		borderRadius:10,
		font:{fontSize:16,fontFamily:AddQuote._fontFamily,fontWeight:'bold'}
	});
	Home.aboutBtn.title = 'About';
	Home.aboutBtn.height = Home.buttonStyleHeight;
	Home.aboutBtn.width = Home.buttonStyleWidth;
	Home.aboutBtn.top = 5;
	

		Home.startBtn.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
		Home.enterQuoteBtn.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
		Home.instructionsBtn.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
		Home.aboutBtn.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
		Home.startBtn.backgroundGradient = Home.buttonGradient;
		Home.enterQuoteBtn.backgroundGradient =  Home.buttonGradient;
		Home.instructionsBtn.backgroundGradient =  Home.buttonGradient;
		Home.aboutBtn.backgroundGradient =  Home.buttonGradient;

	
	Home.win.add(Home.logo);
	Home.win.add(Home.startBtn);
	Home.win.add(Home.enterQuoteBtn);
	Home.win.add(Home.instructionsBtn);
	Home.win.add(Home.aboutBtn);
	
	Home.setListeners();
	Home.setLayout();
	Home.win.open();
};

Home.showHome = function(){
	Home.init();
	//Home.win.visible = true;
};

Home.hideHome = function(){
	Home.win.close();
};

Home.setLayout = function(){
	Titanium.API.info("Titanium.UI.orientation:" + TiUtils.getOrientation());
	if(TiUtils.getOrientation()==="portrait"){
		Home.logo.top = Home.marginTopPortrait;
	}else{
		Home.logo.top = Home.marginTopLandscape;
	}
	Home.startBtn.top = 5;
	Home.enterQuoteBtn.top = 5;
	Home.instructionsBtn.top = 5;
	Home.aboutBtn.top = 5;
};

Home.resetLayout = function(){
	Titanium.API.info("Home resetLayout");
	if(TiUtils.getOrientation()==="portrait"){
		Home.logo.top = Home.marginTopPortrait;
	}else{
		Home.logo.top = Home.marginTopLandscape;
	}
	Home.startBtn.top = 5;
	Home.enterQuoteBtn.top = 5;
	Home.instructionsBtn.top = 5;
	Home.aboutBtn.top = 5;
	Home.win.height = Titanium.Platform.displayCaps.platformHeight-20;
	Home.win.width = Titanium.Platform.displayCaps.platformWidth;
	Home.uiWin.height = Titanium.Platform.displayCaps.platformHeight-20;
	Home.uiWin.width = Titanium.Platform.displayCaps.platformWidth;
	Home.HTML.height = Titanium.Platform.displayCaps.platformHeight-20;
	Home.HTML.width = Titanium.Platform.displayCaps.platformWidth;
	Home.toolBar.width = Titanium.Platform.displayCaps.platformWidth;
};


Home.setListeners = function(){
	Home.startBtn.addEventListener('click',Home.startBtnClickListener);
	Home.enterQuoteBtn.addEventListener('click',Home.enterQuoteBtnClickListener);
	Home.instructionsBtn.addEventListener('click',Home.showInstructions);
	Home.aboutBtn.addEventListener('click',Home.showAbout);
	//Titanium.Gesture.addEventListener('orientationchange',Home.resetLayout);
	Ti.App.addEventListener('orientationChangeEvent', Home.resetLayout);
};

Home.startBtnClickListener = function(){
	//alert('choose');
	Titanium.App.fireEvent("showQuoteSelector",{});
};

Home.enterQuoteBtnClickListener = function(){
	//alert('enter');
	Titanium.App.fireEvent("enterQuote",{});
};


Home.showInstructions = function(){
	//alert('instructions');
	Home.showUIWin('instructions.html');
};

Home.showAbout = function(){
	//alert('about');
	Home.showUIWin('about.html');
};

Home.showUIWin = function(_url){
	Titanium.API.info("openUiWindow()");
	Home.htmlWin = Titanium.UI.createWindow({
		height:TiUtils.getAppHeight()
	});
	Home.HTML = Ti.UI.createWebView({
		url:_url,
		top:Home.toolbarHeight,
		width:Home.width,
		height:Home.height-Home.toolbarHeight
	});

	Home.HTML.orientationModes = Home.orientationModes;
	Home.toolBar = Ti.UI.createView({
		width:Home.width,
		height:Home.toolbarHeight,
		top:0,
		backgroundColor:'#000000',
	});
	var closeBtn = Ti.UI.createButton({
		title: 'Close',
		width: 100,
		height: Home.closeBtnHeight,
		top: Home.closeBtnTop,
		backgroundGradient: Home.closeButtonGradient,
		borderRadius: 10,
		color: '#545454',
		font: {fontSize:16,fontFamily:Home.fontFamily,fontWeight:'bold'}
	});
	if (TiUtils.isIos()) {
		closeBtn.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
	}
	
	closeBtn.addEventListener('click',function(){
		
		Home.hideUIWin();
		
	});
	Home.toolBar.add(closeBtn);

	Home.htmlWin.add(Home.HTML);
	Home.htmlWin.add(Home.toolBar);
	Home.htmlWin.open();

};

Home.hideUIWin = function(){
	Home.htmlWin.close();
};

// checks version of the app from the live site and display a dialog to notify the user if there is an update available
Home.checkVersion = function(){
	Home.xhr = Ti.Network.createHTTPClient();
	Home.xhr.open("GET","http://www.imemorize.org/app_configs/" + TiUtils.getOsName() + "Config.xml");
	Titanium.API.info('checkVersion()1');
	Home.xhr.onload = function(){
		Titanium.API.info('xhr.onload()1');
		var doc = this.responseXML.documentElement;
		var latestVersionNumber = doc.evaluate("//config/versionNumber/text()").item(0).nodeValue;
		var latestVersionDetails = doc.evaluate("//config/latestVersionDetails/text()").item(0).nodeValue;
		Titanium.API.info('xhr.onload()2');
		// if the version numbers are not the same then we remind them to update it
		try{
			if(latestVersionNumber !== Home.appVersionNumber){
				Titanium.API.info('xhr.onload()3');
				if(Titanium.App.Properties.getString("dontRemindMeVersion" + Home.appVersionNumber + "_preference")!=='true'){
					var alertDialog = Titanium.UI.createAlertDialog({
						title: 'New Version Available',
						message: latestVersionDetails,
						buttonNames: ['OK','Cancel','Don\'t remind me again']
					});	
					alertDialog.show();
					alertDialog.addEventListener('click', function(e){
						var versionAction;
						if(e.index===0){
							versionAction = 'Download now!';
						}else if(e.index === 2){
							Home.dontRemindVersionAlert = true;
							versionAction = 'don\'t remind me';
							Titanium.App.Properties.setString("dontRemindMeVersion" + Home.appVersionNumber + "_preference",'true');
						};
						Titanium.API.info(versionAction);
					});
				}
				Titanium.API.info('xhr.onload()4');
			}else{
				Titanium.API.info("Version is up to date.");
			}
		}catch(err){
			Titanium.API.info('error in checkVersion function' );
		}
	};
	Home.xhr.send();

};
