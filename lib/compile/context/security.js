var _ = require('lodash');

/**
 * Sanitize resources into nested object form.
 *
 * @param  {Object} securitySchemes
 * @return {Object}
 */
module.exports = function (securitySchemes) {
  var obj = {};

  if (!Array.isArray(securitySchemes)) {
    return obj;
  }

  securitySchemes.forEach(function (securitySchemes) {
    _.each(securitySchemes, function (scheme) {
      obj[scheme.type] = scheme;
    });
  });

  return obj;
};
