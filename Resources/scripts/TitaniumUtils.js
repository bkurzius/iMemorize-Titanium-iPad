

var TitaniumUtils = {
    online: true		
};

// this is a function where we can disable the titanium 
TitaniumUtils.titaniumFireEvent = function(evtName,data){
	//alert("Fire a titanium event: " + evtName);
	Titanium.App.fireEvent(evtName,data);
};


TitaniumUtils.sendQuoteToDevice = function(_quote,_introtext,_author,_reference,_language,_id,_url){
	//alert('sendQuoteToDevice()' + _language + ' | ' + _id);
	var quoteData = {data:{quote:_quote,introtext:_introtext,author:_author,reference:_reference,language:_language,id:_id,url:_url,isSaved:GameUtils.isCurrQuoteSaved()}};
	TitaniumUtils.titaniumFireEvent("setCurrentQuote",quoteData);
};

// this tells Titanium to open the current quote url if one exists
TitaniumUtils.openQuoteURL = function(){
	//alert("opneQuoteURL()");
	TitaniumUtils.titaniumFireEvent("openQuoteURL","");
};

TitaniumUtils.fireTitaniumAlert = function(_title,_text,_buttons ){
	var data = {'title': _title, 'text': _text, 'buttons': _buttons};
	TitaniumUtils.titaniumFireEvent("fireAlert",data);
};

TitaniumUtils.titaniumCloseInstructions = function(){
	TitaniumUtils.titaniumFireEvent("closeInstructions",data);
};


//-------- Titanium eventListeners ----------

//*
Titanium.App.addEventListener('hideWords', function(e) {
	HideQuoteGame.hideWords();
});

Titanium.App.addEventListener('showAllWords', function(e) {
	HideQuoteGame.showAllWords();
});

Titanium.App.addEventListener('loadPrevQuote', function(e) {
	HideQuoteGame.buildPrevQuote();
});

Titanium.App.addEventListener('loadNextQuote', function(e) {
	HideQuoteGame.buildNextQuote();
});

Titanium.App.addEventListener('QuotesLoaded', function(e) {
	// save new xml
	Global.savedQuotesCollection = e.data;
	Global.currQuoteSet = Global.savedQuotesCollection;
	//MenuBuilder.buildSavedQuotesSelector();
});

Titanium.App.addEventListener('fontSizeChanged', function(e) {
	HideQuoteGame.changeTextSize(e.data);
});

Titanium.App.addEventListener('QuoteEdited', function(e) {
	Global.savedQuotesCollection = e.data; 
	Global.currQuoteSet = Global.savedQuotesCollection;
	//MenuBuilder.buildSavedQuotesSelector();
	HideQuoteGame.buildCurrQuote();
});

Titanium.App.addEventListener('QuoteAdded', function(e) {
	Global.savedQuotesCollection = e.data;
	Global.currQuoteSet = Global.savedQuotesCollection;
	//buildSavedQuotesSelector();
	HideQuoteGame.buildCurrQuote();
});

Titanium.App.addEventListener('AddAndMemorize', function(e) {
	Global.savedQuotesCollection = e.data;
	Global.currQuoteSetName="Saved Quotes";
	Global.currQuoteSet = Global.savedQuotesCollection;
	//MenuBuilder.buildSavedQuotesSelector();
	// set the currQuoteIndex to the last one that was added to save quotes
	Global.currQuoteIndex = (jQuery(Global.currQuoteSet).find("quote").length)-1;
	Global.currQuoteSetLength = (jQuery(Global.currQuoteSet).find("quote").length);
	HideQuoteGame.buildCurrQuote();
});

Titanium.App.addEventListener('QuoteDeleted', function(e) {
	Global.savedQuotesCollection = e.data;
	Global.currQuoteSet = Global.savedQuotesCollection;
	MenuBuilder.selectAnotherQuote();
});

Titanium.App.addEventListener('networkOnline', function(e) {
	//alert('e.online: ' + e.online);
	online = e.online;
});

// this is fired by the app on load to send the memorizedQuotes array
Titanium.App.addEventListener('MemorizedQuotesArraySent', function(e) {
	Global.memorizedArray = e.data.split(",");
});

Titanium.App.addEventListener('CloseAddQuote', function(e) {
	//HideQuoteGame.buildCurrQuote();
});

Titanium.App.addEventListener('showHome', function(e) {
	//UIController.hideAllScreens();
	//UIController.showHomeScreen();
});

Titanium.App.addEventListener('showAbout', function(e) {
	//hideAllScreens();
	showAboutScreen();
});

Titanium.App.addEventListener('showInstructions', function(e) {
	//hideAllScreens();
	showInstructionsScreen();
});

Titanium.App.addEventListener('showQuoteSelector', function(e) {
	//alert('init');
	Main.init();
});

Titanium.App.addEventListener('orientationChangeEvent', function(e) {
	if(e.orientation==='landscape'){
		MenuBuilder.quoteSelectorTruncateLength=MenuBuilder.QUOTE_SELECTOR_TRUNCATE_LENGTH_LANDSCAPE;
	}else{
		MenuBuilder.quoteSelectorTruncateLength=MenuBuilder.QUOTE_SELECTOR_TRUNCATE_LENGTH_PORTRAIT;
	}
	if(Global.currMode === Global.CURR_MODE_QUOTE_SELECTOR){
		MenuBuilder.buildQuoteSelector(Global.currQuoteSet);
	}
});

// */

