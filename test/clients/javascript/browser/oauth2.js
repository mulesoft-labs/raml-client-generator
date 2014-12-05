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

  describe('user support', function () {
    var client = new ExampleApi({
      user: oauth2.createToken('abc')
    });

    it('should sign requests', function () {
      return client.resources.bounce.headers.get()
        .then(function (response) {
          expect(response.status).to.equal(200);
          expect(response.body.authorization).to.equal('Bearer abc');
        });
    });
  });
});
