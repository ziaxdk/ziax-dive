var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    gulpexpress = require('./lib/gulp-express.js'),
    karma = require('gulp-karma'),
    browserSync = require('browser-sync');
    // nodemon = require('nodemon');



gulp.task('express', function() {
  gulpexpress.serve({
    script: 'server.js',
    port: 3000
  });
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch([ 'src/**/*' ]).on('change', livereload.changed);

  gulp.watch('server.js', ['express']);
});

gulp.task('test', function() {
  return gulp.src([ '__dummy__'])
    .pipe(karma({
      configFile: './test/karma.conf.js',
      action: 'watch'
    }));
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "localhost:3000"
    });
});
// gulp.task('nodemon', function (cb) {
//     var called = false;
//     return nodemon({script: 'server.js'}).on('start', function () {
//         if (!called) {
//             called = true;
//             cb();
//         }
//     });
// });



gulp.task('default', ['express', 'watch']);
gulp.task('dev', ['express', 'test', 'watch']);
