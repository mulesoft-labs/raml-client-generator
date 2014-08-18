var _          = require('lodash');
var Promise    = require('bluebird');
var helpers    = require('./helpers');
var context    = require('./context');

/**
 * Compile an api client using a combination of the ast, spec and user options.
 *
 * @param  {Object} ast
 * @param  {Object} spec
 * @param  {Object} options
 * @return {Object}
 */
module.exports = function (ast, spec, options) {
  // Create the output object.
  var content = {
    files:   {},
    options: options,
    context: context(ast, spec)
  };

  // Handlebars compile options.
  var compileOptions = {
    data:     options,
    helpers:  _.extend({}, helpers, spec.helpers),
    partials: _.extend({}, spec.partials)
  };

  // Compile all templates into files.
  _.each(spec.files, function (template, filename) {
    content.files[filename] = template(content.context, compileOptions);
  });

  // Compilation will always return a promise object. This allows asynchronous
  // data transformations to be specified.
  return Promise.resolve(content).then(function (content) {
    return (spec.transform || Promise.resolve)(content, options);
  });
};
