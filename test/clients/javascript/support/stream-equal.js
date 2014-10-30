var assert      = require('assert');
var Promise     = require('bluebird');
var streamEqual = Promise.promisify(require('stream-equal'));

module.exports = function (a, b) {
  return streamEqual(a, b)
    .then(function (isEqual) {
      assert(isEqual, 'Streams do not equal');
    });
};
