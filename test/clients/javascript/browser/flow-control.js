describe('flow control', function () {
  var client = new TestApi();

  /**
   * Array of base "/route" methods.
   *
   * @type {Array}
   */
  var METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  describe('promise methods', function () {
    var server;

    before(function () {
      server = sinon.fakeServer.create();

      server.autoRespond = true;

      METHODS.forEach(function (method) {
        server.respondWith(method, 'http://example.com/route', 'Hello world!');
      });
    });

    after(function () {
      server.restore();
    });

    var expectResponse = function (response) {
      expect(response.body).to.equal('Hello world!');
      expect(response.status).to.equal(200);
      expect(response.headers).to.deep.equal({});
    };

    METHODS.forEach(function (method) {
      describe(method, function () {
        describe('#then', function () {
          it('should resolve', function () {
            return client.resources.route[method.toLowerCase()]()
              .then(expectResponse);
          });
        });
      });
    });
  });

  describe('reuse request', function () {
    var count;
    var server;

    beforeEach(function () {
      count  = 0;
      server = sinon.fakeServer.create();

      server.autoRespond = true;

      server.respondWith('GET', 'http://example.com/route', function () {
        return count++;
      });
    });

    afterEach(function () {
      server.restore();
    });

    it('should reuse the promise', function () {
      var request = client.resources.route.get();

      return request.then(function (response) {
        expect(count).to.equal(1);

        return request.then(function () {
          expect(count).to.equal(1);

          return request.then(function () {
            expect(count).to.equal(1);
          });
        });
      });
    });

    it('should reuse for exec', function (done) {
      var request = client.resources.route.get();

      return request.then(function (response) {
        expect(count).to.equal(1);

        return request.exec(function (err, response) {
          expect(count).to.equal(1);

          return done(err);
        });
      });
    });
  });

  describe('Promise#all', function () {
    var server;

    before(function () {
      server = sinon.fakeServer.create();

      server.autoRespond = true;

      server.respondWith('GET', 'http://example.com/route', 'GET works!');
      server.respondWith('POST', 'http://example.com/route', 'POST works!');
    });

    after(function () {
      server.restore();
    });

    it('should resolve', function () {
      return Promise
        .all([
          client.resources.route.get(),
          client.resources.route.post()
        ])
        .then(function (requests) {
          var get  = requests[0];
          var post = requests[1];

          expect(get.body).to.equal('GET works!');
          expect(get.status).to.equal(200);
          expect(get.headers).to.deep.equal({});

          expect(post.body).to.equal('POST works!');
          expect(post.status).to.equal(200);
          expect(post.headers).to.deep.equal({});
        });
    });
  });

  describe('#exec', function () {
    var server;

    before(function () {
      server = sinon.fakeServer.create();

      server.autoRespond = true;

      server.respondWith('GET', 'http://example.com/route', 'Exec works!');
    });

    after(function () {
      server.restore();
    });

    it('should callback', function (done) {
      client.resources.route.get()
        .exec(function (err, response) {
          expect(response.body).to.equal('Exec works!');
          expect(response.status).to.equal(200);
          expect(response.headers).to.deep.equal({});

          return done(err);
        });
    });
  });
});
