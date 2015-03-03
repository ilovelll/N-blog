var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');
var paths = {
  styles: 'public/stylesheets/*.css',
  scripts: ['public/javascripts/*.js', '!client/external/**/*.coffee'],
  images: 'public/images/*'
  };

gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['dist'], cb);
});

gulp.task('styles', ['clean'], function() {
  return gulp.src(paths.styles)
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(gulp.dest('dist/css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('dist/css'))
  .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', ['clean'], function() {
  return gulp.src(paths.scripts)
  // .pipe(jshint())
  // .pipe(jshint.reporter('default'))
  .pipe(concat('main.js'))
  .pipe(gulp.dest('dist/js'))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'))
  .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
  .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
  .pipe(gulp.dest('dist/imgs'))
  .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('watch', function() {
  gulp.watch(paths.styles, ['styles'])
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  livereload.listen();
  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);
});

gulp.task('default', ['watch', 'styles', 'scripts', 'images']);
