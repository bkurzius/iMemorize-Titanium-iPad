/**
 * 
 */
var win = Ti.UI.currentWindow;
var aboutWin = Ti.UI.createWindow({
	backgroundColor:'#849B02',
	statusBarStyle : Titanium.UI.iPhone.StatusBar.LIGHT_CONTENT,
	fullscreen : true

});
var aboutHTML = Ti.UI.createWebView({url:'../about.html', width:'auto',height:500});
aboutWin.add(aboutHTML);
win.backgroundColor='#849B02';
win.add(aboutWin);