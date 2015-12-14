var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')
var concat = require('gulp-concat')

gulp.task('default', function () {
	return gulp.src("src/**/*.es6")
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('protip.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('.'));
});