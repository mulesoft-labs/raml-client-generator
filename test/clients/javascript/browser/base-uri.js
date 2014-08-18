describe('base uri', function () {
  var expectResponse = function (response) {
    expect(response.body).to.equal('Hello world!');
    expect(response.status).to.equal(200);
  };

  before(function () {
    server = sinon.fakeServer.create();

    server.autoRespond = true;

    server.respondWith('GET', 'http://test.com/route', 'Hello world!');
    server.respondWith('GET', 'http://google.com/search/route', 'Hello world!');
  });

  after(function () {
    server.restore();
  });

  describe('set base uri', function () {
    var client = new TestApi({
      baseUri: 'http://google.com/search/'
    });

    it('should be able to manually set the base uri', function () {
      return client.resources.route.get().then(expectResponse);
    });
  });

  describe('base uri parameters', function () {
    var client = new TestApi({
      baseUri: 'http://{domain}.com',
      baseUriParameters: {
        domain: 'test'
      }
    });

    it('should be able to manually set the base uri', function () {
      return client.resources.route.get().then(expectResponse);
    });
  });
});
