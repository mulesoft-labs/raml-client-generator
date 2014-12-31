#!/usr/bin/env node

var assert     = require('assert');
var Bluebird   = require('bluebird');
var resolve    = require('path').resolve;
var ramlParser = require('raml-parser');
var pkg        = require('../package');
var languages  = require('../languages');
var objectToFs = require('../lib/util/object-to-fs');
var cwd        = process.cwd();

/**
 * Resolve a path to current working directory.
 *
 * @param  {String} path
 * @return {String}
 */
var base = function (path) {
  return path ? resolve(cwd, path) : cwd;
};

/**
 * Parse the command line arguments.
 */
var argv = require('yargs')
    .usage([
      'Generate an API client in any language.',
      '$0 api.raml --output api-client --language javascript'
    ].join('\n\n'))
    .version(pkg.version, 'version')
    .alias('e', 'entry')
    .describe('e', 'Entry RAML file')
    .demand('o')
    .alias('o', 'output')
    .describe('o', 'API client output directory')
    .demand('l')
    .alias('l', 'language')
    .describe('l', 'Set the generated client language')
    .argv;

/**
 * Pull out options into an object for passing into generator.
 *
 * @type {Object}
 */
var options = {
  entry:    base(argv.entry || argv._[0]),
  output:   base(argv.output),
  language: argv.language.toLowerCase()
};

/**
 * Generate the API client.
 */
Bluebird.resolve(options)
  .tap(function (options) {
    assert(languages.hasOwnProperty(options.language), 'Unsupported language');
  })
  .then(function (options) {
    return ramlParser.loadFile(options.entry);
  })
  .then(function (ast) {
    return languages[options.language](ast, options);
  })
  .then(function (output) {
    return objectToFs(options.output, output.files);
  })
  .then(function () {
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err instanceof Error ? (err.stack || err.message) : err);

    return process.exit(1);
  });
