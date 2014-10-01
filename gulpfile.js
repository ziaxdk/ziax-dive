var gulp = require('gulp'),
    clean = require('gulp-clean'),
    livereload = require('gulp-livereload'),
    gulpexpress = require('./lib/gulp-express.js'),
    karma = require('gulp-karma'),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    shelljs = require('shelljs'),
    request = require('request'),
    _config = require('./_config.json');
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
gulp.task('clean', function() { return gulp.src('build/www', {read: false}).pipe(clean()); });
gulp.task('copy', function() {
  return gulp.src([
      'src/**/*',
      '!src/lib/**/*',
    ]).pipe(gulp.dest('build/www'));
});
gulp.task('dist', function() {
  return gulp.src([
      'src/lib/ionic/release/js/ionic.bundle.js',
      'src/lib/ionic/release/css/ionic.css',
      'src/lib/ionic/release/fonts/**',
      'src/lib/lodash/dist/lodash.js'

    ], { base: 'src/lib' }).pipe(gulp.dest('build/www/lib'));


});
gulp.task('gitcommit', function(cb) {
  shelljs.cd('build');
  shelljs.exec('git add -A .');
  shelljs.exec('git commit -m "gulp build"');
  shelljs.exec('git push origin master', cb);

});

gulp.task('pulllatest', function(cb) {
  request({
    url: 'https://build.phonegap.com/api/v1/apps/' + _config.buildpg.id + '?auth_token=' + _config.buildpg.auth_token,
    method: 'PUT',
    form: {
      data: '{"pull":"true"}'
    }
  }, function(err, res, body) {
    console.log(body);
    cb();
  });
});

// Build, and deploy and starts a new Phonegap build
gulp.task('deploy', function(cb) {
 runSequence(
  'clean', 'copy', 'dist', 'gitcommit', 'pulllatest',
  cb);

});