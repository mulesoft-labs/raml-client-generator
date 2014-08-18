var assert      = require('assert');
var Promise     = require('bluebird');
var streamEqual = Promise.promisify(require('stream-equal'));

module.exports = function (stream1, stream2) {
  return streamEqual(stream1, stream2)
    .then(function (isEqual) {
      assert(isEqual, 'Streams do not equal');
    });
};
