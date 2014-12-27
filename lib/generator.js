var compile = require('./compile');

// Handlebars must be required in node to support `require('x.hbs')`.
require('handlebars');

/**
 * Generate a language specific client generator based on passed in spec.
 *
 * @param  {Object}   spec
 * @return {Function}
 */
module.exports = function (spec) {
  /**
   * Generate an API client by passed in an AST.
   *
   * @param  {Object} ast
   * @param  {Object} options
   * @return {Object}
   */
  return function (ast, options) {
    return compile(ast, spec, options);
  };
};
