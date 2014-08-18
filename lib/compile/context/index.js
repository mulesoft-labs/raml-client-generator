var _                  = require('lodash');
var sanitizeUri        = require('./uri');
var sanitizeResources  = require('./resources');
var sanitizeParameters = require('./parameters');

/**
 * Default formatting options.
 *
 * @type {Object}
 */
var DEFAULT_FORMAT = {
  /**
   * Replace with your preferred uri templating language.
   *
   * @param  {String} uri
   * @return {String}
   */
  uri: function (uri) {
    return uri;
  },
  /**
   * Variable formatting support. By default, we'll just throw an error.
   */
  variable: function () {
    throw new Error('No variable format specified');
  }
};

/**
 * Validate (and sanitize) the passed in spec object.
 *
 * @param  {Obejct} spec
 * @return {Obejct}
 */
var validateSpec = function (spec) {
  spec.format = _.extend({}, DEFAULT_FORMAT, spec.format);

  // Extend a new object from the spec.
  return _.extend({}, spec);
};

/**
 * Flatten the resources object tree into an array.
 *
 * @param  {Object} resources
 * @return {Array}
 */
var flattenResources = function (resources) {
  var array = [];

  // Recursively push all resources into a single flattened array.
  (function recurse (resource) {
    array.push(resource);

    _.each(resource.children, function (child) {
      return recurse(child);
    });
  })(resources);

  return array;
};

/**
 * Flatten the resources object into an array of methods.
 *
 * @param  {Object} resources
 * @return {Array}
 */
var flattenMethods = function (resources) {
  var array = [];

  // Recursively push all methods into a single flattened array.
  (function recurse (resource) {
    _.each(resource.methods, function (method) {
      array.push(method);
    });

    _.each(resource.children, function (child) {
      return recurse(child);
    });
  })(resources);

  return array;
};

/**
 * Create a context object for the templates to use during compilation.
 *
 * @param  {Object} ast
 * @param  {Object} spec
 * @return {Object}
 */
module.exports = function (ast, spec) {
  // Validate the spec before using.
  spec = validateSpec(spec);

  // Create an empty context object.
  var context = {
    id:                _.uniqueId('client'),
    title:             ast.title,
    version:           ast.version,
    baseUri:           sanitizeUri(ast.baseUri, spec),
    resources:         sanitizeResources(ast.resources, spec),
    baseUriParameters: sanitizeParameters(ast.baseUriParameters, spec)
  };

  // Flatten the resources object tree into a single array.
  context.allResources = flattenResources(context.resources);

  // Extract and flatten all methods from the resources.
  context.allMethods = flattenMethods(context.resources);

  return context;
};
