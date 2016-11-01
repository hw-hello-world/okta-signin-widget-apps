// gulpfile.js

var gulp = require('gulp');
var elm = require('gulp-elm');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');

// File paths
var src1 = {
  dest: 'dist',
  elm: 'src-1/*.elm',
  static: 'src-1/*.{html,css,js}'
};
var src2 = {
  dest: 'dist',
  elm: 'src-2/*.elm',
  static: 'src-2/*.{html,css,js}'
};
var src3 = {
  dest: 'dist',
  elm: 'src-3/*.elm',
  static: 'src-3/*.{html,css,js}'
};

var okta = {
  dest: 'dist/okta',
  src: 'node_modules/@okta/okta-signin-widget/dist/**/*'
};

// Init Elm
gulp.task('elm-init', elm.init);

// Compile Elm to HTML
gulp.task('elm1', ['elm-init'], function(){
  return gulp.src(src1.elm)
    .pipe(plumber())
    .pipe(elm({output: 'elm.js'}))
    .pipe(gulp.dest(src1.dest));
});
gulp.task('elm2', ['elm-init'], function(){
  return gulp.src(src2.elm)
    .pipe(plumber())
    .pipe(elm({output: 'elm.js'}))
    .pipe(gulp.dest(src2.dest));
});
gulp.task('elm3', ['elm-init'], function(){
  return gulp.src(src3.elm)
    .pipe(plumber())
    .pipe(elm({output: 'elm.js'}))
    .pipe(gulp.dest(src3.dest));
});

// Move static assets to dist
gulp.task('static1', function() {
  return gulp.src(src1.static)
    .pipe(plumber())
    .pipe(gulp.dest(src1.dest));
});
gulp.task('static2', function() {
  return gulp.src(src2.static)
    .pipe(plumber())
    .pipe(gulp.dest(src2.dest));
});
gulp.task('static3', function() {
  return gulp.src(src3.static)
    .pipe(plumber())
    .pipe(gulp.dest(src3.dest));
});

// okta-signin-widget
gulp.task('okta', function() {
  return gulp.src(okta.src)
    .pipe(plumber())
    .pipe(gulp.dest(okta.dest));
});

// Watch for changes and compile
gulp.task('watch1', function() {
  gulp.watch(src1.elm, ['elm']);
  gulp.watch(src1.static, ['static']);
});
gulp.task('watch2', function() {
  gulp.watch(src2.elm, ['elm']);
  gulp.watch(src2.static, ['static']);
});
gulp.task('watch3', function() {
  gulp.watch(src3.elm, ['elm']);
  gulp.watch(src3.static, ['static']);
});

// Local server
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 12234
  });
});

// Main gulp tasks
gulp.task('build1', ['elm1', 'static1', 'okta']);
gulp.task('build2', ['elm2', 'static2', 'okta']);
gulp.task('build3', ['elm3', 'static3', 'okta']);

gulp.task('w1', ['connect', 'build1', 'watch1']);
gulp.task('w2', ['connect', 'build2', 'watch2']);
gulp.task('w3', ['connect', 'build3', 'watch3']);
