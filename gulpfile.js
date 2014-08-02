var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var uglify = require("gulp-uglify");

gulp.task('watchify', function() {
  var bundler = watchify(browserify('./public/scripts/review/app.js', { cache: {}, packageCache: {}, fullPaths: true, debug: true }));
  bundler.on('update', rebundle)

  var applyBundler = watchify(browserify('./public/scripts/apply/app.js', { cache: {}, packageCache: {}, fullPaths: true, debug: true }));
  applyBundler.on('update', rebundleApply)

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('bundle.js'))
      //.pipe(streamify(uglify()))
      .pipe(gulp.dest('./public/scripts/review'));
  }

  function rebundleApply() {
    return applyBundler.bundle()
      // log errors if they happen
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('bundle.js'))
      //.pipe(streamify(uglify()))
      .pipe(gulp.dest('./public/scripts/apply'));
  }
});

gulp.task('watch', ['watchify'])

gulp.task('default', ['watch'])
