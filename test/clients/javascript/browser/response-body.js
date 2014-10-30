describe('response body', function () {
  var client = new ExampleApi();

  describe('response content types', function () {
    describe('text', function () {
      it('should respond as text when unknown', function () {
        return client.resources.responses.text.get()
          .then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body).to.equal('text');
          });
      });
    });

    describe('json', function () {
      it('should parse as JSON when specified', function () {
        return client.resources.responses.json.get()
          .then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({ json: true });
          });
      });
    });

    describe('url encoded', function () {
      describe('simple query string', function () {
        it('should parse', function () {
          return client.resources.responses.urlEncoded.basic.get()
            .then(function (response) {
              expect(response.status).to.equal(200);
              expect(response.body).to.deep.equal({ key: 'value' });
            });
        });
      });

      describe('duplicate keys', function () {
        it('should put duplicate keys into an array', function () {
          return client.resources.responses.urlEncoded.duplicate.post()
            .then(function (response) {
              expect(response.status).to.equal(200);
              expect(response.body).to.deep.equal({ key: ['1', '2', '3'] });
            });
        });
      });

      describe('encoded values', function () {
        it('should be uri decoded', function () {
          return client.resources.responses.urlEncoded.escaped.put()
            .then(function (response) {
              expect(response.status).to.equal(200);
              expect(response.body).to.deep.equal({ key: 'Hello, world!' });
            });
        });
      });
    });
  });
});
