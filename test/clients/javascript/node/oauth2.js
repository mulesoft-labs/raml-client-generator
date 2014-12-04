var expect     = require('chai').expect;
var ExampleApi = require('../.tmp/example');

describe('oauth2', function () {
  var oauth2 = new ExampleApi.OAuth2({
    clientId:     '123',
    clientSecret: 'abc',
    redirectUri:  'http://example.com/auth/callback'
  });

  describe('#getUri', function () {
    it('should return a valid uri', function () {
      expect(oauth2.code.getUri()).to.equal(
        'https://localhost:4444/auth/oauth2/authorize?client_id=123&' +
        'redirect_uri=http%3A%2F%2Fexample.com%2Fauth%2Fcallback&' +
        'scope=user&response_type=code'
      );
    });
  });
});
