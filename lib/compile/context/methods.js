var _                  = require('lodash');
var sanitizeParameters = require('./parameters');

/**
 * Generate a unique id for every request method.
 *
 * @type {Function}
 */
var uniqueId = _.uniqueId.bind(null, 'method');

/**
 * Sanitize a method into a flatter, more readable structure.
 *
 * @param  {Object} method
 * @return {Object}
 */
var sanitizeMethod = function (method, spec) {
  // Pick only the usable properties.
  var obj = _.pick(method, [
    'method',
    'protocols',
    'responses',
    'body',
    'headers',
    'description'
  ]);

  // Attach a unique id to every method.
  obj.id              = uniqueId();
  obj.queryParameters = sanitizeParameters(method.queryParameters, spec);

  // TODO: Add `securedBy` support.

  return obj;
};

/**
 * Sanitize a methods array into a more reusable object.
 *
 * @param  {Array}  methods
 * @param  {Object} spec
 * @return {Object}
 */
module.exports = function (methods, spec) {
  var obj = {};

  _.each(methods, function (method) {
    var key = spec.format.variable(method.method);

    obj[key] = sanitizeMethod(method, spec);
  });

  return obj;
};
