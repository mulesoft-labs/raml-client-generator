var nock      = require('nock');
var expect    = require('chai').expect;
var methods   = require('methods');
var camelCase = require('camel-case');
var TestApi   = require('../.tmp/test');

describe('custom resource', function () {
  var client = new TestApi();

  var expectResponse = function (response) {
    expect(response.body).to.equal('Success');
    expect(response.status).to.equal(200);
  };

  methods.forEach(function (method) {
    describe(method, function () {
      beforeEach(function () {
        nock('http://example.com')
          .intercept('/route/123', method)
          .reply(200, 'Success');
      });

      it('should be supported', function () {
        return client.resource('/route/{id}', { id: 123 })[camelCase(method)]()
          .then(expectResponse);
      });
    });
  });
});
