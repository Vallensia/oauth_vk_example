const
  lr = require('tiny-lr'),
  gulp = require('gulp'),
  livereload = require('gulp-livereload'),
  csso = require('gulp-csso'),
  uglify = require('gulp-uglify'), // Минификация JS
  concat = require('gulp-concat'), // Склейка файлов
  connect = require('connect'),
  server = lr();

gulp.task('js', () => {
  gulp.src(['./**/*.js', '!./back/**/*.js'])
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./public/js'))
        .pipe(livereload(server));
});

gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(connect.static('./public'))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});

