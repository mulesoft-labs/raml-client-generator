describe('custom resource', function () {
  var client = new TestApi();

  /**
   * Inlined array of supported HTTP methods.
   *
   * @type {Array}
   */
  var METHODS = [
    'checkout',
    'connect',
    'copy',
    'delete',
    'get',
    'head',
    'lock',
    'm-search',
    'merge',
    'mkactivity',
    'mkcol',
    'move',
    'notify',
    'options',
    'patch',
    'post',
    'propfind',
    'proppatch',
    'purge',
    'put',
    'report',
    'search',
    'subscribe',
    'trace',
    'unlock',
    'unsubscribe'
  ];

  /**
   * Naive camel case support.
   *
   * @param  {String} str
   * @return {String}
   */
  var camelCase = function (str) {
    return str.replace(/([a-z])[\_\-]([a-z])/, function (match, a, b) {
      return a + b.toUpperCase();
    });
  };

  var expectResponse = function (response) {
    expect(response.body).to.equal('Success');
    expect(response.status).to.equal(200);
  };

  METHODS.forEach(function (method) {
    describe(method, function () {
      var server;

      beforeEach(function () {
        server = sinon.fakeServer.create();

        server.autoRespond = true;

        server.respondWith(method, 'http://example.com/route/123', 'Success');
      });

      afterEach(function () {
        server.restore();
      });

      it('should be supported', function () {
        return client.resource('/route/{id}', { id: 123 })[camelCase(method)]()
          .then(expectResponse);
      });
    });
  });
});
