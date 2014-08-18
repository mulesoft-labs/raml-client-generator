var nock    = require('nock');
var expect  = require('chai').expect;
var TestApi = require('../.tmp/test');

describe('resource chain', function () {
  var client = new TestApi();

  var expectResponse = function (response) {
    expect(response.body).to.equal('Success');
    expect(response.status).to.equal(200);
  };

  describe('root resource', function () {
    beforeEach(function () {
      nock('http://example.com')
        .get('/')
        .reply(200, 'Success');
    });

    it('should be supported', function () {
      return client.resources.get().then(expectResponse);
    });
  });

  describe('uri parameter only', function () {
    beforeEach(function () {
      nock('http://example.com')
        .get('/parameters/single/123')
        .reply(200, 'Success');
    });

    it('should dynamically generate the resource chain', function () {
      return client.resources.parameters.single.id(123).get()
        .then(expectResponse);
    });
  });

  describe('null uri parameter', function () {
    beforeEach(function () {
      nock('http://example.com')
        .get('/parameters/single/')
        .reply(200, 'Success');
    });

    it('should output null values as an empty string', function () {
      return client.resources.parameters.single.id(null).get()
        .then(expectResponse);
    });
  });

  describe('default uri parameter', function () {
    beforeEach(function () {
      nock('http://example.com')
        .get('/parameters/default/test')
        .reply(200, 'Success');
    });

    it('should use the default value when null', function () {
      return client.resources.parameters.default.parameter(null).get()
        .then(expectResponse);
    });
  });

  describe('prefixed uri parameter', function () {
    describe('single parameter', function () {
      beforeEach(function () {
        nock('http://example.com')
          .get('/parameters/prefix/one123')
          .reply(200, 'Success');
      });

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
      beforeEach(function () {
        nock('http://example.com')
          .get('/parameters/prefix/three123')
          .reply(200, 'Success');
      });

      it('should dynamically generate the resource chain', function () {
        return client.resources.parameters.prefix.three(1, 2, 3).get()
          .then(expectResponse);
      });
    });
  });

  describe('extensions', function () {
    describe('static extension', function () {
      beforeEach(function () {
        nock('http://example.com')
          .get('/extensions/static.json')
          .reply(200, 'Success');
      });

      it('should support extensions in the resource chain', function () {
        return client.resources.extensions.static.json.get()
          .then(expectResponse);
      });
    });

    describe('media type extension', function () {
      describe('basic', function () {
        beforeEach(function () {
          nock('http://example.com')
            .get('/extensions/media-type/basic.json')
            .reply(200, 'Success');
        });

        it('should support mediaTypeExtension parameter', function () {
          return client.resources.extensions.mediaType.basic.mediaTypeExtension('json').get()
            .then(expectResponse);
        });
      });

      describe('enum', function () {
        beforeEach(function () {
          nock('http://example.com')
            .get('/extensions/media-type/enum.json')
            .reply(200, 'Success');
        });

        it('should have paths from enum values', function () {
          return client.resources.extensions.mediaType.enum.json.get()
            .then(expectResponse);
        });
      });

      describe('enum with period', function () {
        beforeEach(function () {
          nock('http://example.com')
            .get('/extensions/media-type/enum-with-period.xml')
            .reply(200, 'Success');
        });

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
        nock('http://example.com')
          .get('/conflicts/media-type/route')
          .reply(200, 'Success');

        return client.resources.conflicts.mediaType.route.get()
          .then(expectResponse);
      });

      it('should handle conflict with media type extension', function () {
        nock('http://example.com')
          .get('/conflicts/media-type.json')
          .reply(200, 'Success');

        return client.resources.conflicts.mediaType.mediaTypeExtension('json').get()
          .then(expectResponse);
      });
    });
  });
});
