var gulp = require('gulp');
var KarmaServer = require('karma').Server;
var browserify = require('gulp-browserify');

var paths = {
  staticFiles: ['app/**/*png', 'app/**/*.json', 'app/**/*.html'],
  jsFiles: ['app/**/*.js']
}

gulp.task('test', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('copy', function() {
  gulp.src(paths.staticFiles).pipe(gulp.dest('build'));
});

gulp.task('browserify', function() {
  gulp.src('app/background/background.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : true
    }))
    .pipe(gulp.dest('./build/'))
});

gulp.task('watch', function() {
  gulp.watch(paths.staticFiles, ['copy']);
  gulp.watch(paths.jsFiles, ['browserify']);
});

gulp.task('default', ['test', 'copy', 'browserify']);
