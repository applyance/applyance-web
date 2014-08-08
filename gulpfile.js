var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var uglify = require("gulp-uglify");
var moment = require("moment");

gulp.task('watchify', function() {

  //
  // Watch for JS changes in the Review Module
  //
  var reviewBundler = watchify(browserify('./public/scripts/review/app.js', { cache: {}, packageCache: {}, fullPaths: true, debug: true }));
  reviewBundler.on('update', rebundleReview);
  rebundleReview();

  function rebundleReview() {

    gutil.log(gutil.colors.green('---------BUNDLING REVIEW.JS: ' + moment().format("M/D/YY - h:mm:ss a") + ' ---------'));

    return reviewBundler.bundle()
      // log errors if they happen
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('review.js'))
      //.pipe(streamify(uglify()))
      .pipe(gulp.dest('./public/scripts/review'));
  }


  //
  // Watch for JS changes in the Apply Module
  //
  var applyBundler = watchify(browserify('./public/scripts/apply/app.js', { cache: {}, packageCache: {}, fullPaths: true, debug: true }));
  applyBundler.on('update', rebundleApply);
  rebundleApply();

  function rebundleApply() {

    gutil.log(gutil.colors.green('---------BUNDLING APPLY.JS ' + moment().format("M/D/YY - h:mm:ss a") + ' ---------'));

    return applyBundler.bundle()
      // log errors if they happen
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('apply.js'))
      //.pipe(streamify(uglify()))
      .pipe(gulp.dest('./public/scripts/apply'));
  }

  //
  // Watch for JS changes in the Register Module
  //
  var registerBundler = watchify(browserify('./public/scripts/register/app.js', { cache: {}, packageCache: {}, fullPaths: true, debug: true }));
  registerBundler.on('update', rebundleRegister);
  rebundleRegister();

  function rebundleRegister() {

    gutil.log(gutil.colors.green('---------BUNDLING REGISTER.JS ' + moment().format("M/D/YY - h:mm:ss a") + ' ---------'));

    return registerBundler.bundle()
      // log errors if they happen
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('register.js'))
      //.pipe(streamify(uglify()))
      .pipe(gulp.dest('./public/scripts/register'));
  }
});

gulp.task('watch', ['watchify'])

gulp.task('default', ['watch'])
