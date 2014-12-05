var assert      = require('assert');
var Bluebird    = require('bluebird');
var streamEqual = Bluebird.promisify(require('stream-equal'));

module.exports = function (a, b) {
  return streamEqual(a, b)
    .then(function (isEqual) {
      assert(isEqual, 'Streams do not equal');
    });
};
