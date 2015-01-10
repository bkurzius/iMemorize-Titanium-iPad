/**
 * @author bkurzius
 */
var Main = {};

Main.init = function(){
    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    $("#home").hide();
    Utils.loadJSON("assets/menu.json",MenuBuilder.menuLoadedHandler);
    UIController.hideGame();
    UIController.showMenus();
    UIController.hideSettings();
    MenuBuilder.clearMenuHistory();
    TitaniumUtils.titaniumFireEvent("appLoaded");
    if(isiPad){     
        $("link[rel=stylesheet]").attr({href : "css/styleiPad.css"});
        $("#arrow-back-chooser").attr("src","images/ipad-images/arrow-back-icon.png");
        $("#arrow-back-game").attr("src","images/ipad-images/arrow-back-icon.png");
        $("#icon-home-chooser").attr("src","images/ipad-images/icon-home2.png");
        $("#icon-home-game").attr("src","images/ipad-images/icon-home2.png");
        $("#icon-menu-settings-chooser").attr("src","images/ipad-images/icon-menu.png");
        $("#icon-menu-settings-game").attr("src","images/ipad-images/icon-menu.png");
        $("#icon-check").attr("src","images/ipad-images/check-off-menubar.png");
        $("#icon-menu-edit").attr("src","images/ipad-images/icon-edit.png");
    }
    Utils.disableSelection(document.body);
    /*
    // prevent scrolling of the main document
    document.addEventListener('touchmove', function(e) {
        // This prevents native scrolling from happening.
        e.preventDefault();
    }, false);

    var myScroller = new Scroller(Utils.getElement("gamePanel"));
    */
	/*
	$("#gamePanel").swipe({
     swipeLeft: function() { TitaniumUtils.titaniumFireEvent('loadNextQuote', {}); },
     swipeRight: function() {TitaniumUtils.titaniumFireEvent('loadPrevQuote', {}); },
	})
	*/

};