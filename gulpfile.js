var minimist = require('minimist');
var gulp = require('gulp');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var KarmaServer = require('karma').Server;
var browserify = require('browserify');
var mustache = require('browserify-mustache');
var source = require('vinyl-source-stream');

var argv = minimist(process.argv.slice(2))

var paths = {
  staticFiles: [
    'app/**/*png', 
    'app/**/*.json',
    'app/**/*.html',
    'app/**/*.css',
    'app/content/content.js',
    'app/main/**/*.js'
  ],
  staticBowerComponents: [
    'bower_components/angular/angular.min.js',
    'bower_components/angular/angular.min.js.map',
    'bower_components/bootstrap/dist/**/*.*'
  ],
  infoFiles: ['LICENSE', 'CHANGELOG'],
  browserify: ['app/**/*.js', 'app/**/*.mustache'],
  versions: ['package.json', 'bower.json', 'app/manifest.json']
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

gulp.task('copyBowerComponents', function () {
  return gulp.src(paths.staticBowerComponents, {base: './'}).pipe(gulp.dest('build'));
});

gulp.task('version', function() {
  var version = argv.version;
  if (!version) throw "No version specified, use --version=1.2.3";
  if (!version.match(/^\d+\.\d+\.\d+$/)) throw "Incorrect version format: " + version;
  gulp.src(paths.versions, {base : './'})
    .pipe(replace(/"version": "\d+\.\d+\.\d+"/, '"version": "' + version + '"'))
    .pipe(gulp.dest('./')),
    
  gulp.src(['CHANGELOG'])
      .pipe(insert.prepend(version + '\n\n'))
      .pipe(gulp.dest('.'));
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

gulp.task('browserify', ['browserify-background']);

gulp.task('watch', ['build'], function() {
  gulp.watch(paths.staticFiles, ['copy']);
  gulp.watch(paths.infoFiles, ['copyInfo']);
  gulp.watch(paths.browserify, ['browserify']);
});

gulp.task('default', ['test', 'build']);
gulp.task('build', ['copy', 'copyInfo', 'copyBowerComponents', 'browserify']);
