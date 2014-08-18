var nock    = require('nock');
var expect  = require('chai').expect;
var TestApi = require('../.tmp/test');

describe('base uri', function () {
  var expectResponse = function (response) {
    expect(response.body).to.equal('Hello world!');
    expect(response.status).to.equal(200);
  };

  describe('set base uri', function () {
    var client = new TestApi({
      baseUri: 'http://google.com/search/'
    });

    beforeEach(function () {
      nock('http://google.com')
        .get('/search/route')
        .reply(200, 'Hello world!');
    });

    it('should be able to manually set the base uri', function () {
      return client.resources.route.get().then(expectResponse);
    });
  });

  describe('base uri parameters', function () {
    var client = new TestApi({
      baseUri: 'http://{domain}.com',
      baseUriParameters: {
        domain: 'test'
      }
    });

    beforeEach(function () {
      nock('http://test.com')
        .get('/route')
        .reply(200, 'Hello world!');
    });

    it('should be able to manually set the base uri', function () {
      return client.resources.route.get().then(expectResponse);
    });
  });
});
