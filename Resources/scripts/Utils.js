/**
 * utils
 */

var Utils = {};

// add this to the jQuery prototype so we can properly compare two objects
$.fn.equals = function(compareTo) {
    var i=0,
        thisLength = this.length;             
    if (!compareTo || !compareTo.length || this.length !== compareTo.length){
        return false;
    }               
    for(i=0; i<thisLength; i++) {
        if (this[i]!==compareTo[i]) {
            return false;
        }
    }
    return true;
};

//load the JSON Data from the passed in url
//this allows us to also pass in a dataLoadedHandler once the data is loaded
Utils.loadJSON = function (dataURL,dataLoadedHandler){
    var x;
    if (document.getElementById) {
       x = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
    }
    if(x !== undefined){
        x.onreadystatechange = function(){
            if (x.readyState === 4){
                dataLoadedHandler(eval("(" + x.responseText + ")"));
            }
        };
        x.open("GET", dataURL, true);
        x.send(null);
    }
};


Utils.isLongWord = function (thisText){
    if (thisText.length > 4) {
        return true;
    }else{
        return false;
    }   
 };

// general functions

Utils.get_cookie = function ( cookie_name ){
    var results = document.cookie.match( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
    if(results){
        return (unescape(results[2]));
    }else{
        return null;
    }
};

Utils.delete_cookie = function ( cookie_name ){
    var cookie_date = new Date();   // current date & time
    cookie_date.setTime(cookie_date.getTime() - 1);
    document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
};

Utils.isThisLogogramLanguage = function (language){
    var isLogogramLang = false;
    language = language.toUpperCase();
    if(language==="CHINESE" || language==="JAPANESE" || language==="KOREAN" || language==="VIETNAMESE"){
        isLogogramLang = true;
    }
    return isLogogramLang;
};

//Right to Left languages are those that read from right to left
// like Arabic and Persian
Utils.isThisRightToLeftLanguage = function (language){
    var isRightToLeftLang = false;
    language = language.toUpperCase();
    if(language==="ARABIC" || language==="HEBREW" || language==="YIDDISH" || language==="PERSIAN" || language==="AR" || language==="FA" || language==="YI"){
        isRightToLeftLang = true;
    }
    return isRightToLeftLang;
};


//this extract the number from a px value
Utils.getPxValue = function(myVal){
    return Number(myVal.replace("px",""));
};

// this lets us add two numbers (in either number or px format) and return the total in px format
Utils.addPXValues = function(){
    var total = 0,
       i=0;
    for(i=0;i<arguments.length;i++){
        total += Utils.getPxValue(arguments[i]);
    }
    return total + "px";
};

// shortcut to getElementById()
Utils.getElement = function(divName){
    return document.getElementById(divName);
};


Utils.trace = function(s){
    //Utils.getElement("trace").innerHTML += "<br />" + s;
};

Utils.clearTrace = function(){
    //Utils.getElement("trace").innerHTML = "";
};

// this returns the selected value from a dropdown
Utils.getSelectedValueFromDropdown = function(dropdown){
    var tIndex = dropdown.selectedIndex,
        tValue = dropdown[tIndex].value;
    return tValue;  
};

// trim string and add elipses. pass in string and the numbers of letters 
// to truncate to -- the function then moves back to the last space and adds elipses
// if its a logogram language we trim on 
Utils.trimString = function(strText,numLetters,elipses,logogramLanguage){
    var finalString,
        strElipse,
        truncString = strText.substring(0,numLetters),
        tempStr;
        
    if(elipses){
        strElipse="...";
    }else{
        strElipse="";
    }
    // if this is a logogram language we can't break it on a space 
    // so we just grab the length of the characters
    if(logogramLanguage){
        // the symbols are much longer than alphanumerics so we need to get less letters
        tempStr = strText.substring(0,Math.round(numLetters/2.25));
        finalString = tempStr + strElipse;
    }else{
        finalString = truncString + strElipse;
    }   
    return finalString;
};

/***********************************************
* Disable Text Selection script- Dynamic Drive DHTML code library (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
***********************************************/
Utils.disableSelection = function(target){
	if (typeof target.onselectstart !== "undefined") { //IE route
		target.onselectstart = function(){
			return false;
		};
	}
	else {
		if (typeof target.style.MozUserSelect !== "undefined") { //Firefox route
			target.style.MozUserSelect = "none";
		}
		else { //All other route (ie: Opera)
			target.onmousedown = function(){
				return false;
			};
		}
		target.style.cursor = "default";
	}
};

