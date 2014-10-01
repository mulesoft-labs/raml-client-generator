# RAML Client Generator

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Template-driven generator of clients for APIs described by RAML.

## Installation

```sh
npm install raml-client-generator --save
```

## Usage

```sh
raml-client api.raml -o api-client -l javascript
```

### Supported Languages

The only language currently supported is **JavaScript**. To add support for more languages, take a look at the `generators` directory.

### Language Implementation

To maintain consistency across clients in multiple languages, certain behaviours must be the same.

#### Files

Every implementation can contain as many files as required. It is recommended to have a minimum of a `README.md`, package definition and the implementation logic in several separate files.

#### Client

The main client function should be able to create multiple instances.

#### Resource DSL

The core generator function maintains a consistent DSL for all resources. Just generate the relevant classes based on the generator AST. The aim is to generate a readable and maintainable DSL based on the resource path. For example, `/route` becomes `.route` in JavaScript.

The resources DSL should be nested under the `resources` property of a client instance.

#### Resource methods

Every available resource verb should be a separate method at the end of the respective DSL chain. The actual behaviour of this method may alter between implementations. In JavaScript, it returns a promise.

GET and HEAD requests should have a shorthand to set the query parameters, while all other method should have a shorthand to set the body. The other option passed into resource methods should be a map of options such as `query`, `headers`, `body`, `baseUri` and `baseUriParameters`.

#### Base URI and Parameters

The base uri and base uri parameters should be overridable in a client instance.

#### Requests

Requests should attempt to automatically convert to something that can be sent to an external server. If the content is already a native format that can be transferred, no action is required.

If the `Content-Type` header has not been set, it should be set to the most relevant format in your target language. The `Content-Type` header will be used to decide which format the data should be represented as.

If the `Content-Type` header has been set to `application/json`, stringify the content as JSON. If it has set to `application/x-www-form-urlencoded`, url encode the form. If it has been set to `multipart/form-data`, the content should be sent as a multipart form.

#### Responses

Responses should come back in a standard format - `status`, `headers`, `body` and `raw`.

* **status** - The numbered status code of response. E.g. `200`.
* **headers** - A map of header to value. The header key will always be lowercased.
* **body** - The parsed body response represented as a native type.
* **raw** - The original raw response in the target language.

The response body must be parsed according to the response `Content-Type` header. If the header is `application/json`, it should be parsed automatically from JSON. If the header is `application/x-www-form-urlencoded`, parse as a url encoded form. Otherwise, it should be a string.

## License

Apache 2.0

[npm-image]: https://img.shields.io/npm/v/raml-client-generator.svg?style=flat
[npm-url]: https://npmjs.org/package/raml-client-generator
[travis-image]: https://img.shields.io/travis/mulesoft/raml-client-generator.svg?style=flat
[travis-url]: https://travis-ci.org/mulesoft/raml-client-generator
[coveralls-image]: https://img.shields.io/coveralls/mulesoft/raml-client-generator.svg?style=flat
[coveralls-url]: https://coveralls.io/r/mulesoft/raml-client-generator?branch=master
