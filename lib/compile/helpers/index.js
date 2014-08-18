var _ = require('lodash');

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
exports.indent = require('indent-string');

/**
 * Helpful utility functions.
 */
exports.map    = _.map;
exports.keys   = _.keys;
exports.unique = _.uniq;
exports.pluck  = _.pluck;
exports.object = _.object;

