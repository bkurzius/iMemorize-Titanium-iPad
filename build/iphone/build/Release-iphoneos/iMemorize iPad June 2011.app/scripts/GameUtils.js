/**
 * @author bkurzius
 */

// ----------- memorized items --------------------

var GameUtils = {};

GameUtils.addToMemorizedArray = function(num){
    Global.memorizedArray.push(num);
    GameUtils.updateMemorizedArray();
};

GameUtils.removeFromMemorizedArray = function (num){
    var i=0,
        memorizedArrayLength = Global.memorizedArray.length;

    for(i=0;i< memorizedArrayLength;i++){
        if(Global.memorizedArray[i] === num){
            Global.memorizedArray.splice(i,1);
        }
    }
    GameUtils.updateMemorizedArray();
};

GameUtils.toggleMemorizedItem = function (num){
    if(GameUtils.isInMemorizedArray(num)){
        GameUtils.removeFromMemorizedArray(num);
    }else{
        GameUtils.addToMemorizedArray(num);
    }
};


// check to see if the item is in the memorized array
GameUtils.isInMemorizedArray = function (num){
    var isTrue = false,
        arrayString = 'Looking for : ' + num + ' in the Array string:',
        i,
        memorizedArrayLength = Global.memorizedArray.length;

    for(i=0;i< memorizedArrayLength;i++){
        arrayString += Global.memorizedArray[i] + ',';
        if(Global.memorizedArray[i] === num){
            isTrue = true;
        }
    }
    return isTrue;
};

// fire this off to Titanium so that we can save the data ti a text file
GameUtils.updateMemorizedArray = function (){
    TitaniumUtils.titaniumFireEvent("memorizedArrayChange",{data:Global.memorizedArray});
};

GameUtils.isCurrQuoteSaved = function(){
    var isQuoteSaved=false;
    if(Global.currQuoteSetName === "Saved Quotes"){
        isQuoteSaved=true;
    }
    return isQuoteSaved;
};

// this allows us to toggle the memorized checkbox on the menubar
GameUtils.toggleMenubarCheckbox = function (){
    var pathToImage = "images/iphone-images/",
        isiPad = navigator.userAgent.match(/iPad/i) !== null,
        currQuoteId = HideQuoteGame.getCurrQuoteId();
        
    if(isiPad){     
        pathToImage = "images/ipad-images/";
    }
    
    // we're going to toggle it so if its in the array show the non-checked image
    if(GameUtils.isInMemorizedArray(currQuoteId)){
        $("#checkbox img").attr("src",pathToImage + "check-off-menubar.png");
        $("#checkbox").removeClass("menubarButtonToggleOn");
    }else{
        $("#checkbox img").attr("src",pathToImage + "check-on-menubar.png");
        $("#checkbox").addClass("menubarButtonToggleOn");
    }
    GameUtils.toggleMemorizedItem(currQuoteId);
};