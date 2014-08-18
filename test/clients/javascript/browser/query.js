describe('query', function () {
  var client = new TestApi();
  var server;

  describe('simple queries', function () {
    before(function () {
      server = sinon.fakeServer.create();

      server.autoRespond = true;

      server.respondWith(
        'http://example.com/route?key=string',
        function (xhr) { xhr.respond(200, null, xhr.url); }
      );
    });

    after(function () {
      server.restore();
    });

    var expectResponse = function (res) {
      expect(res.body).to.equal('http://example.com/route?key=string');
      expect(res.status).to.equal(200);
    };

    describe('body argument (#get)', function () {
      it('should pass query string as an object', function () {
        return client.resources.route.get({ key: 'string' })
          .then(expectResponse);
      });

      it('should pass query string as a string', function () {
        return client.resources.route.get('key=string')
          .then(expectResponse);
      });
    });

    describe('option argument (#post)', function () {
      it('should pass query string as an object', function () {
        return client.resources.route.post(null, { query: { key: 'string' } })
          .then(expectResponse);
      });

      it('should pass query string as a string', function () {
        return client.resources.route.post(null, { query: 'key=string' })
          .then(expectResponse);
      });
    });
  });

  describe('types', function () {
    describe('array', function () {
      before(function () {
        server = sinon.fakeServer.create();

        server.autoRespond = true;

        server.respondWith(
          'http://example.com/route?key=1&key=2&key=3',
          function (xhr) { xhr.respond(200, null, xhr.url); }
        );
      });

      after(function () {
        server.restore();
      });

      it('should stringify with multiple keys', function () {
        return client.resources.route.get({
          key: [1, 2, 3]
        }).then(function (response) {
          expect(response.status).to.equal(200);
          expect(response.body).to.equal(
            'http://example.com/route?key=1&key=2&key=3'
          );
        });
      });
    });
  });
});
