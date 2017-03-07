var gulp = require('gulp');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var jsonminify = require('gulp-jsonminify');
var jade = require('gulp-jade');

gulp.task('compile', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.css', minifyCSS()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'))
});

gulp.task('minify-json', function () {
    return gulp.src(['app/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('dist'));
});

gulp.task('browser-sync', function(){
    browserSync({
    server:{
      baseDir:'app'
    }
    })
});

gulp.task('compile-jade', function() {
    var YOUR_LOCALS = {};

    return gulp.src('app/jade/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('app'))
});

gulp.task('watch', ['browser-sync', 'compile-jade', 'compile', 'minify-json'], function(){
    gulp.watch('app/**/*.*', ['compile-jade', 'compile', 'minify-json', browserSync.reload]);
});