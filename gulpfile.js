const gulp = require('gulp');
const server = require('./dist/server.bundle.js');

gulp.task('start', (callback) => {
  server.run();
  callback();
});
