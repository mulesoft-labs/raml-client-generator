var _          = require('lodash');
var Promise    = require('bluebird');
var helpers    = require('./helpers');
var context    = require('./context');

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
      helpers:  _.extend({}, helpers, spec.helpers),
      partials: _.extend({}, spec.partials)
    },
    context: context(ast, spec)
  };

  // Compile all templates into files.
  _.each(spec.files, function (template, filename) {
    compile.files[filename] = template(compile.context, compile.options);
  });

  // Return compilation as an object.
  return Promise.resolve(compile);
};
