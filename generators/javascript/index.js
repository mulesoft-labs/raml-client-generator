var generator = require('../../lib/generator');

/**
 * Export a client generator instance.
 *
 * @type {Function}
 */
module.exports = generator({
  files: {
    'index.js':     require('./templates/index.js.hbs'),
    'README.md':    require('./templates/README.md.hbs'),
    'package.json': require('./templates/package.json.hbs')
  },
  format: {
    variable: require('camel-case')
  },
  partials: {
    utils:     require('./partials/utils.js.hbs'),
    client:    require('./partials/client.js.hbs'),
    exports:   require('./partials/exports.js.hbs'),
    request:   require('./partials/request.js.hbs'),
    resources: require('./partials/resources.js.hbs')
  },
  helpers: {
    stringify: require('javascript-stringify')
  }
});
