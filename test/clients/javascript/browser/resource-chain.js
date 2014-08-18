describe('resource chain', function () {
  var client = new TestApi();
  var server;

  before(function () {
    server = sinon.fakeServer.create();

    server.autoRespond = true;

    [
      'http://example.com',
      'http://example.com/parameters/single/123',
      'http://example.com/parameters/single/',
      'http://example.com/parameters/default/test',
      'http://example.com/parameters/prefix/one123',
      'http://example.com/parameters/prefix/three123',
      'http://example.com/extensions/static.json',
      'http://example.com/extensions/media-type/basic.json',
      'http://example.com/extensions/media-type/enum.json',
      'http://example.com/extensions/media-type/enum-with-period.xml',
      'http://example.com/conflicts/media-type/route',
      'http://example.com/conflicts/media-type.json',
      'http://example.com/conflicts/param123/route',
      'http://example.com/conflicts/param123/example'
    ].forEach(function (route) {
      server.respondWith('GET', route, 'Success');
    });
  });

  after(function () {
    server.restore();
  });

  var expectResponse = function (response) {
    expect(response.body).to.equal('Success');
    expect(response.status).to.equal(200);
  };

  describe('root resource', function () {
    it('should be supported', function () {
      return client.resources.get().then(expectResponse);
    });
  });

  describe('uri parameter only', function () {
    it('should support arguments', function () {
      return client.resources.parameters.single.id(123).get()
        .then(expectResponse);
    });

    it('should not support more arguments than defined', function () {
      return client.resources.parameters.single.id(123, 456).get()
        .then(expectResponse);
    });
  });

  describe('null uri parameter', function () {
    it('should output null values as an empty string', function () {
      return client.resources.parameters.single.id(null).get()
        .then(expectResponse);
    });
  });

  describe('default uri parameter', function () {
    it('should use the default value when null', function () {
      return client.resources.parameters.default.parameter(null).get()
        .then(expectResponse);
    });
  });

  describe('prefixed uri parameter', function () {
    describe('single parameter', function () {
      it('should support arguments', function () {
        return client.resources.parameters.prefix.one(123).get()
          .then(expectResponse);
      });

      it('should not support more arguments than defined', function () {
        return client.resources.parameters.prefix.one(123, 456).get()
          .then(expectResponse);
      });
    });

    describe('multiple parameters', function () {
      it('should dynamically generate the resource chain', function () {
        return client.resources.parameters.prefix.three(1, 2, 3).get()
          .then(expectResponse);
      });
    });
  });

  describe('extensions', function () {
    describe('static extension', function () {
      it('should support extensions in the resource chain', function () {
        return client.resources.extensions.static.json.get()
          .then(expectResponse);
      });
    });

    describe('media type extension', function () {
      describe('basic', function () {
        it('should support mediaTypeExtension parameter', function () {
          return client.resources.extensions.mediaType.basic.mediaTypeExtension('json').get()
            .then(expectResponse);
        });
      });

      describe('enum', function () {
        it('should have paths from enum values', function () {
          return client.resources.extensions.mediaType.enum.json.get()
            .then(expectResponse);
        });
      });

      describe('enum with period', function () {
        it('should have paths from period prefixed enum values', function () {
          return client.resources.extensions.mediaType.enumWithPeriod.xml.get()
            .then(expectResponse);
        });
      });
    });
  });

  describe('conflicts', function () {
    describe('media type extension', function () {
      it('should handle original route', function () {
        return client.resources.conflicts.mediaType.route.get()
          .then(expectResponse);
      });

      it('should handle conflict with media type extension', function () {
        return client.resources.conflicts.mediaType.mediaTypeExtension('json').get()
          .then(expectResponse);
      });
    });
  });
});
