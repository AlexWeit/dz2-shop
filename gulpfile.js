/* --------- plugins --------- */

var
	gulp        = require('gulp'),
	compass     = require('gulp-compass'),
	jade        = require('gulp-jade'),
	browserSync = require('browser-sync').create(),
	browserify  = require('gulp-browserify'),
	uglify      = require('gulp-uglify'),
	rename      = require("gulp-rename"),
	plumber     = require('gulp-plumber'),
	concat      = require('gulp-concat');

/* --------- paths --------- */

var
	paths = {
		jade : {
			location    : 'app/markups/**/*.jade',
			compiled    : 'app/markups/_pages/*.jade',
			destination : 'app/'
		},

		scss : {
			location    : 'app/scss/**/*.scss',
			entryPoint  : 'app/css/main.css'
		},

		compass : {
			configFile  : 'config.rb',
			cssFolder   : 'app/css',
			scssFolder  : 'app/scss',
			imgFolder   : 'app/img'
		},

		js : {
			location    : 'app/js/main.js',
			plugins     : 'app/js/_plugins/*.js',
			destination : 'app/js'
		},

		browserSync : {
			baseDir : './',
			watchPaths : ['app/*.html', 'app/css/*.css', 'app/js/*.js']
		}
	}

/* --------- jade --------- */

gulp.task('jade', function() {
	gulp.src(paths.jade.compiled)
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
		}))
		.pipe(gulp.dest(paths.jade.destination));
});

/* --------- scss-compass --------- */

gulp.task('compass', function() {
	gulp.src(paths.scss.location)
		.pipe(plumber())
		.pipe(compass({
			config_file: paths.compass.configFile,
			css: paths.compass.cssFolder,
			sass: paths.compass.scssFolder,
			image: paths.compass.imgFolder
		}));
});

/* --------- browser sync --------- */

gulp.task('sync', function() {
	browserSync.init({
		server: {
			baseDir: paths.browserSync.baseDir
		}
	});
});

/* --------- plugins --------- */

gulp.task('plugins', function() {
	return gulp.src(paths.js.plugins)
		.pipe(plumber())
		.pipe(concat('plugins.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.js.destination));
});

/* --------- plugins --------- */

gulp.task('scripts', function() {
	return gulp.src(paths.js.location)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(rename('main.min.js'))
		.pipe(gulp.dest(paths.js.destination));
});

/* --------- watch --------- */

gulp.task('watch', function(){
	gulp.watch(paths.jade.location, ['jade']);
	gulp.watch(paths.scss.location, ['compass']);
	gulp.watch(paths.js.location, ['scripts']);
	gulp.watch(paths.js.plugins, ['plugins']);
	gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
});

/* --------- default --------- */

gulp.task('default', ['jade', 'compass', 'plugins', 'scripts', 'sync', 'watch']);