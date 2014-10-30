describe('request headers', function () {
  var client = new ExampleApi();

  describe('custom headers', function () {
    it('should pass custom headers with the request', function () {
      return client.resources.bounce.headers.get(null, {
        headers: { 'X-Custom-Header': 'Custom Header' }
      }).then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.body['x-custom-header']).to.equal('Custom Header');
      });
    });
  });

  describe('default headers', function () {
    describe('use defaults', function () {
      it('should use default headers from definition', function () {
        return client.resources.defaults.headers.get()
          .then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body['x-default-header']).to.equal('Hello World!');
          });
      });
    });

    describe('override defaults', function () {
      it('should override default headers', function () {
        return client.resources.defaults.headers.get(null, {
          headers: { 'x-default-header': 'Overridden' }
        }).then(function (response) {
          expect(response.status).to.equal(200);
          expect(response.body['x-default-header']).to.equal('Overridden');
        });
      });
    });
  });
});
