var minimist = require('minimist');
var gulp = require('gulp');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var KarmaServer = require('karma').Server;
var watchify = require('watchify');
var browserify = require('browserify');
var mustache = require('browserify-mustache');
var source = require('vinyl-source-stream');
var gutil = require('gutil');
var del = require('del');

var argv = minimist(process.argv.slice(2))

var paths = {
  staticFiles: [
    'app/**/*png', 
    'app/**/*.json',
    'app/**/*.html',
    'app/**/*.css',
    'app/content/content.js'
  ],
  staticDependencies: [
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
  ],
  infoFiles: ['LICENSE', 'CHANGELOG'],
  browserify: ['app/**/*.js', 'app/**/*.mustache'],
  versions: ['package.json', 'app/manifest.json']
}

gulp.task('test', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('copyStatic', function() {
  return gulp.src(paths.staticFiles, {base: 'app'}).pipe(gulp.dest('build'));
});

gulp.task('copyInfo', function() {
  return gulp.src(paths.infoFiles).pipe(gulp.dest('build'));
});

gulp.task('copyDependencies', function () {
  return gulp.src(paths.staticDependencies, {base: './node_modules'}).pipe(gulp.dest('build/vendor'));
});

gulp.task('clean', function () {
  return del(['build']);
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

function createBundler(options) {
  var b = browserify(options.entry, {
    insertGlobals : true,
    debug : true,
    paths: options.paths,    
  });
  
  if (options.watch) {
    b = watchify(b);
    b.on('update', bundle);
    b.on('log', gutil.log); 
  }
  
  function bundle() {
    b.bundle()
      //.on('error', gutil.log)
      .on('error', function(e) {
        gutil.log(e.message, e.filename);
      })
      .pipe(source(options.destFile))
      .pipe(gulp.dest(options.destFolder));
  }
  return {bundle}
}

function createBackgroundBundler(watch) {
  return createBundler({
    entry: './app/background/background.js',
    paths: ['./app/'],
    destFile: 'background.js',
    destFolder: './build/background',
    watch
  })
}

function createMainBundler(watch) {
  return createBundler({
    entry: './app/main/app.js',
    paths: ['./app/'],
    destFile: 'app.js',
    destFolder: './build/main',
    watch
  })
}

gulp.task('browserify-background', function() {
  return createBackgroundBundler(false).bundle();
});

gulp.task('browserify-main', function() {
  return createMainBundler(false).bundle();
});

gulp.task('browserify', ['browserify-background']);

gulp.task('watch', ['copy'], function() {
  gulp.watch(paths.staticFiles, ['copyStatic']);
  gulp.watch(paths.infoFiles, ['copyInfo']);
  createBackgroundBundler(true).bundle();
  createMainBundler(true).bundle();
});

gulp.task('default', ['test', 'build']);
gulp.task('build', ['copy', 'browserify']);
gulp.task('copy', ['copyStatic', 'copyInfo', 'copyDependencies']);
