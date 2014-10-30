describe('response headers', function () {
  var client = new ExampleApi();

  it('should return in a lower-cased object', function () {
    return client.resources.get()
      .then(function (res) {
        expect(res.body).to.equal('Success');
        expect(res.status).to.equal(200);

        // Only have access to certain headers in browsers.
        expect(res.headers).to.deep.equal({
          'content-type': 'text/html; charset=utf-8'
        });
      });
  });
});
