var fs      = require('fs');
var qs      = require('querystring');
var join    = require('path').join;
var express = require('express');

var app  = module.exports = express();
var port = process.env.PORT || 3000;

/**
 * Respond with "Success".
 */
function successHandler (req, res) {
  return res.send('Success');
}

/**
 * Respond with the "id" uri parameter.
 */
function idParamHandler (req, res) {
  return res.send(req.params.id);
}

/**
 * Enable CORS.
 */
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

  return next();
});

/**
 * Respond to the root resource.
 */
app.all('/', successHandler);

/**
 * Bounce the status code and body back to the user.
 */
app.all('/status/:status(\\d+)', function (req, res) {
  res.statusCode = Number(req.params.status);

  return res.send('Success');
});

/**
 * Say hello!
 */
app.all('/hello', function (req, res) {
  return res.send('Hello ' + (req.query.name || 'World') + '!');
});

/**
 * Stream a file back to the user.
 */
app.all('/stream', function (req, res) {
  return fs.createReadStream(join(__dirname, 'lorem.txt')).pipe(res);
});

/**
 * Create a bounce router, whose purpose is to give requests back to the user.
 */
var bounce = new express.Router()
  .all('/url', function (req, res) {
    return res.send(req.originalUrl);
  })
  .all('/body', function (req, res) {
    res.setHeader('Content-Type', req.headers['content-type']);

    return req.pipe(res);
  })
  .all('/query', function (req, res) {
    return res.send(req.query);
  })
  .all('/headers', function (req, res) {
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization, X-Default-Header, X-Custom-Header'
    );

    return res.send(req.headers);
  })
  .all('/parameter/:id?', idParamHandler);

/**
 * Use the bouncers for the bounce and defaults routes.
 */
app.use(['/bounce', '/defaults'], bounce);

/**
 * Respond with the request uri parameter.
 */
app.all('/parameters/single/:id', idParamHandler);
app.all('/parameters/prefix/one:id', idParamHandler);
app.all('/parameters/prefix/three:id', idParamHandler);

/**
 * Respond with success.
 */
app.all('/extensions/static.json', successHandler);
app.all('/extensions/media-type/enum.:ext(json|xml)', successHandler);
app.all('/extensions/media-type/enum-period.:ext(json|xml)', successHandler);
app.all('/extensions/media-type/basic.:ext', successHandler);

/**
 * RAML conflict uris.
 */
app.all('/conflicts/media-type.json', successHandler);
app.all('/conflicts/media-type/route', successHandler);

/**
 * Respond with basic text.
 */
app.all('/responses/text', function (req, res) {
  return res.send('text');
});

/**
 * Respond with JSON.
 */
app.all('/responses/json', function (req, res) {
  return res.send({ json: true });
});

/**
 * Respond to url encoded endpoint.
 */
app.all('/responses/url-encoded/basic', function (req, res) {
  res.setHeader('Content-Type', 'application/x-www-form-urlencoded');

  return res.send('key=value');
});

/**
 * Respond to url encoded endpoint.
 */
app.all('/responses/url-encoded/duplicate', function (req, res) {
  res.setHeader('Content-Type', 'application/x-www-form-urlencoded');

  return res.send('key=1&key=2&key=3');
});

/**
 * Respond to url encoded endpoint.
 */
app.all('/responses/url-encoded/escaped', function (req, res) {
  res.setHeader('Content-Type', 'application/x-www-form-urlencoded');

  return res.send(qs.stringify({ key: 'Hello, world!' }));
});

/**
 * Listen to a port if the module wasn't required.
 */
if (!module.parent) {
  app.listen(port, function () {
    console.log('Express running at http://localhost:' + port);
  });
}
