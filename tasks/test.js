var gulp   = require('gulp');
var path   = require('path');
var jshint = require('gulp-jshint');
var spawn  = require('child_process').spawn;

/**
 * Path to the mocha executable.
 */
var MOCHA_PATH = path.join(__dirname, '../node_modules/mocha/bin/mocha');

/**
 * Check the code conforms to JSHint guidelines.
 */
gulp.task('test:lib:jshint', function () {
  return gulp.src(path.join(__dirname, '../lib/**/*.js'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/**
 * Test the module code.
 */
gulp.task('test:lib', ['test:lib:jshint'], function () {
  var testProcess = spawn(MOCHA_PATH, [
    path.join(__dirname, '../test/lib/**/*.js'),
    '-R',
    'spec'
  ]);

  testProcess.stdout.pipe(process.stdout);
  testProcess.stderr.pipe(process.stderr);

  return testProcess;
});

/**
 * Run all tests.
 */
gulp.task('test', [
  'test:lib',
  'test:javascript'
]);
