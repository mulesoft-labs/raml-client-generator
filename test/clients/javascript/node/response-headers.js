var expect     = require('chai').expect;
var ExampleApi = require('../.tmp/example');

describe('response headers', function () {
  var client = new ExampleApi();

  it('should return in a lower-cased object', function () {
    return client.resources.get()
      .then(function (res) {
        expect(res.body).to.equal('Success');
        expect(res.status).to.equal(200);
        expect(res.headers['x-powered-by']).to.equal('Express');
        expect(res.headers['content-type']).to.equal(
          'text/html; charset=utf-8'
        );
      });
  });
});
