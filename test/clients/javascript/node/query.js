var nock    = require('nock');
var expect  = require('chai').expect;
var TestApi = require('../.tmp/test');

describe('query string', function () {
  var client = new TestApi();

  describe('append query string', function () {
    var expectResponse = function (response) {
      expect(response.status).to.equal(200);
      expect(response.body).to.equal('/route?key=string');
    };

    describe('body argument (#get)', function () {
      beforeEach(function () {
        nock('http://example.com')
          .get('/route?key=string')
          .reply(200, function (uri) {
            return uri;
          });
      });

      it('should pass query string as an object', function () {
        return client.resources.route.get({ key: 'string' })
          .then(expectResponse);
      });

      it('should pass query string as a string', function () {
        return client.resources.route.get('key=string')
          .then(expectResponse);
      });
    });

    describe('option argument (#post)', function () {
      beforeEach(function () {
        nock('http://example.com')
          .post('/route?key=string')
          .reply(200, function (uri) {
            return uri;
          });
      });

      it('should pass query string as an object', function () {
        return client.resources.route.post(null, { query: { key: 'string' } })
          .then(expectResponse);
      });

      it('should pass query string as a string', function () {
        return client.resources.route.post(null, { query: 'key=string' })
          .then(expectResponse);
      });
    });
  });

  describe('types', function () {
    describe('array', function () {
      beforeEach(function () {
        nock('http://example.com')
          .get('/route?key=1&key=2&key=3')
          .reply(200, function (uri) {
            return uri;
          });
      });

      it('should stringify with multiple keys', function () {
        return client.resources.route.get({
          key: [1, 2, 3]
        }).then(function (response) {
          expect(response.status).to.equal(200);
          expect(response.body).to.equal('/route?key=1&key=2&key=3');
        });
      });
    });
  });
});
