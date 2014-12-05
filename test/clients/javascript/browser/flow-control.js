describe('flow control', function () {
  var client = new ExampleApi();

  /**
   * Array of test methods.
   *
   * @type {Array}
   */
  var METHODS = ['get', 'post', 'put', 'patch', 'delete'];

  describe('promise methods', function () {
    function validateResponse (response) {
      expect(response.body).to.equal('Hello World!');
      expect(response.status).to.equal(200);
      expect(response.headers).to.be.an('object');
      expect(response.headers['content-type']).to.match(/^text\/html/i);
    }

    METHODS.forEach(function (method) {
      describe('#' + method, function () {
        describe('#then', function () {
          it('should resolve', function () {
            return client.resources.hello[method]()
              .then(validateResponse);
          });
        });
      });
    });
  });

  describe('reuse request', function () {
    it('should reuse the promise', function () {
      var request = client.resources.hello.get();

      return request.then(function (response) {
        return request.then(function (response2) {
          expect(response).to.equal(response2);
        });
      });
    });

    it('should reuse for exec', function (done) {
      var request = client.resources.hello.get();

      return request.then(function (response) {
        return request.exec(function (err, response2) {
          expect(response).to.equal(response2);

          return done(err);
        });
      });
    });
  });

  describe('Promise#all', function () {
    it('should resolve', function () {
      return Promise
        .all([
          client.resources.hello.get(),
          client.resources.hello.post()
        ])
        .then(function (responses) {
          var get  = responses[0];
          var post = responses[1];

          expect(get.body).to.equal('Hello World!');
          expect(get.status).to.equal(200);
          expect(get.headers).to.be.an('object');

          expect(post.body).to.equal('Hello World!');
          expect(post.status).to.equal(200);
          expect(post.headers).to.be.an('object');
        });
    });
  });

  describe('#exec', function () {
    it('should callback', function (done) {
      client.resources.hello.get()
        .exec(function (err, response) {
          expect(response.body).to.equal('Hello World!');
          expect(response.status).to.equal(200);
          expect(response.headers).to.be.an('object');

          return done(err);
        });
    });
  });
});
