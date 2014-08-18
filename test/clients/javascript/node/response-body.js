var nock    = require('nock');
var expect  = require('chai').expect;
var TestApi = require('../.tmp/test');

describe('response body', function () {
  var client = new TestApi();

  describe('response content types', function () {
    describe('text', function () {
      beforeEach(function () {
        nock('http://example.com')
          .get('/route')
          .reply(200, 'test');
      });

      it('should respond as text when unknown', function () {
        return client.resources.route.get().then(function (response) {
          expect(response.status).to.equal(200);
          expect(response.body).to.deep.equal('test');
        });
      });
    });

    describe('json', function () {
      beforeEach(function () {
        nock('http://example.com')
          .get('/route')
          .reply(200, '{"key":"value","this":"that"}', {
            'Content-Type': 'application/json'
          });
      });

      it('should parse as JSON when specified', function () {
        return client.resources.route.get().then(function (response) {
          expect(response.status).to.equal(200);
          expect(response.body).to.deep.equal({ key: 'value', this: 'that' });
        });
      });
    });

    describe('url encoded', function () {
      describe('simple query string', function () {
        beforeEach(function () {
          nock('http://example.com')
            .get('/route')
            .reply(200, 'key=value&this=that', {
              'Content-Type': 'application/x-www-form-urlencoded'
            });
        });

        it('should parse when specified', function () {
          return client.resources.route.get().then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({ key: 'value', this: 'that' });
          });
        });
      });

      describe('duplicate keys', function () {
        beforeEach(function () {
          nock('http://example.com')
            .post('/route')
            .reply(200, 'key=1&key=2&key=3', {
              'Content-Type': 'application/x-www-form-urlencoded'
            });
        });

        it('should put duplicate key values into an array', function () {
          return client.resources.route.post().then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({ key: ['1', '2', '3'] });
          });
        });
      });

      describe('encoded values', function () {
        beforeEach(function () {
          nock('http://example.com')
            .put('/route')
            .reply(200, 'key=Hello%2C%20world', {
              'Content-Type': 'application/x-www-form-urlencoded'
            });
        });

        it('should be uri decoded', function () {
          return client.resources.route.put().then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({ key: 'Hello, world' });
          });
        });
      });
    });
  });
});
