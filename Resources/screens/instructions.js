/**
 * 
 */
var win = Ti.UI.currentWindow;
var instructionsWin = Ti.UI.createWindow({
	backgroundColor:'#849B02'
});
var instructionsHTML = Ti.UI.createWebView({url:'../instructions.html', width:'auto',height:500});
instructionsWin.add(instructionsHTML);
win.backgroundColor='#849B02';
win.add(instructionsWin);