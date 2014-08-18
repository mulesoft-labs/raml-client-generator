describe('response headers', function () {
  var client = new TestApi();
  var server;

  before(function () {
    server = sinon.fakeServer.create();

    server.autoRespond = true;

    server.respondWith(
      'GET',
      'http://example.com/route',
      [
        200,
        {
          'Content-Type':    'text/javascript',
          'X-Custom-Header': 'Custom Header Response'
        },
        'Response body'
      ]
    );
  });

  after(function () {
    server.restore();
  });

  it('should return in a lower-cased object', function () {
    return client.resources.route.get()
      .then(function (response) {
        expect(response.body).to.equal('Response body');
        expect(response.status).to.equal(200);
        expect(response.headers).to.deep.equal({
          'content-type':    'text/javascript',
          'x-custom-header': 'Custom Header Response'
        });
      });
  });
});
