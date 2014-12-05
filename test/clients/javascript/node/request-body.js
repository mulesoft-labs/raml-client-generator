var expect     = require('chai').expect;
var ExampleApi = require('../.tmp/example');

describe('request body', function () {
  var client = new ExampleApi();

  var REQUEST_BODY = {
    username: 'blakeembrey',
    password: 'hunter2'
  };

  describe('basic request bodies', function () {
    describe('json', function () {
      function validateResponse (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal(REQUEST_BODY);
      }

      it('should default to json', function () {
        return client.resources.bounce.body.post(REQUEST_BODY)
          .then(validateResponse);
      });

      it('should stringify as json when specified', function () {
        return client.resources.bounce.body.post(REQUEST_BODY, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(validateResponse);
      });
    });

    describe('url encoded form', function () {
      function validateResponse (response) {
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal(REQUEST_BODY);
      }

      it('should stringify as a form when set', function () {
        return client.resources.bounce.body.post(REQUEST_BODY, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(validateResponse);
      });
    });

    describe('primitives', function () {
      describe('strings', function () {
        it('should send the body as set', function () {
          return client.resources.bounce.body.post('test')
            .then(function (response) {
              expect(response.body).to.equal('test');
              expect(response.status).to.equal(200);
            });
        });
      });

      describe('numbers', function () {
        it('should send the body as a string', function () {
          return client.resources.bounce.body.post(10)
            .then(function (response) {
              expect(response.body).to.equal('10');
              expect(response.status).to.equal(200);
            });
        });
      });

      describe('null', function () {
        it('should not send a body', function () {
          return client.resources.bounce.body.post(null)
            .then(function (response) {
              expect(response.body).to.equal(null);
              expect(response.status).to.equal(200);
            });
        });
      });
    });
  });
});
