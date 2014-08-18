var _         = require('lodash');
var path      = require('path');
var Promise   = require('bluebird');
var mkdirp    = Promise.promisify(require('mkdirp'));
var writeFile = Promise.promisify(require('fs').writeFile);

/**
 * Save on object structure to the file system.
 *
 * @param  {String}  dir
 * @param  {Object}  object
 * @return {Promise}
 */
module.exports = function objectToFs (dir, object) {
  // Write every file in the object to the filesystem.
  var files = _.map(object, function (content, key) {
    var filename = path.join(dir, key);

    // If the content is an object, recursively generate files.
    if (_.isObject(content)) {
      return objectToFs(filename, content);
    }

    // Ensure the directory structure exists and create the file.
    return mkdirp(path.dirname(filename))
      .then(function () {
        return writeFile(filename, content);
      });
  });

  // Return a promise waiting for all files to write.
  return Promise.all(files).return(object);
};
