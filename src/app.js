function ui() {
	return SpreadsheetApp.getUi();
}

function onOpen() {
	ui()
		.createMenu( 'Calendars' )
		.addItem( 'Generate', 'genrateBasic' )
		.addItem( 'Custom', 'showCustom' )
		.addToUi();
}

function genrateBasic() {
	new Calendar( {
		sheet: 0, // Number or name of sheet to the calendar
		year: ( new Date() ).getFullYear(), // Specify a year to print
		verticalFill: 60, // How many rows downward to style
		monthColors: {
			odd: '#eeeeee', // Color of every ODD month (jan, mar, may...etc)
			even: '#ffffff', // Color of every EVEN month (feb, apr, jun...etc)
			border: '#333333' // Month divider color
		},
		dayColors: {
			weekend: '#eeeeee', // Weekend cell color
			weekday: '#ffffff' // Weekday cell color
		},
		labels: {
			// Set the month lables (for translations)
			months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
			// Set the day lables (for translations)
			days: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
		}
	} );
}

function showCustom() {
	var html = HtmlService.createHtmlOutputFromFile( 'interface.html' )
		.setWidth( 425 )
		.setHeight( 600 )
		.setSandboxMode( HtmlService.SandboxMode.IFRAME );
  	
  	ui().showModalDialog( html, 'Custom calendar' );
}