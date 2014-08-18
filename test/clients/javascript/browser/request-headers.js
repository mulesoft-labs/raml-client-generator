describe('request headers', function () {
  var client = new TestApi();
  var server;

  before(function () {
    server = sinon.fakeServer.create();

    server.autoRespond = true;

    server.respondWith(
      'GET',
      'http://example.com/route',
      function (xhr) {
        xhr.respond(200, null, xhr.requestHeaders['X-Custom']);
      }
    );

    server.respondWith(
      'GET',
      'http://example.com/headers/default',
      function (xhr) {
        xhr.respond(200, null, xhr.requestHeaders['X-Default-Header']);
      }
    );
  });

  after(function () {
    server.restore();
  });

  describe('custom headers', function () {
    it('should pass custom headers with the request', function () {
      return client.resources.route.get(null, {
        headers: { 'X-Custom': 'Custom Header Content' }
      })
        .then(function (response) {
          expect(response.body).to.equal('Custom Header Content');
          expect(response.status).to.equal(200);
        });
    });
  });

  describe('default headers', function () {
    it('should use default headers from raml', function () {
      return client.resources.headers.default.get()
        .then(function (response) {
          expect(response.body).to.equal('Default Value');
          expect(response.status).to.equal(200);
        });
    });

    it('should override default headers', function () {
      return client.resources.headers.default.get(null, {
        headers: { 'X-Default-Header': 'Custom Value' }
      })
        .then(function (response) {
          expect(response.body).to.equal('Custom Value');
          expect(response.status).to.equal(200);
        });
    });
  });
});
