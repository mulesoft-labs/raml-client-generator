var _ = require('lodash');

/**
 * Sanitize the parameter into a more reusable object.
 *
 * @param  {Object} parameter
 * @return {Object}
 */
var sanitizeParameter = function (parameter) {
  var obj = _.pick(parameter, [
    'displayName',
    'description',
    'type',
    'enum',
    'pattern',
    'minLength',
    'maxLength',
    'minimum',
    'maximum',
    'example',
    'repeat',
    'required',
    'default'
  ]);

  // Automatically set the default parameter from the enum value.
  if (obj.default == null && Array.isArray(obj.enum)) {
    obj.default = obj.enum[0];
  }

  return obj;
};

/**
 * Sanitize parameters into something more consumable.
 *
 * @param  {Object} parameters
 * @param  {Object} spec
 * @return {Object}
 */
module.exports = function (parameters) {
  var obj = {};

  // Iterate over every parameter and generate a new parameters object.
  _.each(parameters, function (parameter, key) {
    obj[key] = sanitizeParameter(parameter);
  });

  return obj;
};
