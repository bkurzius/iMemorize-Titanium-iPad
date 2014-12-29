var TiUtils = (function(){
	var osName = Ti.Platform.osname;
	return {
		showAlertDialog: function(_title, _message, _buttonNames){
			var alertDialog = Titanium.UI.createAlertDialog({
				title: _title,
				message: _message,
				buttonNames: _buttonNames
			});
			alertDialog.show();
		},
		
		isiPad: function(){
			if (osName === "ipad") {
				return true;
			}
			else {
				return false;
			}
		},
		
		isAndroid: function(){
			if (osName === "android") {
				return true;
			}
			else {
				return false;
			}
		},
		
		isiPhone: function(){
			if (osName === "iphone") {
				return true;
			}else {
				return false;
			}
		},
		isIos: function(){
			if (osName === "iphone" || osName === "ipad") {
				return true;
			}else {
				return false;
			}
		},
		getAppHeight: function(){
			var thisHeight;
			if(TiUtils.isAndroid()){
				thisHeight = Ti.Platform.displayCaps.platformHeight;
			}else{
				thisHeight = Ti.Platform.displayCaps.platformHeight - App.data.iPhoneStatusBarHeight;
			}
			return thisHeight;
		},
		getAppWidth: function(){
			var thisWidth;
			thisWidth = Ti.Platform.displayCaps.platformWidth;
			return thisWidth;
		},
		getOsName: function(){
			return Ti.Platform.osname;
		},
		getOrientation: function(){
			if(Titanium.UI.orientation===Titanium.UI.LANDSCAPE_LEFT || Titanium.UI.orientation===Titanium.UI.LANDSCAPE_RIGHT){
				return "landscape";
			}else if(Titanium.UI.orientation===Titanium.UI.PORTRAIT || Titanium.UI.UPSIDE_PORTRAIT){
				return "portrait";
			}else{
				return "unknown";
			}
		},
		getPickerViewHeight: function(){
			var height;
			if(TiUtils.getOrientation()==="portrait"){
				height = 250;
			}else{
				height = 200;
			}
			return height;
		},
		
		trim: function(stringToTrim) {
			return stringToTrim.replace(/^\s+|\s+$/g,"");
		},
		
		ltrim: function(stringToTrim) {
			return stringToTrim.replace(/^\s+/,"");
		},
		
		rtrim:  function(stringToTrim) {
			return stringToTrim.replace(/\s+$/,"");
		}
	};
})();

