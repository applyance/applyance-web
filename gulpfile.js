var gulp       = require('gulp');
var gulpif     = require('gulp-if');
var sass       = require('gulp-ruby-sass');
var streamify  = require('gulp-streamify');
var uglify     = require("gulp-uglify");
var gutil      = require('gulp-util');

var browserify = require('browserify');
var karma      = require('karma').server;
var _          = require('lodash');
var moment     = require("moment");
var source     = require('vinyl-source-stream');
var watchify   = require('watchify');
var args       = require('yargs').argv;

var isProduction = args.env === 'production';

var paths = {
  styles_in: 'assets/scss/**/*',
  styles_out: 'public/styles/css',

  applyJS_root: './assets/scripts/apply/app.js',
  registerJS_root: './assets/scripts/register/app.js',
  reviewJS_root: './assets/scripts/review/app.js',
  script_out: './public/scripts',

  tests: 'test/**/*.spec.js'
};

var karmaCommonConf = {
  frameworks: ['jasmine'],
  files: [
    paths.script_out + "/apply.js",
    paths.script_out + "/register.js",
    paths.script_out + "/review.js",
    paths.tests
  ]
};

//Run test once and exit (for CI)
gulp.task('test', function (done) {
  karma.start(_.assign({}, karmaCommonConf, {singleRun: true, browsers: ['PhantomJS']}), done);
});

// Watch for file changes and re-run tests on each change (for local dev - included in watch task)
gulp.task('tdd', function (done) {
  karma.start(_.assign({}, karmaCommonConf, {browsers: ['Chrome']}), done);
  // karma.start(karmaCommonConf, done);
});

gulp.task('sass', function () {

  gutil.log(gutil.colors.green('---------BUNDLING CSS: ' + moment().format("M/D/YY - h:mm:ss a") + ' ---------'));
  return gulp.src('assets/scss/**/*')
    .pipe(sass())
    .on('error', function (err) { console.log(err.message); })
    .pipe(gulp.dest(paths.styles_out));
});

gulp.task('watchify', function() {

  var reviewBundler = watchify(browserify(paths.reviewJS_root, {
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true
  }));
  var applyBundler = watchify(browserify(paths.applyJS_root, {
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true
  }));
  var registerBundler = watchify(browserify(paths.registerJS_root, {
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true
  }));

  function rebundleReview() {

    gutil.log(gutil.colors.green('---------BUNDLING REVIEW.JS: ' + moment().format("M/D/YY - h:mm:ss a") + ' ---------'));

    return reviewBundler.bundle()
      // log errors if they happen
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('review.js'))
      .pipe(gulpif(isProduction, streamify(uglify()))) // only minify if production
      .pipe(gulp.dest(paths.script_out));
  }
  function rebundleApply() {

    gutil.log(gutil.colors.green('---------BUNDLING APPLY.JS ' + moment().format("M/D/YY - h:mm:ss a") + ' ---------'));

    return applyBundler.bundle()
      // log errors if they happen
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('apply.js'))
      .pipe(gulpif(isProduction, streamify(uglify()))) // only minify if production
      .pipe(gulp.dest(paths.script_out));
  }
  function rebundleRegister() {

    gutil.log(gutil.colors.green('---------BUNDLING REGISTER.JS ' + moment().format("M/D/YY - h:mm:ss a") + ' ---------'));

    return registerBundler.bundle()
      // log errors if they happen
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('register.js'))
      .pipe(gulpif(isProduction, streamify(uglify()))) // only minify if production
      .pipe(gulp.dest(paths.script_out));
  }

  // Watch for JS changes in the Review Module
  reviewBundler.on('update', rebundleReview);

  // Watch for JS changes in the Apply Module
  applyBundler.on('update', rebundleApply);

  // Watch for JS changes in the Register Module
  registerBundler.on('update', rebundleRegister);
});

gulp.task('watch', ['build', 'watchify'], function() {
  gulp.watch(paths.styles_in, ['sass']);
});

gulp.task('buildJS', function() {

  //
  // Bundle the Review JS files
  //
  browserify(paths.reviewJS_root, {
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: !isProduction
  })
  .bundle()
  .on('error', function(e) { // log errors if they happen
    gutil.log('Browserify Error', e);
  })
  .pipe(source('review.js'))
  .pipe(gulpif(isProduction, streamify(uglify()))) // only minify if production
  .pipe(gulp.dest(paths.script_out));

  //
  // Bundle the Apply JS files
  //
  browserify(paths.applyJS_root, {
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: !isProduction
  })
  .bundle()
  .on('error', function(e) { // log errors if they happen
    gutil.log('Browserify Error', e);
  })
  .pipe(source('apply.js'))
  .pipe(gulpif(isProduction, streamify(uglify()))) // only minify if production
  .pipe(gulp.dest(paths.script_out));

  //
  // Bundle the Register JS files
  //
  browserify(paths.registerJS_root, {
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: !isProduction
  })
  .bundle()
  .on('error', function(e) { // log errors if they happen
    gutil.log('Browserify Error', e);
  })
  .pipe(source('register.js'))
  .pipe(gulpif(isProduction, streamify(uglify()))) // only minify if production
  .pipe(gulp.dest(paths.script_out));
});

gulp.task('build', ['sass', 'buildJS']);

gulp.task('default', ['watch']);
