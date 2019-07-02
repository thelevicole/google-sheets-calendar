function ui() {
	return SpreadsheetApp.getUi();
}

function onOpen() {
	ui()
		.createMenu( 'Calendars' )
		.addItem( 'Generate', 'genrateCalendar' )
		.addItem( 'Custom', 'showCustom' )
		.addToUi();
}

function genrateCalendar( options ) {
	new Calendar( options );
}

function showCustom() {
	var template = HtmlService.createTemplateFromFile( 'interface.html' );

	var activeDocument = SpreadsheetApp.getActiveSpreadsheet();

	template.data = {
		sheets: activeDocument.getSheets(),
		currentSheet: activeDocument.getActiveSheet()
	};

	var html = template.evaluate();
	
	ui().showModalDialog( html, 'Custom calendar' );
}