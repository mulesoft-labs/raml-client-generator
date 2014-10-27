describe('oauth2', function () {
  var oauth2 = new TestApi.OAuth2({
    clientId:     '123',
    clientSecret: 'abc',
    redirectUri:  'http://example.com/auth/callback'
  });

  describe('#getUri', function () {
    it('should return a valid uri', function () {
      expect(oauth2.code.getUri()).to.equal(
        'https://github.com/login/oauth/authorize?scope=user%20' +
        'user%3Aemail%20user%3Afollow%20public_repo%20repo%20repo%3Astatus%20' +
        'delete_repo%20notifications%20gist&client_id=123&' +
        'redirect_uri=http%3A%2F%2Fexample.com%2Fauth%2Fcallback&' +
        'response_type=code'
      );
    });
  });
});
