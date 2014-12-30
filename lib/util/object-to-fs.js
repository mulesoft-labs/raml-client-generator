var path      = require('path');
var Bluebird  = require('bluebird');
var mkdirp    = Bluebird.promisify(require('mkdirp'));
var writeFile = Bluebird.promisify(require('fs').writeFile);

/**
 * Save on object structure to the file system.
 *
 * @param  {String}  dir
 * @param  {Object}  object
 * @return {Promise}
 */
module.exports = function objectToFs (dir, object) {
  var promise = mkdirp(dir);

  Object.keys(object).forEach(function (key) {
    var content  = object[key];
    var filename = path.join(dir, key);

    promise = promise.then(function () {
      if (typeof content === 'object') {
        return objectToFs(filename, content);
      }

      return writeFile(filename, content);
    });
  });

  return promise.then(function () {
    return object;
  });
};
