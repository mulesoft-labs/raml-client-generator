describe('query string', function () {
  var client = new ExampleApi();

  describe('append query string', function () {
    function validateResponse (response) {
      expect(response.status).to.equal(200);
      expect(response.body).to.equal('/bounce/url?key=string');
    }

    describe('body argument (#get)', function () {
      it('should pass query string as an object', function () {
        return client.resources.bounce.url.get({ key: 'string' })
          .then(validateResponse);
      });

      it('should pass query string as a string', function () {
        return client.resources.bounce.url.get('key=string')
          .then(validateResponse);
      });
    });

    describe('option argument (#post)', function () {
      it('should pass query string as an object', function () {
        var opts = { query: { key: 'string' } };

        return client.resources.bounce.url.post(null, opts)
          .then(validateResponse);
      });

      it('should pass query string as a string', function () {
        var opts = { query: 'key=string' };

        return client.resources.bounce.url.post(null, opts)
          .then(validateResponse);
      });
    });
  });

  describe('types', function () {
    describe('array', function () {
      it('should stringify with multiple keys', function () {
        return client.resources.bounce.url.get({
          key: [1, 2, 3]
        }).then(function (response) {
          expect(response.status).to.equal(200);
          expect(response.body).to.equal('/bounce/url?key=1&key=2&key=3');
        });
      });
    });
  });
});
