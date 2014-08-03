var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var uglify = require("gulp-uglify");
var moment = require("moment");

gulp.task('watchify', function() {
  var bundler = watchify(browserify('./public/scripts/review/app.js', { cache: {}, packageCache: {}, fullPaths: true, debug: true }));
  bundler.on('update', rebundle)

  var applyBundler = watchify(browserify('./public/scripts/apply/app.js', { cache: {}, packageCache: {}, fullPaths: true, debug: true }));
  applyBundler.on('update', rebundleApply)

  var registerBundler = watchify(browserify('./public/scripts/register/app.js', { cache: {}, packageCache: {}, fullPaths: true, debug: true }));
  registerBundler.on('update', rebundleRegister)

  function rebundle () {

    gutil.log('---------BUNDLING REVIEW.JS---------');
    gutil.log(moment().format("M/D/YY - h:mm:ss a"));
    gutil.log('------------------------------------');

    return bundler.bundle()
      // log errors if they happen
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('review.js'))
      //.pipe(streamify(uglify()))
      .pipe(gulp.dest('./public/scripts/review'));
  }

  function rebundleApply() {

    gutil.log('---------BUNDLING APPLY.JS---------');
    gutil.log(moment().format("M/D/YY - h:mm:ss a"));
    gutil.log('------------------------------------');

    return applyBundler.bundle()
      // log errors if they happen
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('apply.js'))
      //.pipe(streamify(uglify()))
      .pipe(gulp.dest('./public/scripts/apply'));
  }

  function rebundleRegister() {

    gutil.log('---------BUNDLING REGISTER.JS---------');
    gutil.log(moment().format("M/D/YY - h:mm:ss a"));
    gutil.log('------------------------------------');

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
