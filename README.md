# Google Sheets Calendar Generator

Generates a spreadsheet divided by months and days, like this:

![Example spreadsheet](https://i.imgur.com/4c5hJYX.png)
[View example here](https://docs.google.com/spreadsheets/d/12aCPyi9v5EyFGKHUkTyeSV41u0wSPEXex6xkFxxVoII/edit)

## Usage

While in Google Sheets go to `Tools > Script editor`. Once in the script editor do the following.

1. Copy and paste the contents of `dist/script.js` into the editor.
2. Create a basic function for the editor to call. See example below.
3. Select your function from the "Select function" menu.
4. Finally, click the ▶ (run) button

## Example

```javascript
... /* Pasted contents of dist/script.js */ ...

function run() {
	new Calendar();
}
```

### Options

Below are all the available options with their default values.

```javascript
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
```

## Todo

Turn this into its own add-on with a simple to use interface.