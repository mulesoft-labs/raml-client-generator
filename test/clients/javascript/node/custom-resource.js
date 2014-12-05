var expect     = require('chai').expect;
var methods    = require('methods');
var camelCase  = require('camel-case');
var ExampleApi = require('../.tmp/example');

describe('custom resource', function () {
  var client = new ExampleApi();

  function validateResponse (response) {
    expect(response.body).to.equal('Success');
    expect(response.status).to.equal(200);
  }

  methods.forEach(function (verb) {
    var method = camelCase(verb);

    if (verb === 'connect' || verb === 'head') {
      return;
    }

    describe('#' + method, function () {
      it('should be supported', function () {
        return client.resource('/status/{id}', { id: 200 })[method]()
          .then(validateResponse);
      });
    });
  });
});
