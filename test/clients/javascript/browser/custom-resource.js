describe('custom resource', function () {
  var client = new ExampleApi();

  /**
   * Inlined array of supported HTTP methods.
   *
   * @type {Array}
   */
  var METHODS = [
    'delete',
    'get',
    'patch',
    'post',
    'put'
  ];

  function validateResponse (response) {
    expect(response.body).to.equal('Success');
    expect(response.status).to.equal(200);
  }

  METHODS.forEach(function (method) {
    describe('#' + method, function () {
      it('should be supported', function () {
        return client.resource('/status/{id}', { id: 200 })[method]()
          .then(validateResponse);
      });
    });
  });
});
