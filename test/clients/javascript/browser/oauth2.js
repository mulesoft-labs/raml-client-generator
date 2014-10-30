describe('oauth2', function () {
  var oauth2 = new ExampleApi.OAuth2({
    clientId:     '123',
    clientSecret: 'abc',
    redirectUri:  'http://example.com/auth/callback'
  });

  describe('#getUri', function () {
    it('should return a valid uri', function () {
      expect(oauth2.code.getUri()).to.equal(
        'https://localhost:4444/auth/oauth2/authorize?scope=user&' +
        'client_id=123&' +
        'redirect_uri=http%3A%2F%2Fexample.com%2Fauth%2Fcallback&' +
        'response_type=code'
      );
    });
  });
});
