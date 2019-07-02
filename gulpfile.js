'use strict';

// Generic
const gulp = require( 'gulp' );
const babel = require( 'gulp-babel' );
const minify = require( 'gulp-babel-minify' );

gulp.task( 'build', function() {
	return gulp.src( './src/script.js' )
		.pipe( babel( {
			'presets': [ '@babel/preset-env' ]
		} ) )
		.on( 'error', console.error.bind( console ) )
		.pipe( minify() )
		.pipe( gulp.dest( './dist' ) );
} );

// Gulp default process
gulp.task( 'default', [ 'build' ] );