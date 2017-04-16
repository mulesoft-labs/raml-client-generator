# RAML Client Generator

[![Join the chat at https://gitter.im/mulesoft/raml-client-generator](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mulesoft/raml-client-generator?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]

Template-driven generator of clients for APIs described by RAML.

## Installation

First, make sure [node](http://nodejs.org) has been installed. Then, we can install it using `npm`:

```
npm install raml-client-generator -g
```

## Usage

To generate an API client, point the command to your base RAML file and specify the output directory and language.

```
raml-to-client api.raml -o api-client -l javascript
```

## Supported Languages

* [JavaScript](https://github.com/mulesoft-labs/raml-javascript-generator) (`javascript`)
  * Node and browser support
  * Promises
  * Complete OAuth 2.0 Support
  * Multiple client instances
  * Automatic `README.md` and `package.json` generation
  * Multi-part form data

We're excited to see new languages soon! If you have a language you'd like to implement, check out the [implementation guide](IMPLEMENTATION.md).

## Testing

```sh
npm install
npm test # This *will* test every language.
```

## License

Apache 2.0

[npm-image]: https://img.shields.io/npm/v/raml-client-generator.svg?style=flat
[npm-url]: https://npmjs.org/package/raml-client-generator
[downloads-image]: https://img.shields.io/npm/dm/raml-client-generator.svg?style=flat
[downloads-url]: https://npmjs.org/package/raml-client-generator
[travis-image]: https://img.shields.io/travis/mulesoft/raml-client-generator.svg?style=flat
[travis-url]: https://travis-ci.org/mulesoft/raml-client-generator
