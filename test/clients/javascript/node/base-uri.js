var nock       = require('nock');
var expect     = require('chai').expect;
var ExampleApi = require('../.tmp/example');

describe('base uri', function () {
  function validateResponse (response) {
    expect(response.body).to.equal('Hello World!');
    expect(response.status).to.equal(200);
  }

  describe('set base uri', function () {
    var client = new ExampleApi({
      baseUri: 'http://google.com/search/'
    });

    beforeEach(function () {
      nock('http://google.com')
        .get('/search/hello')
        .reply(200, 'Hello World!');
    });

    it('should be able to manually set the base uri', function () {
      return client.resources.hello.get()
        .then(validateResponse);
    });
  });

  describe('base uri parameters', function () {
    var client = new ExampleApi({
      baseUri: 'http://{domain}.com',
      baseUriParameters: {
        domain: 'test'
      }
    });

    beforeEach(function () {
      nock('http://test.com')
        .get('/hello')
        .reply(200, 'Hello World!');
    });

    it('should be able to manually set the base uri', function () {
      return client.resources.hello.get()
        .then(validateResponse);
    });
  });
});
