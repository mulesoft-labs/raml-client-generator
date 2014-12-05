describe('base uri', function () {
  var server;

  function validateResponse (response) {
    expect(response.body).to.equal('Hello World!');
    expect(response.status).to.equal(200);
  }

  before(function () {
    server = sinon.fakeServer.create();

    server.autoRespond = true;

    server.respondWith('GET', 'http://test.com/hello', 'Hello World!');
    server.respondWith('GET', 'http://google.com/search/hello', 'Hello World!');
  });

  after(function () {
    server.restore();
  });

  describe('set base uri', function () {
    var client = new ExampleApi({
      baseUri: 'http://google.com/search/'
    });

    it('should be able to manually set the base uri', function () {
      return client.resources.hello.get()
        .then(validateResponse);
    });
  });

  describe('base uri parameters', function () {
    var client = new ExampleApi({
      baseUri: 'http://{domain}.com',
      baseUriParameters: {
        domain: 'test'
      }
    });

    it('should be able to manually set the base uri', function () {
      return client.resources.hello.get()
        .then(validateResponse);
    });
  });
});
