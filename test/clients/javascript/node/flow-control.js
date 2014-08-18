var fs      = require('fs');
var path    = require('path');
var nock    = require('nock');
var expect  = require('chai').expect;
var Promise = require('bluebird');
var equal   = require('../support/stream-equal');
var TestApi = require('../.tmp/test');

/**
 * File location of the lorem ipsum static text file.
 *
 * @type {String}
 */
var LOREM_IPSUM_FILE = path.join(__dirname, '../../../fixtures/lorem.txt');

/**
 * Array of base "/route" test methods.
 *
 * @type {Array}
 */
var METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

describe('flow control', function () {
  var client = new TestApi();

  describe('promise methods', function () {
    var expectResponse = function (response) {
      expect(response.body).to.equal('Hello world!');
      expect(response.status).to.equal(200);
      expect(response.headers).to.deep.equal({});
    };

    METHODS.forEach(function (method) {
      describe(method, function () {
        var methodName = method.toLowerCase();

        beforeEach(function () {
          nock('http://example.com')
            [methodName]('/route')
            .reply(200, 'Hello world!');
        });

        describe('#then', function () {
          it('should resolve', function () {
            return client.resources.route[methodName]()
              .then(expectResponse);
          });
        });

        describe('#tap', function () {
          it('should resolve', function () {
            return client.resources.route[methodName]()
              .tap(expectResponse)
              .then(expectResponse);
          });
        });
      });
    });
  });

  describe('reuse request', function () {
    var count;
    var server;

    beforeEach(function () {
      count = 0;

      nock('http://example.com')
        .get('/route')
        .reply(200, function () {
          return count++;
        });
    });

    it('should reuse the promise', function () {
      var request = client.resources.route.get();

      return request.then(function (response) {
        expect(count).to.equal(1);

        return request.then(function () {
          expect(count).to.equal(1);

          return request.then(function () {
            expect(count).to.equal(1);
          });
        });
      });
    });

    it('should reuse for exec', function (done) {
      var request = client.resources.route.get();

      return request.then(function (response) {
        expect(count).to.equal(1);

        return request.exec(function (err, response) {
          expect(count).to.equal(1);

          return done(err);
        });
      });
    });
  });

  describe('Promise#all', function () {
    beforeEach(function () {
      nock('http://example.com')
        .get('/route')
        .reply(200, 'GET works!')
        .post('/route')
        .reply(200, 'POST works!');
    });

    it('should resolve', function () {
      return Promise
        .all([
          client.resources.route.get(),
          client.resources.route.post()
        ])
        .spread(function (get, post) {
          expect(get.body).to.equal('GET works!');
          expect(get.status).to.equal(200);
          expect(get.headers).to.deep.equal({});

          expect(post.body).to.equal('POST works!');
          expect(post.status).to.equal(200);
          expect(post.headers).to.deep.equal({});
        });
    });
  });

  describe('#stream', function () {
    beforeEach(function () {
      nock('http://example.com')
        .post('/route')
        .reply(200, function (uri, body) {
          return body;
        });
    });

    it('should stream data', function () {
      var request = fs.createReadStream(LOREM_IPSUM_FILE)
        .pipe(client.resources.route.post().stream());

      // Check the it's actually the request stream.
      expect(request.uri.host).to.equal('example.com');

      return equal(request, fs.createReadStream(LOREM_IPSUM_FILE));
    });
  });

  describe('#pipe', function () {
    beforeEach(function () {
      nock('http://example.com')
        .get('/route')
        .replyWithFile(200, LOREM_IPSUM_FILE);
    });

    it('should pipe response', function () {
      var request = client.resources.route.get();

      return equal(request, fs.createReadStream(LOREM_IPSUM_FILE));
    });
  });

  describe('#exec', function () {
    beforeEach(function () {
      nock('http://example.com')
        .get('/route')
        .reply(200, 'Exec works!');
    });

    it('should callback', function (done) {
      client.resources.route.get()
        .exec(function (err, response) {
          expect(response.body).to.equal('Exec works!');
          expect(response.status).to.equal(200);
          expect(response.headers).to.deep.equal({});

          return done(err);
        });
    });
  });
});
