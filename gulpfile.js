var gulp       = require('gulp');
var gutil      = require('gulp-util');
var source     = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify   = require('watchify');
var streamify  = require('gulp-streamify');
var uglify     = require("gulp-uglify");
var moment     = require("moment");
var sass = require('gulp-ruby-sass');
var args   = require('yargs').argv;
var gulpif = require('gulp-if');
var exit = require('gulp-exit');
var _ = require('lodash');
var karma = require('karma').server;

var isProduction = args.env === 'production';

var paths = {
  styles: 'public/styles/scss/**/*'
};

var karmaCommonConf = {
  frameworks: ['jasmine'],
  files: [
    'public/scripts/review/review.js',
    'public/scripts/apply/apply.js',
    'public/scripts/register/register.js',
    'test/**/*.spec.js'
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
  return gulp.src('public/styles/scss/**/*')
    .pipe(sass())
    .on('error', function (err) { console.log(err.message); })
    .pipe(gulp.dest('public/styles/css'));
});

gulp.task('watchify', function() {

  var reviewBundler = watchify(browserify('./public/scripts/review/app.js', {
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true
  }));
  var applyBundler = watchify(browserify('./public/scripts/apply/app.js', {
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true
  }));
  var registerBundler = watchify(browserify('./public/scripts/register/app.js', {
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
      .pipe(gulp.dest('./public/scripts/review'));
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
      .pipe(gulp.dest('./public/scripts/apply'));
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
      .pipe(gulp.dest('./public/scripts/register'));
  }

  // Watch for JS changes in the Review Module
  reviewBundler.on('update', rebundleReview);

  // Watch for JS changes in the Apply Module
  applyBundler.on('update', rebundleApply);

  // Watch for JS changes in the Register Module
  registerBundler.on('update', rebundleRegister);
});

gulp.task('watch', ['sass', 'buildJS','watchify', 'tdd'], function() {

  gulp.watch(paths.styles, ['sass']);
});

gulp.task('buildJS', function() {

  //
  // Bundle the Review JS files
  //
  browserify('./public/scripts/review/app.js', {
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
  .pipe(gulp.dest('./public/scripts/review'));

  //
  // Bundle the Apply JS files
  //
  browserify('./public/scripts/apply/app.js', {
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
  .pipe(gulp.dest('./public/scripts/apply'));

  //
  // Bundle the Register JS files
  //
  browserify('./public/scripts/register/app.js', {
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
  .pipe(gulp.dest('./public/scripts/register'));
});

gulp.task('build', ['sass', 'buildJS']);

gulp.task('default', ['watch']);

