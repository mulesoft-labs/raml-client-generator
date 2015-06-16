#!/usr/bin/env node

var bin = require('raml-generator/bin')
var languages = require('../')
var pkg = require('../package')

var argv = require('yargs')
  .alias('l', 'language')
  .describe('l', 'Set the generated client language')
  .demand(['l'])
  .argv

if (!languages.hasOwnProperty(argv.language)) {
  console.log('Available languages: ' + Object.keys(languages))

  process.exit(1)
}

bin(languages[argv.language], pkg, process.argv)
