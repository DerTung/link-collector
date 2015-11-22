var gulp = require('gulp');
var KarmaServer = require('karma').Server;
var browserify = require('browserify');
var mustache = require('browserify-mustache');
var source = require('vinyl-source-stream');

var paths = {
  staticFiles: ['app/**/*png', 'app/**/*.json', 'app/**/*.html', 'app/**/*.css', 'app/content/content.js'],
  infoFiles: ['LICENSE', 'CHANGELOG'],
  browserify: ['app/**/*.js', 'app/**/*.mustache']
}

gulp.task('test', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('copy', function() {
  return gulp.src(paths.staticFiles, {base: 'app'}).pipe(gulp.dest('build'));
});

gulp.task('copyInfo', function() {
  return gulp.src(paths.infoFiles).pipe(gulp.dest('build'));
});

gulp.task('browserify-background', function() {
  return browserify('./app/background/background.js', {
    insertGlobals : true,
    debug : true,
    paths: ['./app/', './bower_components/'],    
  }).bundle()
    .pipe(source('background.js'))
    .pipe(gulp.dest('./build/background'));
});

gulp.task('browserify-popup', function() {
  return browserify('./app/popup/popup.js', {
    insertGlobals : true,
    debug : true,
    paths: ['./app/', './bower_components/'],    
  }).transform(mustache)
    .bundle()
    .pipe(source('popup.js'))
    .pipe(gulp.dest('./build/popup/'));
})

gulp.task('browserify', ['browserify-background', 'browserify-popup']);

gulp.task('watch', ['default'], function() {
  gulp.watch(paths.staticFiles, ['copy']);
  gulp.watch(paths.infoFiles, ['copyInfo']);
  gulp.watch(paths.browserify, ['browserify']);
});

gulp.task('default', ['test', 'copy', 'copyInfo', 'browserify']);
