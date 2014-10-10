var gulp       = require('gulp');
var gulpif     = require('gulp-if');
var sass       = require('gulp-ruby-sass');
var streamify  = require('gulp-streamify');
var uglify     = require("gulp-uglify");
var gutil      = require('gulp-util');
var templateCache = require('gulp-angular-templatecache');

var browserify = require('browserify');
var karma      = require('karma').server;
var _          = require('lodash');
var moment     = require("moment");
var source     = require('vinyl-source-stream');
var watchify   = require('watchify');
var args       = require('yargs').argv;

var isProduction = args.env === 'production';

//
// Paths
//

var paths = {
  styles: {
    in: 'assets/scss/**/*',
    out: 'public/styles/css',
    toCompile: [
      'assets/scss/apply.scss',
      'assets/scss/base.scss',
      'assets/scss/public.scss',
      'assets/scss/review.scss'
    ]
  },

  templates: './public/views/**/*',

  applyJS_root: './assets/scripts/apply/app.js',
  registerJS_root: './assets/scripts/register/app.js',
  reviewJS_root: './assets/scripts/review/app.js',
  script_out: './public/scripts',

  tests: 'test/**/*.spec.js'
};

//
// Karma Tests
//

var karmaCommonConf = {
  frameworks: ['jasmine'],
  files: [
    paths.script_out + "/apply.js",
    paths.script_out + "/register.js",
    paths.script_out + "/review.js",
    paths.tests
  ]
};

//
// Logging Util
//

var LOG = {
  message: function(msg) {
    gutil.log('--------- ' + msg + ' at ' + moment().format("M/D/YY - h:mm:ss a") + ' ---------');
  },
  success: function(msg) {
    gutil.log(gutil.colors.green('--------- ' + msg + ' at ' + moment().format("M/D/YY - h:mm:ss a") + ' ---------'));
  },
  error: function(msg) {
    gutil.log(gutil.colors.red('--------- ' + msg + ' at ' + moment().format("M/D/YY - h:mm:ss a") + ' ---------'));
  }
};

//
// Testing
//

// Run test once and exit (for CI)
gulp.task('test', function (done) {
  karma.start(_.assign({}, karmaCommonConf, {singleRun: true, browsers: ['PhantomJS']}), done);
});

// Watch for file changes and re-run tests on each change (for local dev - included in watch task)
gulp.task('tdd', function (done) {
  karma.start(_.assign({}, karmaCommonConf, {browsers: ['Chrome']}), done);
});

//
// SASS
//

gulp.task('sass', function() {

  LOG.message("Started SASS");

  gulp.src(paths.styles.toCompile)
    .pipe(sass())
    .on('error', function(err) {
      LOG.error(err.message);
    })
    .on('end', function() {
      LOG.success("Finished SASS");
    })
    .pipe(gulp.dest(paths.styles.out));

  return;
});

//
// Process template cache for angular
//

gulp.task('templateCache', function () {

  // Apply
  gulp.src('./public/views/apply/**/*.html')
    .pipe(templateCache("templates.js", {
      root: '/views/apply/',
      module: 'Apply',
      moduleSystem: 'Browserify'
      }))
    .pipe(gulp.dest('./assets/scripts/apply'));

  // Directives
  gulp.src('./public/views/directives/**/*.html')
    .pipe(templateCache("templates.js", {
      module: 'Applyance',
      root: '/views/directives/',
      moduleSystem: 'Browserify'
    }))
    .pipe(gulp.dest('./assets/scripts'));

  // Review
  gulp.src('./public/views/review/**/*.html')
    .pipe(templateCache("templates.js", {
      module: 'Review',
      root: '/views/review/',
      moduleSystem: 'Browserify'
    }))
    .pipe(gulp.dest('./assets/scripts/review'));

  // Register
  gulp.src('./public/views/register/**/*.html')
    .pipe(templateCache("templates.js", {
      module: 'Register',
      root: '/views/register/',
      moduleSystem: 'Browserify'
    }))
    .pipe(gulp.dest('./assets/scripts/register'));

});

//
// Watch JavaScript
//

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
  gulp.watch(paths.styles.in, ['sass']);
  gulp.watch(paths.templates, ['templateCache']);
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

gulp.task('build', ['sass', 'templateCache', 'buildJS']);

gulp.task('default', ['watch']);
