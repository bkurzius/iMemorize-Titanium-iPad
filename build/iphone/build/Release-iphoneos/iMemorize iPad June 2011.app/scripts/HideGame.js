//**************************

// ----- HideQuoteGame Class -------------

var HideQuoteGame = {};

HideQuoteGame.hideIncrement = 3;
HideQuoteGame.$allWords = "";
HideQuoteGame.totalWordsHidden = 0;
HideQuoteGame.aWordsStillShowing = [];
HideQuoteGame.wordArray = "";
HideQuoteGame.showAllBtnDisabled = true;
HideQuoteGame.hideBtnDisabled = false;

HideQuoteGame.buildQuoteScreen = function(quoteNum){
    var that = this,
        thisQuote,
        $currIntroText,
        $currQuoteText,
        $currQuoteLanguage,
        $currQuoteId,
        $currQuoteURL,
        $currSource,
        $currAuthor,
        indentStyle,
        RTL,
        thisWord,
        div,
        wordArrayLength,
        i,
        clearNextWord = false;
    
    // reset the number of words that are hidden
    this.totalWordsHidden = 0;
    this.aWordsStillShowing = [];
    
    
    // we need to position the window to the top in case a user has scrolled to a lower postion in the qoute menu
    window.scroll(0,0);

    Global.currMode = Global.CURR_MODE_GAME;
    thisQuote = jQuery(Global.currQuoteSet).find("quote")[quoteNum];
    $currQuoteId = jQuery(thisQuote).attr('id');
    $currQuoteLanguage = jQuery(thisQuote).find('language').text();
    $currIntroText = decodeURIComponent(jQuery(thisQuote).find('introtext').text());
    $currQuoteText = decodeURIComponent(jQuery(thisQuote).find('text').text());
    $currQuoteURL = decodeURIComponent(jQuery(thisQuote).find('url').text());
    
    RTL = Utils.isThisRightToLeftLanguage($currQuoteLanguage);
    
    if(RTL){
        indentStyle='indentRTL';
    }else{
        indentStyle='indentLTR';
    }

    // remove all of the divs in the gamePanel
    $("#gamePanel div").remove();
    // set up the intro text and add it if it exists
    if($currIntroText.length>1){
        this.addIntrotext($currIntroText,$currQuoteLanguage);
    }
    // split the quote into an array
    if(Utils.isThisLogogramLanguage($currQuoteLanguage)){
        this.wordArray = this.splitTextIntoChars($currQuoteText);
    }else{
        this.wordArray = $currQuoteText.split(" ");
    }   
    // set the hide increment by dividing the quote length by 10
    this.hideIncrement = this.wordArray.length/10;
    // hide the quote selector panel
    UIController.hideQuoteSelector();
    // this is the "Quote 5 out 6" string
    UIController.buildQuoteNumString(Global.currQuoteIndex);
    // show this game panel div
    UIController.showGame();
    // now build the new gamePanel 
    // take each word, create a div
    // add it to the screen and add t to the stillShowingAray();
    
    wordArrayLength = this.wordArray.length;

    for(i=0;i<wordArrayLength;i++){
	//for(i=0;i<10;i++){
        div = document.createElement("div");
        thisWord = this.wordArray[i];
        // if the last word was -- or ended with -- a <br> tag
        // we set this flag to clear the next word
        // we also clear the first word too in case the introtext is there
        if(clearNextWord || i===0){
            $(div).addClass('clear');
            clearNextWord = false;
        }
        // if this word is undefined then 
        if(thisWord === undefined){
        	thisWord = '';
        }

        // see if there is a break tag
        if(thisWord.indexOf("<br") > -1 ){
            var lengthOfWord = thisWord.length,
                regex = /<[^<>]+>/,  // create a regex that find the <br/> tag
                positionOfMatch = thisWord.search(regex); // find the position of it
            // if the br tag is at the end of the word we have to clear the next word instead
            // otherwise clear this one
            if(positionOfMatch >= lengthOfWord-6){
                clearNextWord = true;
            }else{
                $(div).addClass('clear');
                $(div).addClass(indentStyle);
            }
            // now replace < br> with nothing
            thisWord = thisWord.replace(regex,"");
            // if the whole word is nothing (meaning the word was actually only a break tag)
            if(thisWord===''){
                // then we take this item out of the array
                this.wordArray.splice(i,1);
                // and move the index back one so we don't miss a word
                i--;
                continue;
            }
            
        }
      //  if(thisWord!==''){
       	 	div.innerHTML=thisWord;
        	Utils.getElement("gamePanel").appendChild(div);
        	this.addToStillShowingArray(div);
      //  }
        // if the word is the first in the paragraph, indent it
    }
    // now use jQuery to attach the class and event handler
    // we remove the introtext from $allWords so it doesn't hide/show
    this.$allWords = jQuery("#gamePanel div").not("#gamePanel #introtext");
    if(Utils.isThisRightToLeftLanguage($currQuoteLanguage)){
        this.$allWords.addClass("hiddenWordRTL");
        $("#introtext").addClass("hiddenWordRTL");
    }else if (Utils.isThisLogogramLanguage($currQuoteLanguage)){
        this.$allWords.addClass("hiddenWordLogogram");
    }else{
        this.$allWords.addClass("hiddenWord");
    }

    this.changeTextSize(this.$textSize);
    this.$allWords.click(function(){
        that.toggleHide(this);
    });

    UIController.checkNavButtons();
    $currSource = decodeURIComponent(jQuery(thisQuote).find('reference').text());
    $currAuthor = decodeURIComponent(jQuery(thisQuote).find('author').text());
    this.addSource($currAuthor, $currSource, $currQuoteLanguage,$currQuoteURL);
    TitaniumUtils.sendQuoteToDevice($currQuoteText,$currIntroText,$currAuthor,$currSource,$currQuoteLanguage,$currQuoteId,$currQuoteURL);
    Titanium.App.fireEvent('trackMemorizeEvent',{data:$currQuoteText.substring(0,100)});	

};

// this function splits a string into an array of chars
HideQuoteGame.splitTextIntoChars = function(inputText){
    var tempArray = [],
        i;
    for (i=0;i<inputText.length;i++){
        tempArray.push(inputText.charAt(i));
    }
    return tempArray;
};


// adds the introtext -- if there is one
HideQuoteGame.addIntrotext = function(text,currQuoteLanguage){
    var introDiv = document.createElement("div");
    $(introDiv).attr("id","introtext");
    $(introDiv).addClass("introtext");
    introDiv.innerHTML = text;
   Utils.getElement("gamePanel").appendChild(introDiv);
    if(Utils.isThisRightToLeftLanguage(currQuoteLanguage)){
        $(introDiv).addClass("RTL");
    }else{
        $(introDiv).addClass("LTR");
    }
};

// adds the source -- if there is one
HideQuoteGame.addSource = function(authorName,sourceText,currQuoteLanguage,currQuoteURL){
    
    var sourceDiv = document.createElement("div"),
        $newString = '<span class=\'source\'>';
    
    if(authorName.length>0){
        $newString = $newString + authorName;
        if (sourceText.length > 0) {
            $newString = $newString + " | ";
        }
    }
    if(sourceText.length>0){
        // if there is a URL -- and we are online-- then display the href
        if(currQuoteURL!=="" && TitaniumUtils.online){
            $newString = $newString + "<a href='javascript:TitaniumUtils.openQuoteURL();' >" + sourceText + "</a>";
        }else{
            $newString = $newString + sourceText;
        }
    }
    $newString = $newString + '</span>';
    sourceDiv.innerHTML=$newString;
    
    Utils.getElement("gamePanel").appendChild(sourceDiv);
    if(Utils.isThisRightToLeftLanguage(currQuoteLanguage)){
        jQuery(sourceDiv).addClass("RTL");
    }else{
        jQuery(sourceDiv).addClass("LTR");
    }
};


HideQuoteGame.buildCurrQuote = function(){
    this.buildQuoteScreen(Global.currQuoteIndex);
};
        
HideQuoteGame.buildNextQuote = function(){
    if(Global.currQuoteIndex < Global.currQuoteSetLength-1) {
        Global.currQuoteIndex++;
        this.buildQuoteScreen(Global.currQuoteIndex);
    }else{
        TitaniumUtils.fireTitaniumAlert("","You have reached the last item in this set.",["OK"] );
    }
};

HideQuoteGame.buildPrevQuote = function(){
    if (Global.currQuoteIndex > 0) {
        Global.currQuoteIndex--;
        this.buildQuoteScreen(Global.currQuoteIndex);
    }else{
        TitaniumUtils.fireTitaniumAlert("","You have reached the first item in this set.",["OK"] );
    }
};

HideQuoteGame.toggleHide = function(thisDiv){
    if(jQuery(thisDiv).hasClass('hide')){
        this.showWord(thisDiv);
    }else{
        this.hideWord(thisDiv);
    }
};

HideQuoteGame.hideWord = function(word){
    jQuery(word).addClass('hide');
    this.totalWordsHidden++;
    this.removeFromStillShowingArray(word);
    this.checkHideShowBtns();
};


HideQuoteGame.showWord = function(word){
    jQuery(word).removeClass('hide');
    this.totalWordsHidden--;
    this.addToStillShowingArray(word);
    this.checkHideShowBtns();
};

HideQuoteGame.showAllWords = function(){
    var that = this;
    // reset the array
    HideQuoteGame.aWordsStillShowing = [];
    HideQuoteGame.$allWords.removeClass('hide'); 
    HideQuoteGame.totalWordsHidden = 0;
    // then loop through the collection and add to the array
    HideQuoteGame.$allWords.each(function(){
        that.aWordsStillShowing.push(this);
    });
    HideQuoteGame.enableHideBtn();
    HideQuoteGame.disableShowAllBtn();
};

HideQuoteGame.addToStillShowingArray = function(word){
   HideQuoteGame.aWordsStillShowing.push(word);
};

// remove the word from the array so we can track what is left
HideQuoteGame.removeFromStillShowingArray = function(word){
    var i,
        wordsStillShowingLength = this.aWordsStillShowing.length-1;
    for(i=0; i<wordsStillShowingLength; i++) {
        if(jQuery(HideQuoteGame.aWordsStillShowing[i]).equals(word)){
            HideQuoteGame.aWordsStillShowing.splice(i,1);
        }
    }
};

HideQuoteGame.hideWords = function(){
    var i=0,
        thisNum,
        thisDiv;
    // we make one test to see how many more long words there are
    // if there are more than the hideWordIncrement then we will target big words to hide
    // othewise we will hide the rest of the words
    // doing this test after each hide was far too memory intensive and choked the iPod
    while(i<HideQuoteGame.hideIncrement){
        if(!HideQuoteGame.allWordsHidden()){
            thisNum = Math.floor(Math.random()*this.aWordsStillShowing.length);
            // get the targeted div
            thisDiv = jQuery(HideQuoteGame.aWordsStillShowing[thisNum]);
            // see if it does not have the hide class
            // if it does its already hidden
            // this first test was a memory hog on long quotes but the revison below it improved the situation dramatically
                if(!jQuery(thisDiv).hasClass('hide')){
                    HideQuoteGame.hideWord(thisDiv);
                    i++;
                }
        }else{
            //console.log("no more words to hide");
            break;
        }
    }
};

HideQuoteGame.allWordsHidden = function(){
    if (HideQuoteGame.wordArray.length === HideQuoteGame.totalWordsHidden){
        Utils.trace("all hidden");
        return true;
    }else{
        return false;
    } 
 };
 
 HideQuoteGame.noWordsHidden = function(){  
    if(this.totalWordsHidden===0){
        return true;
    }else{
        return false;
    }
};



HideQuoteGame.anyLongWordsStillShowing = function(){
    var foundLongWord = false;
    this.$allWords.each(function(){
        var $this = jQuery(this);
        if(Utils.isLongWord($this.text())&&!$this.hasClass('hide')){
            foundLongWord = true;
        }
    });
    return foundLongWord;
};

 HideQuoteGame.numberOfLongWordsShowing = function(){
    var totalWords = 0; 
    HideQuoteGame.$allWords.each(function(){
        var $this = jQuery(this);
        if(Utils.isLongWord($this.text())&&!$this.hasClass('hide')){
            totalWords++;
        }
    });
    return totalWords;
};



HideQuoteGame.checkHideShowBtns = function(){
    if(HideQuoteGame.allWordsHidden()){
        HideQuoteGame.disableHideBtn();
    }else{
        HideQuoteGame.enableHideBtn();
    }
    if(HideQuoteGame.noWordsHidden()){
        HideQuoteGame.disableShowAllBtn();
    }else{
        HideQuoteGame.enableShowAllBtn();
    }
};

HideQuoteGame.disableHideBtn = function(){
    //Utils.getElement("hideBtn").src = "images/nav/nav_hide_off.jpg";
};

HideQuoteGame.enableHideBtn= function(){
    //Utils.getElement("hideBtn").src = "images/nav/nav_hide_on.jpg";
};

HideQuoteGame.disableShowAllBtn = function(){
    Utils.trace("disable showall btn");
    //Utils.getElement("showAllBtn").src = "images/nav/nav_show_off.jpg";
};


HideQuoteGame.enableShowAllBtn= function(){
    Utils.trace("enable showall btn");
};


HideQuoteGame.getCurrQuoteId = function(){  
    var thisQuote = jQuery(Global.currQuoteSet).find("quote")[Global.currQuoteIndex],
        thisId = jQuery(thisQuote).attr("id");
    return thisId;
};

HideQuoteGame.changeTextSize = function(newSize){
    if (newSize !== undefined) {
        this.$textSize = newSize;
        HideQuoteGame.$allWords.css('font-size', newSize + "px");
        HideQuoteGame.$allWords.css('margin-left', Math.ceil(newSize / 18) + "px");
        HideQuoteGame.$allWords.css('margin-right', Math.ceil(newSize / 18) + "px");
        $('#introtext').css('font-size', Math.round(newSize / 1.5) + "px");
        $('#source').css('font-size', Math.round(newSize / 2) + "px");
    }
    
};



// ----- END HideQuoteGame Class -------------  

