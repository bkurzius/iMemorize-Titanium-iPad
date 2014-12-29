var EditMenu = {
	
	// data
	_orientationModes: {},
	// ui
	editMenuModal: {},
	handleTableClick: {},
	nav: {},
	table: {},
	done: {},
	modalWin: {},
	inited: false
	
};


EditMenu.init = function(){	
	_orientationModes = [ Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT,Titanium.UI.UPSIDE_PORTRAIT];
	Ti.API.info('EditMenu.init1');
	EditMenu.draw();
	Ti.API.info('EditMenu.init2');
	EditMenu.setEventListeners();
	Ti.API.info('EditMenu.init3');
};

EditMenu.draw = function(){
	Ti.API.info('EditMenu.draw 1');
	///EditMenu.editMenuModal = Ti.UI.createWindow();
	
	EditMenu.editMenuModal = Ti.UI.createWindow({
		height: TiUtils.getAppHeight(),
		top: 0,
		backgroundColor: "#FFFFFF"
	});
	Ti.API.info('EditMenu.draw 2');
	
	//EditMenu.editMenuModal.orientationModes = EditMenu._orientationModes;
	Ti.API.info('EditMenu.draw 3');

	EditMenu.initTable();
	Ti.API.info('EditMenu.draw 5');
	EditMenu.done = Titanium.UI.createButton({
		title:"Done"
		//systemButton:Titanium.UI.iPhone.SystemButton.DONE
	});
	Ti.API.info('EditMenu.draw 6');
	//*
	if (!TiUtils.isAndroid()) {
		EditMenu.done.systemButton = Titanium.UI.iPhone.SystemButton.DONE;
		EditMenu.nav = Ti.UI.iPhone.createNavigationGroup({window:EditMenu.editMenuModal});
		EditMenu.editMenuModal.setRightNavButton(EditMenu.done);
	}
	else {
		EditMenu.done.height = 35;
		EditMenu.done.width = 200;
		EditMenu.modalNav = Titanium.UI.createView({
			height: 40,
			backgroundColor: "#000001",
			top: 0
		});
		EditMenu.modalNav.add(EditMenu.done);
		EditMenu.editMenuModal.add(EditMenu.modalNav);
	}
	// */
	Ti.API.info('EditMenu.draw 7');
	EditMenu.editMenuModal.add(EditMenu.table);
	Ti.API.info('EditMenu.draw 8');
	
	if (!TiUtils.isAndroid()) {
		EditMenu.editMenuModal.open({
			modal: true
		});
	}else{
		EditMenu.editMenuModal.open({
			modal: false
		});
	}
	Ti.API.info('EditMenu.draw 9a');
};


EditMenu.handleEditDoneBtnClick = function(){
	Titanium.API.info("EditMenu.handleEditDoneBtnClick 1");
	EditMenu.editMenuModal.close();
	Titanium.App.fireEvent('closeEditMenuEvent',{});
	Titanium.API.info("EditMenu.handleEditDoneBtnClick 2");
};

EditMenu.handleTableClick = function(e){
	Ti.API.info('**************handleTableClick breakpoint');
	
	if(e.rowData.title=='Edit Quote'){
		Titanium.API.info('clicked Edit Quote');
		Titanium.App.Properties.setString("quoteEditAction_preference","edit");
		Titanium.App.fireEvent('showQuoteEditorEvent',{});
		Titanium.App.fireEvent('closeEditMenuEvent',{});
		EditMenu.editMenuModal.close();
	}else if(e.rowData.title=='Delete Quote'){
		Titanium.API.info('clicked Delete Quote');
		Titanium.App.fireEvent('deleteQuoteEvent',{});		
		Titanium.App.fireEvent('closeEditMenuEvent',{});
	}
	
};

EditMenu.setEventListeners = function(){
	Titanium.API.info('((((((((((((((((((( set EditMenu.setEventListeners');
	EditMenu.table.addEventListener('click',EditMenu.handleTableClick);
	EditMenu.done.addEventListener('click',EditMenu.handleEditDoneBtnClick);
};

EditMenu.showMenu = function(){
	if (!EditMenu.inited) {
		EditMenu.init();
		EditMenu.inited = true;
	}else{
		EditMenu.initTable();
		EditMenu.editMenuModal.add(EditMenu.table);
		if (!TiUtils.isAndroid()) {
			EditMenu.editMenuModal.open({
				modal: true
			});
		}else{
			EditMenu.editMenuModal.open({
				modal: false
			});
		}
	}
	
};

EditMenu.initTable = function(){
	EditMenu.table = Ti.UI.createTableView({		
		data:[
			{
				title:"Edit Quote",
				hasChild:true, 
				header:'Saved Quote Options'
			},
			{
				title:"Delete Quote"
			}],
		backgroundImage: "images/" + TiUtils.getOsName() + "-images/bg.png",
		style:Ti.UI.iPhone.TableViewStyle.GROUPED
	});
	if (!TiUtils.isAndroid()) {
		EditMenu.table.style = Ti.UI.iPhone.TableViewStyle.GROUPED;
	}else{
		EditMenu.table.backgroundColor = "#000000";
		EditMenu.table.fontWeight = "bold";
		EditMenu.table.top = 40;
	}
	EditMenu.table.addEventListener('click',EditMenu.handleTableClick);
};

EditMenu.hideMenu = function(){
	//EditMenu.editMenuModal.close();
};