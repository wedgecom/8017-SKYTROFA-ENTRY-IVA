'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
// var eslint = require('gulp-eslint');
var fileSync = require('gulp-file-sync');
var fs = require("fs");
var htmlmin = require('gulp-htmlmin');
var nunjucksRender = require('gulp-nunjucks-render');
var path = require('path');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var terser = require('gulp-terser');
var zip = require('gulp-zip');
var sass = require('gulp-sass')(require('sass'));


// Used to label the zips
const projectName = '_SKYTROFA-CROSS-FUNCTIONAL-SEGMENTED-ENTRY';


// BrowserSync
gulp.task('server', function () {
	browserSync({
		server: {
			baseDir: "./build",
		},
		startPath: "/0_0/",
		callbacks: {
			ready: function () {
				console.log(__dirname.split(path.sep).pop() + " : Port: " + this.instance.server._connectionKey);
			}
		}
	});
});


// Scripts
gulp.task('scripts', function () {

	gulp.src('./src/html/pages/*/js/*.js')
	.pipe(gulp.dest('./dist/'))
	.pipe(gulp.dest('./build/'));

	return gulp.src('./src/assets/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		// .pipe(eslint())
		// .pipe(eslint.format())
		.pipe(concat('bundle.js'))
		.pipe(babel())
		.pipe(terser())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build/shared/js/'))
		.pipe(browserSync.stream())
		.pipe(gulp.dest('./dist/shared/js/'));
});


// Styles
gulp.task('styles', function () {
	return gulp.src('./src/assets/css/main.scss')
		.pipe(sourcemaps.init())
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build/shared/css/'))
		.pipe(browserSync.stream())
		.pipe(gulp.dest('./dist/shared/css/'));
});


// Templates (Nunjucks)
gulp.task('templates', function () {
	return gulp.src('src/html/pages/**/*.html')
		.pipe(nunjucksRender({
			path: 'src/html/templates/',
		}))
		.pipe(htmlmin({
			collapseWhitespace: false,
			removeComments: true
		}))
		.pipe(gulp.dest('./build/'))
		.pipe(browserSync.stream())	
});
gulp.task('templatesDist', function () {
	return gulp.src('src/html/pages/**/*.html')
		.pipe(nunjucksRender({
			path: 'src/html/templates/',
			data: {
				forDist: true,
				projectName: projectName
			}
		}))
		.pipe(htmlmin({
			collapseWhitespace: false,
			removeComments: false
		}))
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.stream())	
});


// Keep Build and Dist folders synced with SRC
gulp.task('fileSync', function() {

	// Sync on startup
	fileSync('./src/html/pages/', './build/', {recursive: true, ignore: [/.*\.html/, 'css', 'js']});
	fileSync('./src/html/pages/', './dist/', {recursive: true, ignore: [/.*\.html/, 'css', 'js']});

	// Sync Build Folder
	gulp.watch(['./src/html/pages/*/**'], function(done) {
    fileSync('./src/html/pages/', './build/', {recursive: true, ignore: [/.*\.html/, 'css', 'js']});
		done();
  });

	// Sync Dist Folder
	gulp.watch(['./src/html/pages/*/**'], function(done) {
    fileSync('./src/html/pages/', './dist/', {recursive: true, ignore: [/.*\.html/, 'css', 'js']});
		done();
  });

});


// Zip Files
gulp.task('zip', function (done) {
	var distFoldersArray = fs.readdirSync('./build/');
	for (let i=0; i < distFoldersArray.length; i++) {
		//console.log(distFoldersArray[i]);
		gulp.src(['dist/' + distFoldersArray[i] + '/**/*', '!dist/' + distFoldersArray[i] + '/**/*.*.map'])
				.pipe(zip(distFoldersArray[i] + projectName + '.zip'))
				.pipe(gulp.dest('./zips/'));
	}
	done();
});


// Watch Task
gulp.task('watch', function () {

	// watch html
	gulp.watch(['src/html/**/*.hbs', 'src/html/**/*.html'], gulp.series('templates', 'templatesDist'));

	// watch javascript
	gulp.watch(['src/assets/js/**/*.js', 'src/html/pages/*/js/*.js'], gulp.series('scripts'));

	// watch scss
	gulp.watch(['src/assets/css/**/*.scss', 'src/assets/css/**/*.sass'], gulp.series('styles'));

});


// Build
gulp.task('build', gulp.series('scripts', 'styles', 'templates', 'templatesDist', 'fileSync'));

// Default
gulp.task('default', gulp.parallel('build', 'server', 'watch'));