var exec    = require('child_process').exec;
var Promise = require('bluebird');

/**
 * Promisified child process exec.
 *
 * @type {Function}
 */
module.exports = Promise.promisify(exec);
