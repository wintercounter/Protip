"use strict";

var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')
var concat = require('gulp-concat')
var browserify = require('browserify');

gulp.task('babel', function () {
	return gulp.src("src/**/*.es6")
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['transform-class-properties']
		}))
		.pipe(gulp.dest('./temp'));
});

gulp.task('browserify', function () {
	return browserify('./temp/Prototype.js')
			.bundle()
			//Pass desired output filename to vinyl-source-stream
			//.pipe(source('protip.js'))
			// Start piping stream to tasks!
			.pipe(gulp.dest('./dist/'));
});



/*

var gulp = require('gulp')

var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')

var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var merge = require('utils-merge')

var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')


/!* nicer browserify errors *!/
var gutil = require('gulp-util')
var chalk = require('chalk')

function map_error(err) {
	if (err.fileName) {
		// regular error
		gutil.log(chalk.red(err.name)
				+ ': '
				+ chalk.yellow(err.fileName.replace(__dirname + '/src/', ''))
				+ ': '
				+ 'Line '
				+ chalk.magenta(err.lineNumber)
				+ ' & '
				+ 'Column '
				+ chalk.magenta(err.columnNumber || err.column)
				+ ': '
				+ chalk.blue(err.description))
	} else {
		// browserify error..
		gutil.log(chalk.red(err.name)
				+ ': '
				+ chalk.yellow(err.message))
	}
}

gulp.task('watchify', function () {
	var args = merge(watchify.args, { debug: true })
	var bundler = watchify(browserify('./src/js/Api.es6', args)).transform(babelify, {
		presets: ['es2015'],
		plugins: ['transform-class-properties']
	})
	bundle_js(bundler)

	bundler.on('update', function () {
		bundle_js(bundler)
	})
})

function bundle_js(bundler) {
	return bundler.bundle()
			.on('error', map_error)
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(gulp.dest('dist'))
			.pipe(rename('protip.min.js'))
			.pipe(sourcemaps.init({ loadMaps: true }))
			// capture sourcemaps from transforms
			.pipe(uglify())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('dist'))
}

// Without watchify
gulp.task('browserify', function () {
	var bundler = browserify('./src/Api.es6', { debug: true }).transform(babelify, {
		presets: ['es2015'],
		plugins: ['transform-class-properties']
	})

	return bundle_js(bundler)
})

// Without sourcemaps
gulp.task('browserify-production', function () {
	var bundler = browserify('./src/js/app.js').transform(babelify, {
		presets: ['es2015'],
		plugins: ['transform-class-properties']
	})

	return bundler.bundle()
			.on('error', map_error)
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(rename('app.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest('dist'))
})*/
