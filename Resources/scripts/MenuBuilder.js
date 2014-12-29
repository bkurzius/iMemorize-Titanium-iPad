//****************************************


// --------------- menu data functions
var MenuBuilder = {
    currQuoteCollection: {},
    currQuoteCollectionItems: {},
    JsonMenu: {},
    QUOTE_SELECTOR_TRUNCATE_LENGTH_LANDSCAPE: 78,
    QUOTE_SELECTOR_TRUNCATE_LENGTH_PORTRAIT: 55,
    quoteSelectorTruncateLength: 55
};

// is the callback for the JSON menu loader 
MenuBuilder.menuLoadedHandler = function(response){
    // this happens when the app first loads the menu json object
    MenuBuilder.currQuoteCollection = response[0];
    Global.currMenuNodeIndex = 0;
    MenuBuilder.addToMenuHistory(MenuBuilder.currQuoteCollection);
    MenuBuilder.buildMenu(MenuBuilder.currQuoteCollection);
    MenuBuilder.JsonMenu = response[0];
};

// if the fromHistory is true it means that this comes from the loadParentMenu 
// and the collection parents have already been defined in the history object 
MenuBuilder.buildMenu = function(quoteCollection, fromHistory){

    var tempQuoteCollection = quoteCollection, thisNodeName, thisNodeParentName, selector = Utils.getElement("quoteSelector"), i, currQuoteCollectionLength, thisItem, menuItem;
    
    // we need to position the window to the top in case a user has scrolled to a lower position in the previous menu   
    Global.currMode = Global.CURR_MODE_COLLECTION_SELECTOR;
    MenuBuilder.currQuoteCollectionItems = tempQuoteCollection.items;
    if (!fromHistory) {
        tempQuoteCollection.parent = MenuBuilder.currQuoteCollection;
    }
    thisNodeName = tempQuoteCollection.name;
    thisNodeParentName = tempQuoteCollection.parent.name;
    MenuBuilder.currQuoteCollection = tempQuoteCollection;
    
    jQuery("#quoteSelector li").remove();
    jQuery("#quoteSelector div").remove();
    
    // now add the heading bar if the parent is not undefined or 'menu'
    if (thisNodeParentName !== undefined) {
        if (MenuBuilder.currQuoteCollection.parent.name !== MenuBuilder.currQuoteCollection.name) {
            //setTitle = currQuoteCollection.parent.name + " > " + currQuoteCollection.name;
            this.setTitle = MenuBuilder.currQuoteCollection.name;
        }
        else {
            this.setTitle = MenuBuilder.currQuoteCollection.name;
        }
        
        $('#breadCrumb').html(this.setTitle);
    }
    currQuoteCollectionLength = MenuBuilder.currQuoteCollectionItems.length;
    for (i = 0; i < currQuoteCollectionLength; i++) {
        thisItem = MenuBuilder.currQuoteCollectionItems[i];
        menuItem = document.createElement("li");
        menuItem.innerHTML = "<a href=''>" + thisItem.name + "</a>";
        menuItem.id = thisItem.id;
        selector.appendChild(menuItem);
        jQuery(menuItem).click(function(){
            MenuBuilder.setMenu(jQuery("#quoteSelector li").index(this));
            return false;
        });
    }
    MenuBuilder.checkHistoryButton();
    window.scroll(0, 0);
};


MenuBuilder.setMenu = function(index){
    Global.currQuoteSet = MenuBuilder.currQuoteCollection.items[index];
    Global.currQuoteSet.parent = MenuBuilder.currQuoteCollection;
    Global.currQuoteSetName = MenuBuilder.currQuoteCollection.items[index].name;
    // if this node name is "Saved Quotes" then go directly to build the quote selector 
    // using the variable that was loaded from Titanium
    if (Global.currQuoteSetName === "Saved Quotes") {
        Global.currQuoteSetName = "Saved Quotes";
        MenuBuilder.buildSavedQuotesSelector(Global.savedQuotesCollection);
        //alert("build saved quotes:" + Global.savedQuotesCollection);
        // we're saving the history at this point so we can revert to it if a person enters a quote
        // if there are no items then we are at a node that defines an xml file
    }
    else 
        if (Global.currQuoteSet.items === undefined) {
            $.get('assets/' + Global.currQuoteSet.file, MenuBuilder.buildQuoteSelector, 'xml');
        // otherwise go to the next set of items
        }
        else {
            MenuBuilder.buildMenu(Global.currQuoteSet);
        }
    MenuBuilder.addToMenuHistory(MenuBuilder.currQuoteCollection);
    // we add the currQuoteSet into the history array
    MenuBuilder.checkHistoryButton();
};

MenuBuilder.loadParentMenu = function(){
    var prevMenuContent;
    // we build the menu with the last item in the array
    if (MenuBuilder.getMenuHistoryLength() > 1) {
        prevMenuContent = MenuBuilder.getMenuHistoryItem([MenuBuilder.getMenuHistoryLength() - 2]);
        Global.menuHistory.pop();
        MenuBuilder.buildMenu(prevMenuContent, true);
    }
    MenuBuilder.checkHistoryButton();
};

MenuBuilder.clearMenuHistory = function(){
    Global.menuHistory = [];
};

MenuBuilder.buildQuoteSelector = function(quoteSet){
    var thisQuoteSet, thisQuoteSetName;
    window.scroll(0, 0);
    Global.currMode = Global.CURR_MODE_QUOTE_SELECTOR;
    Global.currQuoteSet = quoteSet;
    MenuBuilder.$quoteSelector = $('#quoteSelector');
    MenuBuilder.$quoteSelector.hide();
    thisQuoteSet = jQuery(quoteSet).find("quote");
    thisQuoteSetName = jQuery(quoteSet).find('section')[0].getAttribute('name');
    if (Global.currQuoteSetName !== "Saved Quotes") {
        Global.currQuoteSetLanguage = jQuery(quoteSet).find("quotes")[0].getAttribute("language");
    }
    Global.currQuoteSetLength = thisQuoteSet.length;
    jQuery("#quoteSelector li").remove();
    jQuery("#quoteSelector div").remove();
    if (Global.currQuoteSetName !== "Saved Quotes") {
        $('#breadCrumb').html(thisQuoteSetName);
    }
    else {
        // hack -- we always set the first breadcrumb to Collections for Saved quotes
        $('#breadCrumb').html(thisQuoteSetName);
    }
    MenuBuilder.showMenuBackButton();
    
    
    // this only executes if there are quotes to show 
    thisQuoteSet.each(function(){
        var menuItem = document.createElement("li"), text = decodeURIComponent(jQuery(this).find('text').text()), quoteLang = 'en', quoteId = jQuery(this).attr('id');
        
        // set the menuItem
        jQuery(menuItem).data("quote", text);
        if (Global.currQuoteSetName === "Saved Quotes") {
            quoteLang = jQuery(this).find('language').text();
        }
        var trimmedText = Utils.trimString(text, MenuBuilder.quoteSelectorTruncateLength, true, Utils.isThisLogogramLanguage(quoteLang));
        MenuBuilder.$myLi = $('<li></li>');
        if (GameUtils.isInMemorizedArray(quoteId)) {
            MenuBuilder.$myLi.removeClass('checkOff');
            MenuBuilder.$myLi.addClass('checkOn');
        }
        else {
            MenuBuilder.$myLi.removeClass('checkOn');
            MenuBuilder.$myLi.addClass('checkOff');
        }
        MenuBuilder.$myImg = $('<img src=\'images/spacer.png\' width=\'20\'  height=\'20\' border=\'0\' >');
        MenuBuilder.$myQuoteText = $('<ul><li>' + trimmedText + '</li></ul></li>');
        
        MenuBuilder.$quoteSelector.append(MenuBuilder.$myLi);
        MenuBuilder.$myLi.append(MenuBuilder.$myImg);
        MenuBuilder.$myLi.append(MenuBuilder.$myQuoteText);
        
        if (Utils.isThisRightToLeftLanguage(quoteLang)) {
            jQuery(MenuBuilder.$myLi).addClass("quoteSelectorItemRTL");
        }
    });
    
    // this is the function for an image click
    $('#quoteSelector li img').click(function(){
        Global.currQuoteIndex = jQuery("#quoteSelector li img").index(this);
        Global.thisQuoteId = HideQuoteGame.getCurrQuoteId(Global.currQuoteIndex);
        if (GameUtils.isInMemorizedArray(Global.thisQuoteId)) {
            $(this).parent().removeClass('checkOn');
            $(this).parent().addClass('checkOff');
        }
        else {
            $(this).parent().removeClass('checkOff');
            $(this).parent().addClass('checkOn');
        }
        GameUtils.toggleMemorizedItem(Global.thisQuoteId);
        return false;
    });
    
    // this is the function for the text click
    $('#quoteSelector li ul li').click(function(){
        Global.currQuoteIndex = jQuery("#quoteSelector li ul li").index(this);
        HideQuoteGame.buildCurrQuote();
        return false;
    });
    MenuBuilder.$quoteSelector.show();
    
};


MenuBuilder.buildSavedQuotesSelector = function(){
    MenuBuilder.resetMenuHistoryToSavedQuotes();
    MenuBuilder.addToMenuHistory(Global.savedQuotesCollection);
    var quotesLength = jQuery(Global.savedQuotesCollection).find("quote").length;
    // if this is the saved quote section and there are no quotes
    if (quotesLength < 1) {
        jQuery("#quoteSelector li").remove();
        jQuery("#quoteSelector div").remove();
        MenuBuilder.showMenuBackButton();
        var $noItems = $('<div id="noSavedQuotes">There are no quotes in your saved quotes.</div>');
        $("#quoteSelector").append($noItems);
    }
    else {
        MenuBuilder.buildQuoteSelector(Global.savedQuotesCollection, 28);
    }
};



// first we check if we are viewing the saved quotes
// if so, rebuild that because the user may have added or edited a quote

MenuBuilder.selectAnotherQuote = function(){
    if (Global.currQuoteSetName === "Saved Quotes") {
        MenuBuilder.buildSavedQuotesSelector();
    }
    else {
        MenuBuilder.buildQuoteSelector(Global.currQuoteSet);
    }
    UIController.showQuoteSelector();
    UIController.hideGame();
    UIController.showMenus();
};


//the first item in the history is the whole menu
//the rest of the items are instances of the menu "items" object
MenuBuilder.addToMenuHistory = function(item){
    Global.menuHistory.push(item);
};

MenuBuilder.resetMenuHistoryToSavedQuotes = function(){
    Global.menuHistory.splice(1, Global.menuHistory.length - 1);
};

MenuBuilder.getMenuHistoryLength = function(){
    return Global.menuHistory.length;
};

MenuBuilder.getMenuHistoryItem = function(num){
    return Global.menuHistory[num];
};

//this checks if the back button should show or not
MenuBuilder.checkHistoryButton = function(){
    if (MenuBuilder.getMenuHistoryLength() > 1) {
        MenuBuilder.showMenuBackButton();
    }
    else {
        MenuBuilder.hideMenuBackButton();
    }
};

MenuBuilder.hideMenuBackButton = function(){
    Utils.getElement('navBack').style.visibility = "hidden";
};

MenuBuilder.showMenuBackButton = function(){
    Utils.getElement('navBack').style.visibility = "visible";
};
