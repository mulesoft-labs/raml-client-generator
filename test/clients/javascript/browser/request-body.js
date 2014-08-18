describe('request body', function () {
  var client = new TestApi();

  var REQUEST_BODY = {
    username: 'blakeembrey',
    password: 'hunter2'
  };

  describe('basic request bodies', function () {
    var server;

    before(function () {
      server = sinon.fakeServer.create();

      server.autoRespond = true;

      server.respondWith(
        'POST',
        'http://example.com/route',
        function (xhr) {
          xhr.respond(200, null, xhr.requestBody);
        }
      );
    });

    after(function () {
      server.restore();
    });

    describe('json', function () {
      var expectResponse = function (response) {
        expect(response.status).to.equal(200);
        expect(JSON.parse(response.body)).to.deep.equal(REQUEST_BODY);
      };

      it('should default to json', function () {
        return client.resources.route.post(REQUEST_BODY).then(expectResponse);
      });

      it('should stringify as json when set', function () {
        return client.resources.route.post(REQUEST_BODY, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(expectResponse);
      });
    });

    describe('url encoded form', function () {
      var expectResponse = function (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.equal('username=blakeembrey&password=hunter2');
      };

      it('should stringify as a form when set', function () {
        return client.resources.route.post(REQUEST_BODY, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(expectResponse);
      });
    });

    describe('primitives', function () {
      describe('strings', function () {
        it('should send the body as set', function () {
          return client.resources.route.post('test').then(function (response) {
            expect(response.body).to.equal('test');
            expect(response.status).to.equal(200);
          });
        });
      });

      describe('numbers', function () {
        it('should send the body as a string', function () {
          return client.resources.route.post(10).then(function (response) {
            expect(response.body).to.equal('10');
            expect(response.status).to.equal(200);
          });
        });
      });

      describe('null', function () {
        it('should not send a body', function () {
          return client.resources.route.post(null).then(function (response) {
            expect(response.body).to.equal('');
            expect(response.status).to.equal(200);
          });
        });
      });
    });
  });

  describe('host objects', function () {
    var server;

    describe('form data', function () {
      before(function () {
        server = sinon.fakeServer.create();

        server.autoRespond = true;

        server.respondWith(
          'POST',
          'http://example.com/route',
          function (xhr) {
            expect(xhr.requestBody).to.be.an.instanceOf(window.FormData);

            xhr.respond(200, null, 'Success');
          }
        );
      });

      after(function () {
        server.restore();
      });

      var expectResponse = function (response) {
        expect(response.body).to.equal('Success');
        expect(response.status).to.equal(200);
      };

      it('should create form data instance', function () {
        var data = client.form(REQUEST_BODY);

        return client.resources.route.post(data).then(expectResponse);
      });

      it('should stringify to form data when set to multipart', function () {
        return client.resources.route.post(REQUEST_BODY, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(expectResponse);
      });
    });
  });
});
