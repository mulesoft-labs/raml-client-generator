var nock    = require('nock');
var expect  = require('chai').expect;
var TestApi = require('../.tmp/test');

describe('request headers', function () {
  var client = new TestApi();

  var expectResponse = function (response) {
    expect(response.body).to.equal('It works!');
    expect(response.status).to.equal(200);
  };

  describe('custom headers', function () {
    beforeEach(function () {
      nock('http://example.com')
        .get('/route')
        .matchHeader('X-Custom', 'Custom Header Content')
        .reply(200, 'It works!');
    });

    it('should pass custom headers with the request', function () {
      return client.resources.route.get(null, {
        headers: { 'X-Custom': 'Custom Header Content' }
      }).then(expectResponse);
    });
  });

  describe('default headers', function () {
    describe('use defaults', function () {
      beforeEach(function () {
        nock('http://example.com')
          .get('/headers/default')
          .matchHeader('X-Default-Header', 'Default Value')
          .reply(200, 'It works!');
      });

      it('should use default headers from definition', function () {
        return client.resources.headers.default.get()
          .then(expectResponse);
      });
    });

    describe('override defaults', function () {
      beforeEach(function () {
        nock('http://example.com')
          .get('/headers/default')
          .matchHeader('x-default-header', 'custom value')
          .reply(200, 'It works!');
      });

      it('should override default headers', function () {
        return client.resources.headers.default.get(null, {
          headers: { 'x-default-header': 'custom value' }
        }).then(expectResponse);
      });
    });
  });
});
