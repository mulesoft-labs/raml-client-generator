var compile = require('./compile');

// Handlebars must be require in node to support `require('x.hbs')`.
if (typeof require === 'function' && typeof exports === 'object') {
  require('handlebars');
}

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
