/**
 * functions that operate on -- or are fired by -- the ui of the app
 */

// --------------- UIController functions -----------

var UIController = {
	
	
	
};

UIController.showQuoteSelector = function (){
    var menuPanel= Utils.getElement("menuPanel");
    Global.currMode = Global.CURR_MODE_QUOTE_SELECTOR;
    menuPanel.style.display = "block";
    $("#menuPanel").show();
    $('#quoteSelector').show();
};

UIController.hideQuoteSelector = function (){
    var menuPanel = Utils.getElement("menuPanel");
    $('#quoteSelector').hide();
    menuPanel.style.display = "none";
    $("#menuPanel").hide();
    $('#navBack').show();
};

UIController.showGame = function (){
    var gamePanelHeight = ($(window).height() - $("#gameWindow").height() - 40) + "px";
    Global.currMode = Global.CURR_MODE_GAME;
    UIController.hideQuoteSelector();
    UIController.hideBreadcrumb();
    $('#gamePanel').show();
    $('#gameWindow').show();
   	//$('#gamePanel').height(gamePanelHeight);
	//$('#gamePanel').height("200px");
    TitaniumUtils.titaniumFireEvent('showGame');
};

UIController.hideGame = function (){
    $('#gamePanel').hide();
    $('#gameWindow').hide();
    TitaniumUtils.titaniumFireEvent('hideGame');
};

UIController.showHome = function(){
    TitaniumUtils.titaniumFireEvent('showHome',{});
};

UIController.hideBreadcrumb = function(){
    $('#breadCrumb').hide();
};

UIController.showBreadcrumb = function(){
    $('#breadCrumb').show();
};

UIController.hideSettings = function (){
    //jQuery('#settings').hide();
};

UIController.showSettings = function (){
    //jQuery('#settings').show();
    TitaniumUtils.titaniumFireEvent('addQuote');
};

UIController.checkNavButtons = function(){
    // if we are in the saved quote section, we can show the edit button
    // otherwise hide it
    if(Global.currQuoteSetName === "Saved Quotes"){
        $('#editQuote').show();
    }else{
        $('#editQuote').hide();
    }
    // set the checkbox icon
    UIController.setQuoteMemorizedButton();
    
};

UIController.setQuoteMemorizedButton = function(){
    var pathToImage = "images/iphone-images/",
        isiPad = navigator.userAgent.match(/iPad/i) !== null,
        os = 'iphone';
    if(isiPad){     
        pathToImage = "images/ipad-images/";
        os = 'ipad';
    }
    if(GameUtils.isInMemorizedArray(HideQuoteGame.getCurrQuoteId())){
        $("#checkbox img").attr("src",pathToImage + "check-on-menubar.png");
        $("#checkbox").addClass("menubarButtonToggleOn");
    }else{
        $("#checkbox img").attr("src",pathToImage + "check-off-menubar.png");
        $("#checkbox").removeClass("menubarButtonToggleOn");
    }
};

UIController.buildQuoteNumString = function (currIndex){
    var strQuoteNum = Global.currQuoteSetName + " > " + (currIndex+1) + " of " + Global.currQuoteSetLength;
    Utils.getElement("currQuoteNum").innerHTML= strQuoteNum;
};

UIController.editQuote = function(){
    if(Global.currQuoteSetName === "Saved Quotes"){
        var quoteId = HideQuoteGame.getCurrQuoteId();
        TitaniumUtils.titaniumFireEvent('editQuote',{data:quoteId});
    }
};

UIController.enterQuote = function(){
    TitaniumUtils.titaniumFireEvent('enterQuote');
};

UIController.showHomeScreen = function(){
    $('#home').show();
};

UIController.hideHomeScreen = function(){
    $('#home').hide();
};

UIController.showInstructionsScreen = function(){
    $('#instructions').show();
};

UIController.hideInstructionsScreen = function(){
    $('#instructions').hide();
};

UIController.showAboutScreen = function(){
    $('#about').show();
};

UIController.hideAboutScreen = function(){
    $('#about').hide();
};

UIController.showMenus = function(){
    $('#menuPanel').show();
    $('#quoteSelector').show();
    UIController.showBreadcrumb();
};

UIController.hideMenus = function(){
    $('#menuPanel').hide();
    $('#quoteSelector').hide();
    $('#quoteSelector li').hide();
    $('#settings').hide();
    $('#header').hide();
};

UIController.hideAllScreens = function(){
    UIController.hideHomeScreen();
    UIController.hideInstructionsScreen();
    UIController.hideAboutScreen();
    UIController.hideMenus();
    //hideGame();
    
};


// --------------- end nav functions