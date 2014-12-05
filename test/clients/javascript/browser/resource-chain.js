describe('resource chain', function () {
  var client = new ExampleApi();

  function validateResponse (response) {
    expect(response.body).to.equal('Success');
    expect(response.status).to.equal(200);
  }

  describe('root resource', function () {
    it('should be supported', function () {
      return client.resources.get().then(validateResponse);
    });
  });

  describe('uri parameter', function () {
    it('should dynamically generate the resource chain', function () {
      return client.resources.bounce.parameter.variable(123).get()
        .then(function (res) {
          expect(res.body).to.equal('123');
          expect(res.status).to.equal(200);
        });
    });
  });

  describe('null uri parameter', function () {
    it('should output null values as an empty string', function () {
      return client.resources.bounce.parameter.variable(null).get()
        .then(function (res) {
          expect(res.body).to.equal(null);
          expect(res.status).to.equal(200);
        });
    });
  });

  describe('default uri parameter', function () {
    it('should use the default value when null', function () {
      return client.resources.defaults.parameter.variable(null).get()
        .then(function (res) {
          expect(res.body).to.equal('default');
          expect(res.status).to.equal(200);
        });
    });
  });

  describe('prefixed uri parameter', function () {
    function validateResponse (res) {
      expect(res.body).to.equal('123');
      expect(res.status).to.equal(200);
    }

    describe('single parameter', function () {
      it('should support arguments', function () {
        return client.resources.parameters.prefix.one(123).get()
          .then(validateResponse);
      });

      it('should not support more arguments than defined', function () {
        return client.resources.parameters.prefix.one(123, 456).get()
          .then(validateResponse);
      });
    });

    describe('multiple parameters', function () {
      it('should dynamically generate the resource chain', function () {
        return client.resources.parameters.prefix.three(1, 2, 3).get()
          .then(function (res) {
            expect(res.body).to.equal('123');
            expect(res.status).to.equal(200);
          });
      });
    });
  });

  describe('extensions', function () {
    describe('static extension', function () {
      it('should support extensions in the resource chain', function () {
        return client.resources.extensions.static.json.get()
          .then(validateResponse);
      });
    });

    describe('media type extension', function () {
      describe('basic', function () {
        it('should support mediaTypeExtension parameter', function () {
          return client.resources.extensions.mediaType.basic
            .mediaTypeExtension('json').get()
            .then(validateResponse);
        });
      });

      describe('enum', function () {
        it('should have paths from enum values', function () {
          return client.resources.extensions.mediaType.enum.json.get()
            .then(validateResponse);
        });
      });

      describe('enum with period', function () {
        it('should have paths from period prefixed enum values', function () {
          return client.resources.extensions.mediaType.enumPeriod.xml.get()
            .then(validateResponse);
        });
      });
    });
  });

  describe('conflicts', function () {
    describe('media type extension', function () {
      it('should handle original route', function () {
        return client.resources.conflicts.mediaType.route.get()
          .then(validateResponse);
      });

      it('should handle conflict with media type extension', function () {
        return client.resources.conflicts.mediaType
          .mediaTypeExtension('json').get()
          .then(validateResponse);
      });
    });
  });
});
