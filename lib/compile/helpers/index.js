var _      = require('lodash');
var indent = require('indent-string');

/**
 * Case sanitization support.
 */
exports.camelCase    = require('camel-case');
exports.pascalCase   = require('pascal-case');
exports.constantCase = require('constant-case');
exports.paramCase    = require('param-case');
exports.lowerCase    = require('lower-case');
exports.upperCase    = require('upper-case');
exports.snakeCase    = require('snake-case');

/**
 * Formatting utilities.
 */
exports.indent = function (/* input, count, character, opts */) {
  var args      = Array.prototype.slice.call(arguments);
  var opts      = args.pop();
  var input     = (opts.fn ? opts.fn(this) : args[0]);
  var count     = (opts.fn ? args[0] : args[1]) || 2;
  var character = (opts.fn ? args[1] : args[2]) || ' ';

  return indent(input, character, count);
};

/**
 * Helpful utility functions.
 */
exports.map    = _.map;
exports.keys   = _.keys;
exports.unique = _.uniq;
exports.pluck  = _.pluck;
exports.object = _.object;

