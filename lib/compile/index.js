var extend  = require('extend');
var helpers = require('./helpers');
var context = require('./context');

/**
 * Compile an api client using a combination of the ast, spec and user data.
 *
 * @param  {Object} ast
 * @param  {Object} spec
 * @param  {Object} data
 * @return {Object}
 */
module.exports = function (ast, spec, data) {
  // Create the compile object. We resolve this object instead of just the
  // files so that external utilities have access to the context object. For
  // example, the "API Notebook" project needs to add runtime documentation.
  var compile = {
    files: {},
    options: {
      data:     data,
      helpers:  extend({}, helpers, spec.helpers),
      partials: extend({}, spec.partials)
    },
    context: context(ast, spec)
  };

  Object.keys(spec.files).forEach(function (key) {
    var template = spec.files[key];

    compile.files[key] = template(compile.context, compile.options);
  });

  return compile;
};
