const
  gulp = require('gulp'),
  server = require('./dist/server.bundle.js');

gulp.task('start', (callback) => {
  server.run();
  callback();
});
