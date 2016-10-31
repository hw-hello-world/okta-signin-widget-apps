// gulpfile.js

var gulp = require('gulp');
var elm = require('gulp-elm');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');

// File paths
var paths = {
  dest: 'dist',
  elm: 'src/*.elm',
  static: 'src/*.{html,css,js}'
};

var okta = {
  dest: 'dist/okta',
  src: 'node_modules/@okta/okta-signin-widget/dist/**/*'
};

// Init Elm
gulp.task('elm-init', elm.init);

// Compile Elm to HTML
gulp.task('elm', ['elm-init'], function(){
  return gulp.src(paths.elm)
    .pipe(plumber())
    .pipe(elm({output: 'elm.js'}))
    .pipe(gulp.dest(paths.dest));
});

// Move static assets to dist
gulp.task('static', function() {
  return gulp.src(paths.static)
    .pipe(plumber())
    .pipe(gulp.dest(paths.dest));
});

// okta-signin-widget
gulp.task('okta', function() {
  return gulp.src(okta.src)
    .pipe(plumber())
    .pipe(gulp.dest(okta.dest));
});

// Watch for changes and compile
gulp.task('watch', function() {
  gulp.watch(paths.elm, ['elm']);
  gulp.watch(paths.static, ['static']);
});

// Local server
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 12234
  });
});

// Main gulp tasks
gulp.task('build', ['elm', 'static', 'okta']);
gulp.task('default', ['connect', 'build', 'watch']);
