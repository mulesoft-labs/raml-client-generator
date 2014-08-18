describe('response body', function () {
  var client = new TestApi();

  describe('response content types', function () {
    var server;

    describe('text', function () {
      before(function () {
        server = sinon.fakeServer.create();

        server.autoRespond = true;

        server.respondWith(
          'GET',
          'http://example.com/route',
          'test'
        );
      });

      after(function () {
        server.restore();
      });

      it('should respond as text when unknown', function () {
        return client.resources.route.get().then(function (response) {
          expect(response.status).to.equal(200);
          expect(response.body).to.deep.equal('test');
        });
      });
    });

    describe('json', function () {
      before(function () {
        server = sinon.fakeServer.create();

        server.autoRespond = true;

        server.respondWith(
          'GET',
          'http://example.com/route',
          [
            200,
            {
              'Content-Type': 'application/json'
            },
            '{"key":"value","this":"that"}'
          ]
        );
      });

      after(function () {
        server.restore();
      });

      it('should parse as JSON when specified', function () {
        return client.resources.route.get().then(function (response) {
          expect(response.status).to.equal(200);
          expect(response.body).to.deep.equal({ key: 'value', this: 'that' });
        });
      });
    });

    describe('url encoded', function () {
      before(function () {
        server = sinon.fakeServer.create();

        server.autoRespond = true;

        server.respondWith(
          'GET',
          'http://example.com/route',
          [
            200,
            {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            'key=value&this=that'
          ]
        );

        server.respondWith(
          'POST',
          'http://example.com/route',
          [
            200,
            {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            'key=1&key=2&key=3'
          ]
        );

        server.respondWith(
          'PUT',
          'http://example.com/route',
          [
            200,
            {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            'key=Hello%2C%20world'
          ]
        );
      });

      after(function () {
        server.restore();
      });

      describe('simple query string', function () {
        it('should parse when specified', function () {
          return client.resources.route.get().then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({ key: 'value', this: 'that' });
          });
        });
      });

      describe('duplicate keys', function () {
        it('should put duplicate key values into an array', function () {
          return client.resources.route.post().then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({ key: ['1', '2', '3'] });
          });
        });
      });

      describe('encoded values', function () {
        it('should be uri decoded', function () {
          return client.resources.route.put().then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({ key: 'Hello, world' });
          });
        });
      });
    });
  });
});
