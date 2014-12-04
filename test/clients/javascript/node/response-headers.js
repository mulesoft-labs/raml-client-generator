var nock       = require('nock');
var expect     = require('chai').expect;
var ExampleApi = require('../.tmp/example');

describe('response headers', function () {
  var client = new ExampleApi();

  it('should return in a lower-cased object', function () {
    return client.resources.get()
      .then(function (res) {
        expect(res.body).to.equal('Success');
        expect(res.status).to.equal(200);
        expect(res.headers).to.deep.equal({
          'access-control-allow-headers': 'Content-Type',
          'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE',
          'access-control-allow-origin':  '*',
          'content-type':                 'text/html; charset=utf-8',
          'connection':                   'close',
          'date':                         new Date().toUTCString(),
          'etag':                         'W/"7-a0bde62e"',
          'content-length':               '7',
          'x-powered-by':                 'Express'
        });
      });
  });
});
