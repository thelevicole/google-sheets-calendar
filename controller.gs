function Calendar( options ) {

	/**
	 * Deep extend objects
	 *
	 * @access	private
	 * 
	 * @param	{Object}	out
	 * @return	{Object}
	 */
	var deepExtend = function( out ) {
		out = out || {};

		for ( var i = 1; i < arguments.length; i++ ) {
			var obj = arguments[ i ];

			if ( !obj ) {
				continue;
			}

			for ( var key in obj ) {
				if ( obj.hasOwnProperty( key ) ) {
					if ( typeof obj[ key ] === 'object' ) {
						out[ key ] = deepExtend( out[ key ], obj[ key ] );
					} else {
						out[ key ] = obj[ key ];
					}
				}
			}
		}

		return out;
	};

	/**
	 * Validate if `val` is a valid integer, else use fallback
	 *
	 * @access	private
	 * 
	 * @param	{Mixed}		val
	 * @param	{Integer}	fallback [description]
	 * @return	{Integer}
	 */
	var validateInt = function( val, fallback ) {
		return !isNaN( parseInt( val ) ) ? parseInt( val ) : fallback;
	};

	/**
	 * Get sheet by option.sheet
	 *
	 * @access	private
	 * 
	 * @return	{Object}	Specific sheet
	 */
	var getSheet = function() {
		var activeDocument = SpreadsheetApp.getActiveSpreadsheet();
		var allSheets = activeDocument.getSheets();

		if ( validateInt( options.sheet, false ) !== false ) {
			return allSheets[ validateInt( options.sheet, 0 ) ];
		} else {
			for ( var i = 0; i < allSheets.length; i++ ) {
				if ( allSheets[ i ].getName() === options.sheet ) {
					return allSheets[ i ];
				}
			}
		}

		// Fallback to active sheet
		return activeDocument.getActiveSheet();
	};

	/**
	 * Get the total number of days in a given year
	 *
	 * @access	private
	 * 
	 * @param	{Integer}	year
	 * @return	{Integer}
	 */
	var getDaysInYear = function( year ) {
		var isLeap = year % 400 === 0 || ( year % 100 !== 0 && year % 4 === 0 );
		return isLeap ? 366 : 365;
	};

	/**
	 * Get days in a given month and year
	 *
	 * @access	private
	 * 
	 * @param	{Integer}	month
	 * @param	{Integer}	year
	 * @return	{Array}				Returns array of date objects
	 */
	var getDaysInMonth = function( month, year ) {
		var date = new Date( year, month, 1 );
		var days = [];

		while ( date.getMonth() === month ) {
			days.push( new Date( date ) );
			date.setDate( date.getDate() + 1 );
		}
		
		return days;
	};

	/**
	 * Merge cells horizontally
	 *
	 * @access	private
	 * 
	 * @param	{Integer}	row
	 * @param	{Integer}	col
	 * @param	{Integer}	mergeTotal
	 * @return	{Object}
	 */
	var horizontalMerge = function( row, col, mergeTotal ) {
		
		getSheet()
			// row, col, rows, cols		
			.getRange( row, col, 1, mergeTotal )
			.mergeAcross();

		var cell = getSheet().getRange( row, col, 1, mergeTotal );
			
		cell.setHorizontalAlignment( 'center' );

		return cell;
	};

	/**
	 * Format a number with suffix
	 *
	 * @access	private
	 * 
	 * @param	{Number}	number
	 * @return	{String}
	 */
	var suffixNumber = function( number ) {
		var suffix = 'th';
		var remainder = number % 10;

		if ( number > 3 && number < 21 ) {
			suffix = 'th'; 
		} else if ( remainder === 1 ) {
			suffix = 'st';
		} else if ( remainder === 2 ) {
			suffix = 'nd';
		} else if ( remainder === 3 ) {
			suffix = 'rd';
		}

		return number + suffix;
	}

	/**
	 * Set default options
	 *
	 * @access private
	 * 
	 * @type {Object}
	 */
	options = deepExtend( {}, {
		sheet: null,
		year: ( new Date() ).getFullYear(),
		verticalFill: 60,
		monthColors: {
			odd: '#eeeeee',
			even: '#ffffff',
			border: '#333333'
		},
		dayColors: {
			weekend: '#eeeeee',
			weekday: '#ffffff'
		},
		labels: {
			months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
			days: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
		}
	}, options );

	/**
	 * Set a publicly accessible sheet attribute
	 *
	 * @access public
	 * 
	 * @type {Object}
	 */
	this.sheet = getSheet();

	/**
	 * Generate year columns
	 * 
	 * @access	public
	 *
	 * @return	{Void}
	 */
	this.generateYear = function() {
		
		// Total number of days in the year
		var yearDays = getDaysInYear( options.year );

		// Insert a column for each day of this year if not enough in sheet
		if ( getSheet().getMaxColumns() < yearDays ) {
			getSheet().insertColumns( 1, yearDays );
		}
	};

	/**
	 * Generate month columns
	 * 
	 * @access	public
	 *
	 * @return	{Void}
	 */
	this.generateMonths = function() {
		
		var monthRow = 1;

		// Size row
		getSheet()
			.setRowHeight( monthRow, 50 );

		// Last cell
		var lastCol = 0;

		// Loop each month
		for ( var i = 0; i < 12; i++ ) {
			var month = options.labels.months[ i ];
			var days = getDaysInMonth( i, options.year );

			var startAt = lastCol + 1;

			// Insert month label
			// row, col, mergeTotal
			horizontalMerge( monthRow, startAt, days.length )
				.setValue( month + ' ' + options.year )
				.setFontWeight( 'bold' )
				.setVerticalAlignment( 'middle' )
				.setBackground( i % 2 === 0 ? options.monthColors.odd : options.monthColors.even )
				.setBorder( null, null, null, true, null, null, options.monthColors.border, SpreadsheetApp.BorderStyle.SOLID_THICK );

			// Now set last cell value
			lastCol = lastCol + days.length;
		}
	};

	/**
	 * Generate day columns
	 * 
	 * @access	public
	 *
	 * @return	{Void}
	 */
	this.generateDays = function() {
		var dayRow = 2;

		// Size row
		getSheet()
			.setRowHeight( dayRow, 100 );

		// Last cell
		var lastCol = 0;

		// Loop each month
		for ( var i = 0; i < 12; i++ ) {
			
			var days = getDaysInMonth( i, options.year );
			var startAt = lastCol + 1;

			for ( var j = 0; j < days.length; j++ ) {
				var day = days[ j ];
				var colPos = ( startAt + j );

				getSheet()
					.getRange( dayRow, colPos )
					.setTextRotation( 90 )
					.setValue( suffixNumber( j + 1 ) + ' ' + options.labels.days[ day.getDay() ] );

				// Size column
				getSheet()
					.setColumnWidth( colPos, 30 );

				// Set cell colors
				var rowFill = validateInt( options.verticalFill, 30 ); //getSheet().getMaxRows();

				getSheet()
					.getRange( dayRow, colPos, rowFill )
					.setBackground( day.getDay() == 6 || day.getDay() == 0 ? options.dayColors.weekend : options.dayColors.weekday );

				// If is last day
				if ( j === ( days.length - 1 ) ) {
					getSheet()
						.getRange( dayRow, colPos, rowFill )
						.setBorder( null, null, null, true, null, null, options.monthColors.border, SpreadsheetApp.BorderStyle.SOLID_THICK );
				}
			}

			// Now set last cell value
			lastCol = lastCol + days.length;
		}
	};


	/**
	 * Run on init
	 */
	this.generateYear();
	this.generateMonths();
	this.generateDays();

	// Freeze month and day columns
	getSheet().setFrozenRows( 2 );
}