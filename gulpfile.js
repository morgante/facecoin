var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var sass = require('gulp-sass');

// Basic usage
gulp.task('scripts:compile', function() {
	console.log('scripts compile...');

	// Single entry point to browserify
	gulp.src('./assets/scripts/main.js')
		.pipe(browserify({
			insertGlobals : false,
			debug : !gulp.env.production
		}))
		.pipe(gulp.dest('./public/js/'));
});

gulp.task('scripts:watch', function () {
    gulp.watch('./assets/scripts/**/*.js', [ 'scripts:compile' ]);
});

/**
 * Compile Sass
 */
gulp.task('sass:compile', function () {
    gulp.src('./assets/stylesheets/*.scss')
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./assets/stylesheets/**/*.scss', [ 'sass:compile' ]);
});

gulp.task('compile', [ 'sass:compile', 'scripts:compile' ]);
gulp.task('watch', [ 'sass:watch', 'scripts:watch' ]);
gulp.task('default', [ 'compile', 'watch' ]);