/**
 * Map dependencies to their language.
 *
 * @type {Object}
 */
var DEPS_MAP = {
  node: {
    ClientOAuth2: "require('client-oauth2')"
  },
  amd: {
    ClientOAuth2: "'ClientOAuth2'"
  },
  browser: {
    ClientOAuth2: 'root.ClientOAuth2'
  }
};

/**
 * Create a dependency string.
 *
 * @param  {Object} context
 * @param  {String} [env]
 * @return {String}
 */
module.exports = function (context /*, env */) {
  var deps = [];
  var env  = arguments.length > 2 ? arguments[1] : false;

  // Depends on ClientOAuth2 to work properly.
  if (context.security['OAuth 2.0']) {
    deps.push(env ? DEPS_MAP[env].ClientOAuth2 : 'ClientOAuth2');
  }

  // Return an array of strings for AMD.
  if (env === 'amd') {
    return '[' + deps.join(', ') + ']';
  }

  // Join dependencies together
  return deps.join(', ');
};
