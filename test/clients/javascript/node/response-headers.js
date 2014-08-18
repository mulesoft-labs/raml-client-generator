var nock    = require('nock');
var expect  = require('chai').expect;
var TestApi = require('../.tmp/test');

describe('request headers', function () {
  var client = new TestApi();

  beforeEach(function () {
    nock('http://example.com')
      .get('/route')
      .reply(200, 'Response body', {
       'Content-Type':    'text/javascript',
       'X-Custom-Header': 'Custom Header Response'
     });
  });

  it('should return in a lower-cased object', function () {
    return client.resources.route.get()
      .then(function (response) {
        expect(response.body).to.equal('Response body');
        expect(response.status).to.equal(200);
        expect(response.headers).to.deep.equal({
          'content-type':    'text/javascript',
          'x-custom-header': 'Custom Header Response'
        });
      });
  });
});
