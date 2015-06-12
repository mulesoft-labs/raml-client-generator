!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.ramlClientGenerator=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Map dependencies to their environment.
 *
 * @type {Object}
 */
var DEPS_MAP = {
  node: {
    popsicle:     'require(\'popsicle\')',
    ClientOAuth2: 'require(\'client-oauth2\')'
  },
  amd: {
    popsicle:     '\'popsicle\'',
    ClientOAuth2: '\'ClientOAuth2\''
  },
  browser: {
    popsicle:     'root.popsicle',
    ClientOAuth2: 'root.ClientOAuth2'
  }
};

/**
 * Map an array of dependency names to values.
 *
 * @param  {Array}  deps
 * @param  {String} env
 * @return {Array}
 */
function mapDeps (deps, env) {
  if (!env) {
    return deps;
  }

  return deps.map(function (dep) {
    return DEPS_MAP[env][dep];
  });
}

/**
 * Create a dependencies string.
 *
 * @param  {Object} context
 * @param  {String} env
 * @return {String}
 */
module.exports = function (context, env) {
  var deps = ['popsicle'];

  // OAuth 2.0 depends on ClientOAuth2 to work.
  if (context.security['OAuth 2.0']) {
    deps.push('ClientOAuth2');
  }

  // Returns an array of strings for AMD.
  if (env === 'amd') {
    return '[' + mapDeps(deps, env).join(', ') + ']';
  }

  return mapDeps(deps, env).join(', ');
};

},{}],2:[function(require,module,exports){
/**
 * Iterate over the parameters and turn into a string.
 *
 * @param  {Object} parameters
 * @return {String}
 */
module.exports = function (parameters) {
  return Object.keys(parameters).map(function (key) {
    var parameter = parameters[key];
    var title     = '* **' + parameter.displayName + '**';
    var options   = [];

    if (parameter.type) {
      options.push(parameter.type);
    }

    if (Array.isArray(parameter.enum) && parameter.enum.length) {
      options.push('one of (' + parameter.enum.join(', ') + ')');
    }

    if (parameter.default) {
      options.push('default: ' + parameter.default);
    }

    return title +
      (options.length ? ' _' + options.join(', ') + '_' : '') +
      (parameter.description ? '\n\n' + parameter.description : '');
  }).join('\n\n');
};

},{}],3:[function(require,module,exports){
/**
 * Pull out request parameters from the resource.
 *
 * @param  {Object} resource
 * @return {String}
 */
var params = function (resource) {
  return resource.uriParameters.map(function (param) {
    return param.displayName;
  }).join(', ');
};

/**
 * Stringify a resource into a request snippet.
 *
 * @param  {Object} resource
 * @return {String}
 */
module.exports = function (resource) {
  var parts = [];
  var part  = resource;

  while (part && part.parent) {
    var segment = part.key;

    // If uri parameters exist, push onto the stack.
    if (part.uriParameters.length) {
      segment += '(' + params(part) + ')';
    }

    parts.unshift(segment);

    part = part.parent;
  }

  return 'resources' + (parts.length ? '.' + parts.join('.') : '');
};

},{}],4:[function(require,module,exports){
var generator = require('../../lib/generator');

/**
 * Export a client generator instance.
 *
 * @type {Function}
 */
module.exports = generator({
  templates: {
    '.gitignore':   require('./templates/.gitignore.hbs'),
    'index.js':     require('./templates/index.js.hbs'),
    'README.md':    require('./templates/README.md.hbs'),
    'INSTALL.md':   require('./templates/INSTALL.md.hbs'),
    'package.json': require('./templates/package.json.hbs')
  },
  format: {
    variable: require('camel-case')
  },
  partials: {
    auth:      require('./partials/auth.js.hbs'),
    utils:     require('./partials/utils.js.hbs'),
    client:    require('./partials/client.js.hbs'),
    resources: require('./partials/resources.js.hbs')
  },
  helpers: {
    stringify:         require('javascript-stringify'),
    dependencies:      require('./helpers/dependencies'),
    requestSnippet:    require('./helpers/request-snippet'),
    parametersSnippet: require('./helpers/parameters-snippet')
  }
});

},{"../../lib/generator":21,"./helpers/dependencies":1,"./helpers/parameters-snippet":2,"./helpers/request-snippet":3,"./partials/auth.js.hbs":5,"./partials/client.js.hbs":6,"./partials/resources.js.hbs":7,"./partials/utils.js.hbs":8,"./templates/.gitignore.hbs":9,"./templates/INSTALL.md.hbs":10,"./templates/README.md.hbs":11,"./templates/index.js.hbs":12,"./templates/package.json.hbs":13,"camel-case":28,"javascript-stringify":48}],5:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "/**\n * @param {Object} options\n */\nfunction OAuth2 (options) {\n  ClientOAuth2.call(this, extend("
    + ((stack1 = (helpers.stringify || (depth0 && depth0.stringify) || helpers.helperMissing).call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.security : depth0)) != null ? stack1['OAuth 2.0'] : stack1)) != null ? stack1.settings : stack1),{"name":"stringify","hash":{},"data":data})) != null ? stack1 : "")
    + ", options));\n}\n\nOAuth2.prototype = Object.create(ClientOAuth2.prototype);\nOAuth2.prototype.constructor = OAuth2;\nOAuth2.prototype.request = popsicle;\n\nClient.OAuth2 = OAuth2;\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.security : depth0)) != null ? stack1['OAuth 2.0'] : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

},{"hbsfy/runtime":43}],6:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "function Client (options) {\n  this.options = extend({\n    baseUri: "
    + ((stack1 = (helpers.stringify || (depth0 && depth0.stringify) || alias1).call(depth0,(depth0 != null ? depth0.baseUri : depth0),{"name":"stringify","hash":{},"data":data})) != null ? stack1 : "")
    + ",\n    baseUriParameters: "
    + ((stack1 = (helpers.stringify || (depth0 && depth0.stringify) || alias1).call(depth0,(helpers.object || (depth0 && depth0.object) || alias1).call(depth0,(helpers.keys || (depth0 && depth0.keys) || alias1).call(depth0,(depth0 != null ? depth0.baseUriParameters : depth0),{"name":"keys","hash":{},"data":data}),(helpers.pluck || (depth0 && depth0.pluck) || alias1).call(depth0,(depth0 != null ? depth0.baseUriParameters : depth0),"default",{"name":"pluck","hash":{},"data":data}),{"name":"object","hash":{},"data":data}),{"name":"stringify","hash":{},"data":data})) != null ? stack1 : "")
    + "\n  }, options);\n\n  this.resources = new "
    + this.escapeExpression((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.resources : depth0)) != null ? stack1.id : stack1),{"name":"pascalCase","hash":{},"data":data}))
    + "('', this);\n};\n\nClient.prototype.resource = function (route, parameters) {\n  var path = '/' + template(route, parameters).replace(/^\\//, '');\n\n  return new CustomResource(path, this);\n};\n\nClient.prototype.request = popsicle;\nClient.prototype.form = Client.form = popsicle.form;\nClient.prototype.version  = "
    + ((stack1 = (helpers.stringify || (depth0 && depth0.stringify) || alias1).call(depth0,(depth0 != null ? depth0.version : depth0),{"name":"stringify","hash":{},"data":data})) != null ? stack1 : "")
    + ";\n";
},"useData":true});

},{"hbsfy/runtime":43}],7:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "function "
    + this.escapeExpression((helpers.pascalCase || (depth0 && depth0.pascalCase) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.id : depth0),{"name":"pascalCase","hash":{},"data":data}))
    + " (uri, client) {\n  this._uri    = uri;\n  this._client = client;\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "};\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.methods : depth0),{"name":"each","hash":{},"fn":this.program(8, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.uriParameters : depth0),{"name":"unless","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "  this."
    + alias2(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + " = new "
    + alias2((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,(depth0 != null ? depth0.id : depth0),{"name":"pascalCase","hash":{},"data":data}))
    + "(uri + "
    + ((stack1 = (helpers.stringify || (depth0 && depth0.stringify) || alias1).call(depth0,(depth0 != null ? depth0.relativeUri : depth0),{"name":"stringify","hash":{},"data":data})) != null ? stack1 : "")
    + ", client);\n";
},"5":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.uriParameters : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"6":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return alias2((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,(depths[2] != null ? depths[2].id : depths[2]),{"name":"pascalCase","hash":{},"data":data}))
    + ".prototype."
    + alias2(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + " = function (/* ...args */) {\n  var uri = this._uri + template("
    + ((stack1 = (helpers.stringify || (depth0 && depth0.stringify) || alias1).call(depth0,(depth0 != null ? depth0.relativeUri : depth0),{"name":"stringify","hash":{},"data":data})) != null ? stack1 : "")
    + ", arguments, "
    + ((stack1 = (helpers.stringify || (depth0 && depth0.stringify) || alias1).call(depth0,(helpers.pluck || (depth0 && depth0.pluck) || alias1).call(depth0,(depth0 != null ? depth0.uriParameters : depth0),"default",{"name":"pluck","hash":{},"data":data}),{"name":"stringify","hash":{},"data":data})) != null ? stack1 : "")
    + ");\n\n  return new "
    + alias2((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,(depth0 != null ? depth0.id : depth0),{"name":"pascalCase","hash":{},"data":data}))
    + "(uri, this._client);\n};\n";
},"8":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return alias2((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,(depths[1] != null ? depths[1].id : depths[1]),{"name":"pascalCase","hash":{},"data":data}))
    + ".prototype."
    + alias2(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + " = function (body, options) {\n"
    + ((stack1 = helpers['if'].call(depth0,(helpers.keys || (depth0 && depth0.keys) || alias1).call(depth0,(depth0 != null ? depth0.headers : depth0),{"name":"keys","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(9, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  return handleRequest(this._client, this._uri, "
    + ((stack1 = (helpers.stringify || (depth0 && depth0.stringify) || alias1).call(depth0,(helpers.upperCase || (depth0 && depth0.upperCase) || alias1).call(depth0,(depth0 != null ? depth0.method : depth0),{"name":"upperCase","hash":{},"data":data}),{"name":"stringify","hash":{},"data":data})) != null ? stack1 : "")
    + ", body, options);\n};\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "  options = extend({}, options);\n  options.headers = extend("
    + ((stack1 = (helpers.stringify || (depth0 && depth0.stringify) || alias1).call(depth0,(helpers.object || (depth0 && depth0.object) || alias1).call(depth0,(helpers.keys || (depth0 && depth0.keys) || alias1).call(depth0,(depth0 != null ? depth0.headers : depth0),{"name":"keys","hash":{},"data":data}),(helpers.pluck || (depth0 && depth0.pluck) || alias1).call(depth0,(depth0 != null ? depth0.headers : depth0),"default",{"name":"pluck","hash":{},"data":data}),{"name":"object","hash":{},"data":data}),{"name":"stringify","hash":{},"data":data})) != null ? stack1 : "")
    + ", options.headers);\n\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "CustomResource.prototype."
    + this.escapeExpression((helpers.camelCase || (depth0 && depth0.camelCase) || alias1).call(depth0,depth0,{"name":"camelCase","hash":{},"data":data}))
    + " = function (body, options) {\n  return handleRequest(this._client, this._uri, "
    + ((stack1 = (helpers.stringify || (depth0 && depth0.stringify) || alias1).call(depth0,(helpers.upperCase || (depth0 && depth0.upperCase) || alias1).call(depth0,depth0,{"name":"upperCase","hash":{},"data":data}),{"name":"stringify","hash":{},"data":data})) != null ? stack1 : "")
    + ", body, options);\n};\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "function handleRequest (client, path, method, body, options) {\n  options = extend({}, client.options, options);\n\n  var baseUri = template(options.baseUri, options.baseUriParameters);\n  var hasBody = method !== 'GET' && method !== 'HEAD';\n  var reqOpts = {};\n\n  var reqBody = hasBody && body != null ? body : options.body;\n  var reqQuery = !hasBody && body != null ? body : options.query;\n\n  var reqOpts = extend(options, {\n    url: baseUri.replace(/\\/$/, '') + path,\n    method: method,\n    headers: extend({}, options.headers),\n    body: reqBody,\n    query: typeof reqQuery === 'object' ? extend({}, reqQuery) : reqQuery\n  });\n\n  if (options.user && typeof options.user.sign === 'function') {\n    options.user.sign(reqOpts);\n  }\n\n  return client.request(reqOpts);\n}\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.allResources : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\nfunction CustomResource (uri, client) {\n  this._uri    = uri;\n  this._client = client;\n}\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.supportedMethods : depth0),{"name":"each","hash":{},"fn":this.program(11, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});

},{"hbsfy/runtime":43}],8:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "var TEMPLATE_REGEXP = /\\{([^\\{\\}]+)\\}/g;\n\n/**\n * @param  {String} string\n * @param  {Object} interpolate\n * @param  {Object} defaults\n * @return {String}\n */\nfunction template (string, interpolate, defaults) {\n  defaults    = defaults || {};\n  interpolate = interpolate || {};\n\n  return string.replace(TEMPLATE_REGEXP, function (match, key) {\n    if (interpolate[key] != null) {\n      return encodeURIComponent(interpolate[key]);\n    }\n\n    if (defaults[key] != null) {\n      return encodeURIComponent(defaults[key]);\n    }\n\n    return '';\n  });\n}\n\n/**\n * @param  {Object} dest\n * @param  {Object} ...source\n * @return {Object}\n */\nfunction extend (dest /*, ...source */) {\n  for (var i = 1; i < arguments.length; i++) {\n    for (var key in arguments[i]) {\n      dest[key] = arguments[i][key];\n    }\n  }\n\n  return dest;\n}\n";
},"useData":true});

},{"hbsfy/runtime":43}],9:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "node_modules\n";
},"useData":true});

},{"hbsfy/runtime":43}],10:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "# Installation\n\nFollow these instructions to publish and subsequently install the module in your project.\n\n## Git\n\n```\n# Initialize with git\ngit init\ngit add .\ngit commit -m \"initial commit\"\ngit push [git-url]\n\n# Install in project from git\nnpm install [git-url] --save\n```\n\n## Source Directory\n\n```\n# Link module globally\nnpm link\n\n# Link in project to local module\nnpm link "
    + alias2((helpers.paramCase || (depth0 && depth0.paramCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"paramCase","hash":{},"data":data}))
    + "\n```\n\n**Note:** You should publish it before you use it publicly.\n\n## NPM\n\n```\n# Publish to npm\nnpm publish\n\n# Install from npm\nnpm install "
    + alias2((helpers.paramCase || (depth0 && depth0.paramCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"paramCase","hash":{},"data":data}))
    + " --save\n```\n\n## Bower\n\n```\n# Register with bower\nbower register "
    + alias2((helpers.paramCase || (depth0 && depth0.paramCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"paramCase","hash":{},"data":data}))
    + " [git-url]\n\n# Install from bower\nbower install "
    + alias2((helpers.paramCase || (depth0 && depth0.paramCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"paramCase","hash":{},"data":data}))
    + " --save\n```\n";
},"useData":true});

},{"hbsfy/runtime":43}],11:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "### Authentication\n\n#### OAuth 2.0\n\nThis API supports authentication with [OAuth 2.0](https://github.com/mulesoft/js-client-oauth2). Initialize the `OAuth2` instance with the application client id, client secret and a redirect uri to authenticate with users.\n\n```js\nvar auth = new "
    + alias2((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"pascalCase","hash":{},"data":data}))
    + ".OAuth2({\n  clientId:     '123',\n  clientSecret: 'abc',\n  redirectUri:  'http://example.com/auth/callback'\n});\n```\n\n**All `getToken()` calls are asynchronous and return promise objects which resolve to an access token instance.**\n\n"
    + ((stack1 = helpers['if'].call(depth0,(helpers.contains || (depth0 && depth0.contains) || alias1).call(depth0,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.security : depth0)) != null ? stack1['OAuth 2.0'] : stack1)) != null ? stack1.settings : stack1)) != null ? stack1.authorizationGrants : stack1),"code",{"name":"contains","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(helpers.contains || (depth0 && depth0.contains) || alias1).call(depth0,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.security : depth0)) != null ? stack1['OAuth 2.0'] : stack1)) != null ? stack1.settings : stack1)) != null ? stack1.authorizationGrants : stack1),"token",{"name":"contains","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(helpers.contains || (depth0 && depth0.contains) || alias1).call(depth0,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.security : depth0)) != null ? stack1['OAuth 2.0'] : stack1)) != null ? stack1.settings : stack1)) != null ? stack1.authorizationGrants : stack1),"owner",{"name":"contains","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(helpers.contains || (depth0 && depth0.contains) || alias1).call(depth0,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.security : depth0)) != null ? stack1['OAuth 2.0'] : stack1)) != null ? stack1.settings : stack1)) != null ? stack1.authorizationGrants : stack1),"credentials",{"name":"contains","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "##### Access Tokens\n\nAccess token instances can be manually re-created. This is critical for access token reuse, such as saving credentials to a database for reusing later in the codebase.\n\n```js\nvar token = auth.createToken('access token', 'refresh token');\n```\n\nAn access token instance (manually created or automatically generated by a `getToken()` method) can be passed into any API request. This will sign the API request with the current users access token credentials.\n\n```js\n// Existing API client instance.\nclient.resource('/').get(null, {\n  user: token\n});\n\n// New API client instance.\nvar client = new "
    + alias2((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"pascalCase","hash":{},"data":data}))
    + "({\n  user: token\n});\n```\n\n";
},"2":function(depth0,helpers,partials,data) {
    return "##### [Authorization Code Grant](https://github.com/mulesoft/js-client-oauth2#authorization-code-grant)\n\n1. Redirect user to `auth.code.getUri()`.\n2. Parse response uri and get an access token instance using `auth.code.getToken(uri)`.\n\n";
},"4":function(depth0,helpers,partials,data) {
    return "\n##### [Implicit Grant](https://github.com/mulesoft/js-client-oauth2#implicit-grant)\n\n1. Redirect user to `auth.token.getUri()` in a browser.\n2. Parse response uri and get an access token instance using `auth.token.getToken(uri)`.\n\n";
},"6":function(depth0,helpers,partials,data) {
    return "\n##### [Resource Owner Password Credentials Grant](https://github.com/mulesoft/js-client-oauth2#resource-owner-password-credentials-grant)\n\n1. Make a direct request for the access token on behalf of the user using `auth.owner.getToken(username, password)`.\n\n";
},"8":function(depth0,helpers,partials,data) {
    return "\n##### [Client Credentials Grant](https://github.com/mulesoft/js-client-oauth2#client-credentials-grant)\n\n1. Get the access token for the application by using `auth.credentials.getToken()`.\n\n";
},"10":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.version || (depth0 != null ? depth0.version : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"version","hash":{},"data":data}) : helper)));
},"12":function(depth0,helpers,partials,data) {
    return "v3";
},"14":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(helpers.keys || (depth0 && depth0.keys) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.methods : depth0),{"name":"keys","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(15, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"15":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "#### "
    + ((stack1 = (helpers.requestSnippet || (depth0 && depth0.requestSnippet) || alias1).call(depth0,depth0,{"name":"requestSnippet","hash":{},"data":data})) != null ? stack1 : "")
    + "\n\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.uriParameters : depth0),{"name":"if","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":this.program(18, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "```js\nvar resource = client."
    + ((stack1 = (helpers.requestSnippet || (depth0 && depth0.requestSnippet) || alias1).call(depth0,depth0,{"name":"requestSnippet","hash":{},"data":data})) != null ? stack1 : "")
    + ";\n```\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.methods : depth0),{"name":"each","hash":{},"fn":this.program(20, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"16":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.parametersSnippet || (depth0 && depth0.parametersSnippet) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.uriParameters : depth0),{"name":"parametersSnippet","hash":{},"data":data})) != null ? stack1 : "")
    + "\n\n";
},"18":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n\n";
},"20":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "##### "
    + alias2((helpers.upperCase || (depth0 && depth0.upperCase) || alias1).call(depth0,(depth0 != null ? depth0.method : depth0),{"name":"upperCase","hash":{},"data":data}))
    + "\n\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":this.program(18, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "```js\nresource."
    + alias2(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + "().then(function (res) { ... });\n```\n\n"
    + ((stack1 = helpers['if'].call(depth0,(helpers.keys || (depth0 && depth0.keys) || alias1).call(depth0,(depth0 != null ? depth0.queryParameters : depth0),{"name":"keys","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(21, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(helpers.keys || (depth0 && depth0.keys) || alias1).call(depth0,(depth0 != null ? depth0.headers : depth0),{"name":"keys","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(26, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(helpers.keys || (depth0 && depth0.keys) || alias1).call(depth0,(depth0 != null ? depth0.body : depth0),{"name":"keys","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(28, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"21":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "##### Query Parameters\n\n```javascript\n"
    + ((stack1 = helpers['if'].call(depth0,(helpers.equal || (depth0 && depth0.equal) || alias1).call(depth0,(depth0 != null ? depth0.method : depth0),"get",{"name":"equal","hash":{},"data":data}),{"name":"if","hash":{},"fn":this.program(22, data, 0),"inverse":this.program(24, data, 0),"data":data})) != null ? stack1 : "")
    + "```\n\n"
    + ((stack1 = (helpers.parametersSnippet || (depth0 && depth0.parametersSnippet) || alias1).call(depth0,(depth0 != null ? depth0.queryParameters : depth0),{"name":"parametersSnippet","hash":{},"data":data})) != null ? stack1 : "")
    + "\n\n";
},"22":function(depth0,helpers,partials,data) {
    var helper;

  return "resource."
    + this.escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + "({ ... });\n";
},"24":function(depth0,helpers,partials,data) {
    var helper;

  return "resource."
    + this.escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + "(null, { query: { ... } });\n";
},"26":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing;

  return "##### Headers\n\n```javascript\nresource."
    + this.escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + "(null, {\n  headers: { ... }\n});\n```\n\n"
    + ((stack1 = (helpers.parametersSnippet || (depth0 && depth0.parametersSnippet) || alias1).call(depth0,(depth0 != null ? depth0.headers : depth0),{"name":"parametersSnippet","hash":{},"data":data})) != null ? stack1 : "")
    + "\n\n";
},"28":function(depth0,helpers,partials,data) {
    var stack1;

  return "##### Body\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.body : depth0),{"name":"each","hash":{},"fn":this.program(29, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"29":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "**"
    + this.escapeExpression(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + "**\n\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.schema : depth0),{"name":"if","hash":{},"fn":this.program(30, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.formParameters : depth0),{"name":"if","hash":{},"fn":this.program(32, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"30":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "```\n"
    + ((stack1 = ((helper = (helper = helpers.schema || (depth0 != null ? depth0.schema : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"schema","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n```\n\n";
},"32":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.json || (depth0 && depth0.json) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.formParameters : depth0),2,{"name":"json","hash":{},"data":data})) != null ? stack1 : "")
    + "\n\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "# "
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n\nBrowser and node module for making API requests against ["
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "]("
    + alias3(((helper = (helper = helpers.baseUri || (depth0 != null ? depth0.baseUri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"baseUri","hash":{},"data":data}) : helper)))
    + ").\n\n**Please note: This module uses [Popsicle](https://github.com/blakeembrey/popsicle) to make API requests. Promises must be supported or polyfilled on all target environments.**\n\n## Installation\n\n```\nnpm install "
    + alias3((helpers.paramCase || (depth0 && depth0.paramCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"paramCase","hash":{},"data":data}))
    + " --save\nbower install "
    + alias3((helpers.paramCase || (depth0 && depth0.paramCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"paramCase","hash":{},"data":data}))
    + " --save\n```\n\n## Usage\n\n### Node\n\n```javascript\nvar "
    + alias3((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"pascalCase","hash":{},"data":data}))
    + " = require('"
    + alias3((helpers.paramCase || (depth0 && depth0.paramCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"paramCase","hash":{},"data":data}))
    + "');\n\nvar client = new "
    + alias3((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"pascalCase","hash":{},"data":data}))
    + "();\n```\n\n### Browsers\n\n```html\n<script src=\""
    + alias3((helpers.paramCase || (depth0 && depth0.paramCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"paramCase","hash":{},"data":data}))
    + "/index.js\">\n\n<script>\n  var client = new window."
    + alias3((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"pascalCase","hash":{},"data":data}))
    + "();\n</script>\n```\n\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.security : depth0)) != null ? stack1['OAuth 2.0'] : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "### Options\n\nYou can set options when you initialize a client or at any time with the `options` property. You may also override options for a single request by passing an object as the second argument of any request method. For example:\n\n```javascript\nvar client = new "
    + alias3((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"pascalCase","hash":{},"data":data}))
    + "({ ... });\n\nclient.options = { ... };\n\nclient.resource('/').get(null, {\n  baseUri: 'http://example.com',\n  headers: {\n    'Content-Type': 'application/json'\n  }\n});\n```\n\n#### Base URI\n\nYou can override the base URI by setting the `baseUri` property, or initializing a client with a base URI. For example:\n\n```javascript\nnew "
    + alias3((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"pascalCase","hash":{},"data":data}))
    + "({\n  baseUri: 'https://example.com'\n});\n```\n\n#### Base URI Parameters\n\nIf the base URI has parameters inline, you can set them by updating the `baseUriParameters` property. For example:\n\n```javascript\nclient.options.baseUriParameters.version = '"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.version : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.program(12, data, 0),"data":data})) != null ? stack1 : "")
    + "';\n```\n\n### Resources\n\nAll methods return a HTTP request instance of [Popsicle](https://github.com/blakeembrey/popsicle), which allows the use of promises (and streaming in node).\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.allResources : depth0),{"name":"each","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n\n### Custom Resources\n\nYou can make requests to a custom path in the API using the `#resource(path)` method.\n\n```javascript\nclient.resource('/example/path').get();\n```\n\n## License\n\nApache 2.0\n";
},"useData":true});

},{"hbsfy/runtime":43}],12:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = this.invokePartial(partials.utils,depth0,{"name":"utils","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = this.invokePartial(partials.resources,depth0,{"name":"resources","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = this.invokePartial(partials.client,depth0,{"name":"client","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = this.invokePartial(partials.auth,depth0,{"name":"auth","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "\nreturn Client;\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "(function (root, client) {\n  if (typeof define === 'function' && define.amd) {\n    // AMD. Register as an anonymous module.\n    define("
    + ((stack1 = (helpers.dependencies || (depth0 && depth0.dependencies) || alias1).call(depth0,depth0,"amd",{"name":"dependencies","hash":{},"data":data})) != null ? stack1 : "")
    + ", client);\n  } else if (typeof exports === 'object') {\n    // Node. Does not work with strict CommonJS, but only CommonJS-like\n    // environments that support `module.exports`, like Node.\n    module.exports = client("
    + ((stack1 = (helpers.dependencies || (depth0 && depth0.dependencies) || alias1).call(depth0,depth0,"node",{"name":"dependencies","hash":{},"data":data})) != null ? stack1 : "")
    + ");\n  } else {\n    // Browser globals (root is window).\n    root."
    + this.escapeExpression((helpers.pascalCase || (depth0 && depth0.pascalCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"pascalCase","hash":{},"data":data}))
    + " = client("
    + ((stack1 = (helpers.dependencies || (depth0 && depth0.dependencies) || alias1).call(depth0,depth0,"browser",{"name":"dependencies","hash":{},"data":data})) != null ? stack1 : "")
    + ");\n  }\n})(this, function ("
    + ((stack1 = (helpers.dependencies || (depth0 && depth0.dependencies) || alias1).call(depth0,depth0,false,{"name":"dependencies","hash":{},"data":data})) != null ? stack1 : "")
    + ") {\n"
    + ((stack1 = (helpers.indent || (depth0 && depth0.indent) || alias1).call(depth0,2,{"name":"indent","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "});\n";
},"usePartial":true,"useData":true});

},{"hbsfy/runtime":43}],13:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data) {
    return "\"client-oauth2\": \"^0.2.4\",\n    ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "{\n  \"name\": \""
    + alias2((helpers.paramCase || (depth0 && depth0.paramCase) || alias1).call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"paramCase","hash":{},"data":data}))
    + "\",\n  \"version\": \"0.0.0\",\n  \"description\": \""
    + alias2(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "\",\n  \"main\": \"index.js\",\n  \"files\": [\n    \"index.js\"\n  ],\n  \"repository\": {\n    \"type\": \"git\",\n    \"url\": \"git://github.com/mulesoft/raml-client-generator.git\"\n  },\n  \"keywords\": [\n    \"raml-api\"\n  ],\n  \"author\": \"MuleSoft, Inc.\",\n  \"license\": \"Apache 2.0\",\n  \"bugs\": {\n    \"url\": \"https://github.com/mulesoft/raml-client-generator/issues\"\n  },\n  \"homepage\": \"https://github.com/mulesoft/raml-client-generator\",\n  \"dependencies\": {\n    "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.security : depth0)) != null ? stack1['OAuth 2.0'] : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\"popsicle\": \"^0.5.6\"\n  }\n}\n";
},"useData":true});

},{"hbsfy/runtime":43}],14:[function(require,module,exports){
/**
 * Sanitize all documentation.
 *
 * @param  {Object} documentation
 * @return {Array}
 */
module.exports = function (documentation) {
  return Array.isArray(documentation) ? documentation.slice() : undefined
};
},{}],15:[function(require,module,exports){
var extend                = require('extend');
var sanitizeUri           = require('./uri');
var sanitizeSecurity      = require('./security');
var sanitizeResources     = require('./resources');
var sanitizeParameters    = require('./parameters');
var sanitizeDocumentation = require('./documentation');

/**
 * Track indexes of each generated id.
 *
 * @type {Object}
 */
var PARAM_IDS;

/**
 * Default formatting options.
 *
 * @type {Object}
 */
var DEFAULT_FORMAT = {
  /**
   * Replace with your preferred uri templating language.
   *
   * @param  {String} uri
   * @return {String}
   */
  uri: function (uri) {
    return uri;
  },
  /**
   * Variable formatting support. By default, we'll just throw an error.
   */
  variable: function () {
    throw new Error('No variable format specified');
  },
  /**
   * Generate unique ids each spec iteration.
   */
  uniqueId: function (prefix) {
    var id = ++PARAM_IDS[prefix] || (PARAM_IDS[prefix] = 0);

    return prefix + id;
  }
};

/**
 * Validate (and sanitize) the passed in spec object.
 *
 * @param  {Obejct} spec
 * @return {Obejct}
 */
var validateSpec = function (spec) {
  // Reset the id generations.
  PARAM_IDS = {};

  spec.format = extend({}, DEFAULT_FORMAT, spec.format);

  return extend({}, spec);
};

/**
 * Flatten the resources object tree into an array.
 *
 * @param  {Object} resources
 * @return {Array}
 */
var flattenResources = function (resources) {
  var array = [];

  // Recursively push all resources into a single flattened array.
  (function recurse (resource) {
    array.push(resource);

    Object.keys(resource.children).forEach(function (key) {
      recurse(resource.children[key]);
    });
  })(resources);

  return array;
};

/**
 * Flatten the resources object into an array of methods.
 *
 * @param  {Object} resources
 * @return {Array}
 */
var flattenMethods = function (resources) {
  var array = [];

  // Recursively push all methods into a single flattened array.
  (function recurse (resource) {
    if (resource.methods) {
      Object.keys(resource.methods).forEach(function (key) {
        array.push(resource.methods[key]);
      });
    }

    Object.keys(resource.children).forEach(function (key) {
      recurse(resource.children[key]);
    });
  })(resources);

  return array;
};

/**
 * Create a context object for the templates to use during compilation.
 *
 * @param  {Object} ast
 * @param  {Object} spec
 * @return {Object}
 */
module.exports = function (ast, spec) {
  // Validate the spec before using.
  spec = validateSpec(spec);

  // Create an empty context object.
  var context = {
    id:                spec.format.uniqueId('client'),
    title:             ast.title || 'API Client',
    version:           ast.version,
    baseUri:           sanitizeUri(ast.baseUri, spec),
    security:          sanitizeSecurity(ast.securitySchemes, spec),
    resources:         sanitizeResources(ast.resources, spec),
    baseUriParameters: sanitizeParameters(ast.baseUriParameters, spec),
    documentation:     sanitizeDocumentation(ast.documentation)
  };

  context.allMethods       = flattenMethods(context.resources);
  context.allResources     = flattenResources(context.resources);
  context.supportedMethods = require('methods');

  return context;
};

},{"./documentation":14,"./parameters":17,"./resources":18,"./security":19,"./uri":20,"extend":34,"methods":50}],16:[function(require,module,exports){
var pick               = require('object.pick');
var sanitizeParameters = require('./parameters');

/**
 * Sanitize a method into a flatter, more readable structure.
 *
 * @param  {Object} method
 * @param  {Object} resource
 * @param  {Object} spec
 * @return {Object}
 */
var sanitizeMethod = function (method, resource, spec) {
  // Pick only the usable properties.
  var obj = pick(method, [
    'method',
    'protocols',
    'responses',
    'body',
    'headers'
  ]);

  // Attach a unique id to every method.
  obj.id              = spec.format.uniqueId('method');
  obj.resource        = resource;
  obj.queryParameters = sanitizeParameters(method.queryParameters);
  obj.description     = (method.description || '').trim();

  // TODO: Add `securedBy` support.
  // TODO: Automatically infer content-type header from body.

  return obj;
};

/**
 * Sanitize a methods array into a more reusable object.
 *
 * @param  {Array}  methods
 * @param  {Object} resource
 * @param  {Object} spec
 * @return {Object}
 */
module.exports = function (methods, resource, spec) {
  var obj = {};

  if (!methods) {
    return obj;
  }

  methods.forEach(function (method) {
    var key             = spec.format.variable(method.method);
    var sanitizedMethod = sanitizeMethod(method, resource, spec);

    obj[key] = sanitizedMethod;
    sanitizedMethod.key = key;
  });

  return obj;
};

},{"./parameters":17,"object.pick":51}],17:[function(require,module,exports){
var pick = require('object.pick');

/**
 * Sanitize the parameter into a more reusable object.
 *
 * @param  {Object} parameter
 * @return {Object}
 */
var sanitizeParameter = function (parameter) {
  var obj = pick(parameter, [
    'displayName',
    'type',
    'enum',
    'pattern',
    'minLength',
    'maxLength',
    'minimum',
    'maximum',
    'example',
    'repeat',
    'required',
    'default'
  ]);

  obj.description = (parameter.description || '').trim();

  // Automatically set the default parameter from the enum value.
  if (obj.default == null && Array.isArray(obj.enum)) {
    obj.default = obj.enum[0];
  }

  return obj;
};

/**
 * Sanitize parameters into something more consumable.
 *
 * @param  {Object} parameters
 * @return {Object}
 */
module.exports = function (parameters) {
  var obj = {};

  if (!parameters) {
    return obj;
  }

  // Iterate over every parameter and generate a new parameters object.
  Object.keys(parameters).forEach(function (key) {
    obj[key] = sanitizeParameter(parameters[key]);
  });

  return obj;
};

},{"object.pick":51}],18:[function(require,module,exports){
var sanitizeUri        = require('./uri');
var sanitizeMethods    = require('./methods');
var sanitizeParameters = require('./parameters');

/**
 * Match template tags in a string.
 *
 * @type {RegExp}
 */
var TEMPLATE_REGEXP = /\{[^\{\}]+\}/g;

/**
 * Convert a URI parameter into a variable name.
 *
 * @param  {String} uri
 * @param  {Object} spec
 * @return {String}
 */
var toPropertyFormat = function (uri, spec) {
  // Replace the prefixed path segment.
  uri = uri.replace(/^[\.\/]/, '');

  // Handle a only a single parameter. E.g. "/{param}".
  if (/^\{[^\{\}]+\}$/.test(uri)) {
    return spec.format.variable(uri.slice(1, -1));
  }

  // Handle static text with trailing parameters. E.g. "/string{id}".
  if (/^[^\{\}]+(?:\{[^\{\}]+\})*$/.test(uri)) {
    return spec.format.variable(uri.replace(/\{.+\}$/, ''));
  }
};

/**
 * Convert the uri to the language replacement format.
 *
 * @param  {String} uri
 * @param  {Object} spec
 * @return {String}
 */
var toUriFormat = function (uri, spec) {
  var index = 0;

  // Index the template parameters instead of having unique names. This
  // saves a minor amount of space and makes processing *a lot* easier.
  var indexedUri = uri.replace(/\{[^\{\}]+\}/g, function () {
    return '{' + (index++) + '}';
  });

  return sanitizeUri(indexedUri, spec);
};

/**
 * Attach the current resource to the object structure.
 *
 * @param {Object} obj
 * @param {Object} resource
 * @param {Object} spec
 */
var attachResource = function (obj, resource, spec) {
  // Split the relative uri into the valid parts. This includes special-case
  // handling for the `mediaTypeExtension` parameter according to the spec.
  var uriParts = resource.relativeUri.split(
    /(?=\.|\/|\{mediaTypeExtension\}$)/
  );

  // Sanitize the uri parameters before extracting.
  var parameters = sanitizeParameters(resource.uriParameters);

  /**
   * Return the parameter from the parameters object based on the passed in tag.
   *
   * @param  {String} param
   * @return {Object}
   */
  var getParamTag = function (param) {
    return parameters[param.slice(1, -1)];
  };

  // Iterate over each of the uri parts and nest on the root object.
  (function recurse (obj, parts) {
    var part = parts[0];

    // Add a period to the beginning of the manual media type extension.
    if (part === '{mediaTypeExtension}' && parts.length === 1) {
      if (Array.isArray(parameters.mediaTypeExtension.enum)) {
        parameters.mediaTypeExtension.enum.forEach(function (extension) {
          extension = '.' + extension.replace(/^\./, '');

          return recurse(obj, [extension]);
        });
      }

      // Remove the media type enum from documentation purposes.
      delete parameters.mediaTypeExtension.enum;

      part = '.{mediaTypeExtension}';
    }

    // Recursively create (or select) the child resource. If the resource is
    // a single slash, it should be attached to the same object.
    if (part !== '/') {
      // Convert the uri part into a variable name.
      var key = toPropertyFormat(part, spec);

      // TODO: Handle duplicate variable names and missing variable names.
      if (!key || obj.children.hasOwnProperty(key)) {
        // Handle exact matching relative uris. If they don't match exactly,
        // it's impossible for us to handle generically.
        if (part === obj.children[key].relativeUri) {
          obj = obj.children[key];
        } else {
          return;
        }
      } else {
        var matches       = part.match(TEMPLATE_REGEXP) || [];
        var uriParameters = Array.prototype.map.call(matches, getParamTag);

        obj = obj.children[key] = {
          id:            spec.format.uniqueId('resource'),
          key:           key,
          parent:        obj,
          children:      {},
          relativeUri:   toUriFormat(part, spec),
          uriParameters: uriParameters
        };
      }
    }

    // Recursively append uri parts.
    if (parts.length > 1) {
      return recurse(obj, parts.slice(1));
    }

    obj.methods     = sanitizeMethods(resource.methods, obj, spec);
    obj.description = (resource.description || '').trim();

    if (resource.resources) {
      resource.resources.forEach(function (resource) {
        attachResource(obj, resource, spec);
      });
    }

    // TODO: Implement node backtracking when no methods are available.

    return obj;
  })(obj, uriParts);
};

/**
 * Sanitize resources into nested object form.
 *
 * @param  {Object} resources
 * @param  {Object} spec
 * @return {Object}
 */
module.exports = function (resources, spec) {
  // Create the root resource object for consistency of behaviour.
  var obj = {
    id:            spec.format.uniqueId('resource'),
    children:      {},
    relativeUri:   '',
    uriParameters: []
  };

  if (!resources) {
    return obj;
  }

  // Iterate over the resources array and attach each .
  resources.forEach(function (resource) {
    return attachResource(obj, resource, spec);
  });

  return obj;
};

},{"./methods":16,"./parameters":17,"./uri":20}],19:[function(require,module,exports){
/**
 * Sanitize resources into nested object form.
 *
 * @param  {Object} securitySchemes
 * @return {Object}
 */
module.exports = function (securitySchemes) {
  var obj = {};

  if (!Array.isArray(securitySchemes)) {
    return obj;
  }

  securitySchemes.forEach(function (schemes) {
    Object.keys(schemes).forEach(function (key) {
      var scheme = schemes[key];

      obj[scheme.type] = scheme;
    });
  });

  return obj;
};

},{}],20:[function(require,module,exports){
/**
 * Sanitize all uris.
 *
 * @param  {String} uri
 * @param  {Object} spec
 * @return {String}
 */
module.exports = function (uri, spec) {
  return spec.format.uri(uri || '').replace(/\/+$/, '');
};

},{}],21:[function(require,module,exports){
var extend        = require('extend');
var helpers       = require('./helpers');
var createContext = require('./context');

// Handlebars required in node to support `require('x.hbs')`.
require('handlebars');

/**
 * Compile an api client using a combination of the ast, spec and user data.
 *
 * @param  {Object} ast
 * @param  {Object} spec
 * @param  {Object} data
 * @return {Object}
 */
function generate (ast, spec, data) {
  // Handlebars compile options from the specification.
  var options = {
    data:     data,
    helpers:  extend({}, helpers, spec.helpers),
    partials: extend({}, spec.partials)
  };

  // Allow the language to override the file generator.
  var createFiles = spec.files || generateFiles;
  var context = createContext(ast, spec);
  var files = createFiles(spec.templates, context, options);

  // Create the compile object. We resolve this object instead of just the
  // files so that external utilities have access to the context object. For
  // example, the "API Notebook" project needs to add runtime documentation.
  return {
    files: files,
    context: context,
    options: options
  };
}

/**
 * Default file generator directly from templates.
 *
 * @param  {Object} templates
 * @param  {Object} context
 * @param  {Object} options
 * @return {Object}
 */
function generateFiles (templates, context, options) {
  var files = {};

  Object.keys(templates).forEach(function (key) {
    files[key] = templates[key](context, options);
  });

  return files;
}

/**
 * Generate a language specific client generator based on passed in spec.
 *
 * @param  {Object}   spec
 * @return {Function}
 */
module.exports = function (spec) {
  /**
   * Generate an API client by passed in an AST.
   *
   * @param  {Object} ast
   * @param  {Object} options
   * @return {Object}
   */
  return function (ast, options) {
    return generate(ast, spec, options);
  };
};

},{"./context":15,"./helpers":22,"extend":34,"handlebars":23}],22:[function(require,module,exports){
var indent = require('indent-string');
var trim   = String.prototype.trim;
var hasOwn = Object.prototype.hasOwnProperty;

/**
 * Case sanitization support.
 */
exports.camelCase    = require('camel-case');
exports.pascalCase   = require('pascal-case');
exports.constantCase = require('constant-case');
exports.paramCase    = require('param-case');
exports.lowerCase    = require('lower-case');
exports.upperCase    = require('upper-case');
exports.snakeCase    = require('snake-case');

/**
 * Formatting utilities.
 */
exports.indent = function (/* input, count, character, opts */) {
  var args      = Array.prototype.slice.call(arguments);
  var opts      = args.pop();
  var input     = (opts.fn ? opts.fn(this) : args[0]);
  var count     = (opts.fn ? args[0] : args[1]) || 2;
  var character = (opts.fn ? args[1] : args[2]) || ' ';

  return indent(input, character, count);
};

/**
 * The `||` conditional as a helper.
 *
 * @return {Boolean}
 */
exports.or = function (/* ...condition, opts */) {
  for (var i = 0; i < arguments.length - 1; i++) {
    if (arguments[i]) {
      return true;
    }
  }

  return false;
};

/**
 * The `&&` conditional as a helper.
 *
 * @return {Boolean}
 */
exports.and = function (/* ...condition, opts */) {
  for (var i = 0; i < arguments.length - 1; i++) {
    if (!arguments[i]) {
      return false;
    }
  }

  return true;
};

/**
 * The `!` conditional as a helper.
 *
 * @return {Boolean}
 */
exports.not = function (condition) {
  return !condition;
};

/**
 * Get the keys of an object.
 */
exports.keys = function (obj) {
  var keys = [];

  for (var prop in obj) {
    if (hasOwn.call(obj, prop)) {
      keys.push(prop);
    }
  }

  return keys;
};

/**
 * Return all the nested by the name.
 *
 * @param  {Object} obj
 * @param  {String} name
 * @return {Array}
 */
exports.pluck = function (obj, name) {
  return Object.keys(obj).map(function (key) {
    return obj[key] && obj[key][name];
  });
};

/**
 * Turn an array of keys into an object.
 *
 * @param  {Array}  keys
 * @param  {Array}  values
 * @return {Object}
 */
exports.object = function (keys, values) {
  var obj = {};

  for (var i = 0; i < keys.length; i++) {
    obj[keys[i]] = values[i];
  }

  return obj;
};

/**
 * Check whether a value is contained within an array.
 *
 * @param  {Array}   array
 * @param  {*}       value
 * @return {Boolean}
 */
exports.contains = function (array, value) {
  return array.indexOf(value) > -1;
};

/**
 * Debugging.
 */
exports.log = function () {
  var opts = arguments[arguments.length - 1];

  if (opts.fn) {
    console.log(opts.fn(this));
  } else {
    console.log.apply(console, Array.prototype.slice.call(arguments, 0, -1));
  }
};

/**
 * Trim a string.
 *
 * @return {String}
 */
exports.trim = function () {
  var opts = arguments[arguments.length - 1];

  if (arguments.length > 1) {
    return trim.call(arguments[0] == null ? '' : arguments[0]);
  }

  return trim.call(opts.fn(this));
};

/**
 * Check that a number of arguments are equal.
 *
 * @return {Boolean}
 */
exports.equal = function () {
  var args = Array.prototype.slice.call(arguments, 0, -1);
  var opts = arguments[arguments.length - 1];

  for (var i = 1; i < args.length; i++) {
    if (args[i - 1] !== args[i]) {
      return opts.fn ? opts.inverse(this) : false;
    }
  }

  return opts.fn ? opts.fn(this) : true;
};

/**
 * Serialize as a JSON string.
 *
 * @return {String}
 */
exports.json = function () {
  if (arguments.length > 2) {
    return JSON.stringify(arguments[0], null, arguments[1]);
  }

  if (arguments.length === 2) {
    return JSON.stringify(arguments[0]);
  }

  throw new Error('Unsupported usage of json helper');
};

/**
 * Join an array of values together.
 *
 * @param  {Array}  array
 * @param  {String} value
 * @return {String}
 */
exports.join = function (array, value) {
  return Array.isArray(array) ? array.join(value) : array;
};

},{"camel-case":28,"constant-case":33,"indent-string":44,"lower-case":49,"param-case":56,"pascal-case":58,"snake-case":63,"upper-case":64}],23:[function(require,module,exports){

},{}],24:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var kMaxLength = 0x3fffffff
var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  this.length = 0
  this.parent = undefined

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined' && object.buffer instanceof ArrayBuffer) {
    return fromTypedArray(that, object)
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = String(string)

  if (string.length === 0) return 0

  switch (encoding || 'utf8') {
    case 'ascii':
    case 'binary':
    case 'raw':
      return string.length
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return string.length * 2
    case 'hex':
      return string.length >>> 1
    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(string).length
    case 'base64':
      return base64ToBytes(string).length
    default:
      return string.length
  }
}
Buffer.byteLength = byteLength

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function toString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z\-]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []
  var i = 0

  for (; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (leadSurrogate) {
        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          leadSurrogate = codePoint
          continue
        } else {
          // valid surrogate pair
          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
          leadSurrogate = null
        }
      } else {
        // no lead yet

        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else {
          // valid lead
          leadSurrogate = codePoint
          continue
        }
      }
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      leadSurrogate = null
    }

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x200000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":25,"ieee754":26,"is-array":27}],25:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],26:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],27:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],28:[function(require,module,exports){
var upperCase = require('upper-case')
var sentenceCase = require('sentence-case')

/**
 * Camel case a string.
 *
 * @param  {String} string
 * @param  {String} [locale]
 * @return {String}
 */
module.exports = function (string, locale) {
  return sentenceCase(string, locale)
    // Replace periods between numeric entities with an underscore.
    .replace(/(\d) (?=\d)/g, '$1_')
    // Replace spaces between words with an upper cased character.
    .replace(/ (.)/g, function (m, $1) {
      return upperCase($1, locale)
    })
}

},{"sentence-case":29,"upper-case":64}],29:[function(require,module,exports){
var lowerCase = require('lower-case')

var NON_WORD_REGEXP = require('./vendor/non-word-regexp')
var CAMEL_CASE_REGEXP = require('./vendor/camel-case-regexp')
var TRAILING_DIGIT_REGEXP = require('./vendor/trailing-digit-regexp')

/**
 * Sentence case a string.
 *
 * @param  {String} str
 * @param  {String} locale
 * @param  {String} replacement
 * @return {String}
 */
module.exports = function (str, locale, replacement) {
  if (str == null) {
    return ''
  }

  replacement = replacement || ' '

  function replace (match, index, string) {
    if (index === 0 || index === (string.length - match.length)) {
      return ''
    }

    return replacement
  }

  str = String(str)
    // Support camel case ("camelCase" -> "camel Case").
    .replace(CAMEL_CASE_REGEXP, '$1 $2')
    // Support digit groups ("test2012" -> "test 2012").
    .replace(TRAILING_DIGIT_REGEXP, '$1 $2')
    // Remove all non-word characters and replace with a single space.
    .replace(NON_WORD_REGEXP, replace)

  // Lower case the entire string.
  return lowerCase(str, locale)
}

},{"./vendor/camel-case-regexp":30,"./vendor/non-word-regexp":31,"./vendor/trailing-digit-regexp":32,"lower-case":49}],30:[function(require,module,exports){
module.exports = /([\u0061-\u007A\u00B5\u00DF-\u00F6\u00F8-\u00FF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])([\u0041-\u005A\u00C0-\u00D6\u00D8-\u00DE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g

},{}],31:[function(require,module,exports){
module.exports = /[^\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g

},{}],32:[function(require,module,exports){
module.exports = /([\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([^\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g

},{}],33:[function(require,module,exports){
var upperCase = require('upper-case')
var snakeCase = require('snake-case')

/**
 * Constant case a string.
 *
 * @param  {String} string
 * @param  {String} [locale]
 * @return {String}
 */
module.exports = function (string, locale) {
  return upperCase(snakeCase(string, locale), locale)
}

},{"snake-case":63,"upper-case":64}],34:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var undefined;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],35:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('./handlebars/base');

var base = _interopRequireWildcard(_import);

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)

var _SafeString = require('./handlebars/safe-string');

var _SafeString2 = _interopRequireWildcard(_SafeString);

var _Exception = require('./handlebars/exception');

var _Exception2 = _interopRequireWildcard(_Exception);

var _import2 = require('./handlebars/utils');

var Utils = _interopRequireWildcard(_import2);

var _import3 = require('./handlebars/runtime');

var runtime = _interopRequireWildcard(_import3);

var _noConflict = require('./handlebars/no-conflict');

var _noConflict2 = _interopRequireWildcard(_noConflict);

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
function create() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = _SafeString2['default'];
  hb.Exception = _Exception2['default'];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

_noConflict2['default'](inst);

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];
},{"./handlebars/base":36,"./handlebars/exception":37,"./handlebars/no-conflict":38,"./handlebars/runtime":39,"./handlebars/safe-string":40,"./handlebars/utils":41}],36:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;
exports.HandlebarsEnvironment = HandlebarsEnvironment;
exports.createFrame = createFrame;

var _import = require('./utils');

var Utils = _interopRequireWildcard(_import);

var _Exception = require('./exception');

var _Exception2 = _interopRequireWildcard(_Exception);

var VERSION = '3.0.1';
exports.VERSION = VERSION;
var COMPILER_REVISION = 6;

exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1'
};

exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function registerHelper(name, fn) {
    if (toString.call(name) === objectType) {
      if (fn) {
        throw new _Exception2['default']('Arg not supported with multiple helpers');
      }
      Utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function unregisterHelper(name) {
    delete this.helpers[name];
  },

  registerPartial: function registerPartial(name, partial) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new _Exception2['default']('Attempting to register a partial as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function unregisterPartial(name) {
    delete this.partials[name];
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function () {
    if (arguments.length === 1) {
      // A missing field in a {{foo}} constuct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new _Exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });

  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = createFrame(options.data);
        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
        options = { data: data };
      }

      return fn(context, options);
    }
  });

  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new _Exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
      contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (isFunction(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data = createFrame(options.data);
    }

    function execIteration(field, index, last) {
      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams: Utils.blockParams([context[field], field], [contextPath + field, null])
      });
    }

    if (context && typeof context === 'object') {
      if (isArray(context)) {
        for (var j = context.length; i < j; i++) {
          execIteration(i, i, i === context.length - 1);
        }
      } else {
        var priorKey = undefined;

        for (var key in context) {
          if (context.hasOwnProperty(key)) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array.
            if (priorKey) {
              execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          }
        }
        if (priorKey) {
          execIteration(priorKey, i - 1, true);
        }
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function (conditional, options) {
    if (isFunction(conditional)) {
      conditional = conditional.call(this);
    }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if (!options.hash.includeZero && !conditional || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function (conditional, options) {
    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
  });

  instance.registerHelper('with', function (context, options) {
    if (isFunction(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!Utils.isEmpty(context)) {
      if (options.data && options.ids) {
        var data = createFrame(options.data);
        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
        options = { data: data };
      }

      return fn(context, options);
    } else {
      return options.inverse(this);
    }
  });

  instance.registerHelper('log', function (message, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, message);
  });

  instance.registerHelper('lookup', function (obj, field) {
    return obj && obj[field];
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 1,

  // Can be overridden in the host environment
  log: function log(level, message) {
    if (typeof console !== 'undefined' && logger.level <= level) {
      var method = logger.methodMap[level];
      (console[method] || console.log).call(console, message); // eslint-disable-line no-console
    }
  }
};

exports.logger = logger;
var log = logger.log;

exports.log = log;

function createFrame(object) {
  var frame = Utils.extend({}, object);
  frame._parent = object;
  return frame;
}

/* [args, ]options */
},{"./exception":37,"./utils":41}],37:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line = undefined,
      column = undefined;
  if (loc) {
    line = loc.start.line;
    column = loc.start.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  if (loc) {
    this.lineNumber = line;
    this.column = column;
  }
}

Exception.prototype = new Error();

exports['default'] = Exception;
module.exports = exports['default'];
},{}],38:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;
/*global window */

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
  };
};

module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],39:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;
exports.checkRevision = checkRevision;

// TODO: Remove this line and break up compilePartial

exports.template = template;
exports.wrapProgram = wrapProgram;
exports.resolvePartial = resolvePartial;
exports.invokePartial = invokePartial;
exports.noop = noop;

var _import = require('./utils');

var Utils = _interopRequireWildcard(_import);

var _Exception = require('./exception');

var _Exception2 = _interopRequireWildcard(_Exception);

var _COMPILER_REVISION$REVISION_CHANGES$createFrame = require('./base');

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = _COMPILER_REVISION$REVISION_CHANGES$createFrame.COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = _COMPILER_REVISION$REVISION_CHANGES$createFrame.REVISION_CHANGES[currentRevision],
          compilerVersions = _COMPILER_REVISION$REVISION_CHANGES$createFrame.REVISION_CHANGES[compilerRevision];
      throw new _Exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new _Exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
    }
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new _Exception2['default']('No environment passed to template');
  }
  if (!templateSpec || !templateSpec.main) {
    throw new _Exception2['default']('Unknown template object: ' + typeof templateSpec);
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var result = env.VM.invokePartial.call(this, partial, context, options);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, options);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new _Exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  }

  // Just add water
  var container = {
    strict: function strict(obj, name) {
      if (!(name in obj)) {
        throw new _Exception2['default']('"' + name + '" not defined in ' + obj);
      }
      return obj[name];
    },
    lookup: function lookup(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function fn(i) {
      return templateSpec[i];
    },

    programs: [],
    program: function program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },

    data: function data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },
    merge: function merge(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths = undefined,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      depths = options.depths ? [context].concat(options.depths) : [context];
    }

    return templateSpec.main.call(container, context, container.helpers, container.partials, data, blockParams, depths);
  }
  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new _Exception2['default']('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new _Exception2['default']('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    return fn.call(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), depths && [context].concat(depths));
  }
  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

function resolvePartial(partial, context, options) {
  if (!partial) {
    partial = options.partials[options.name];
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

function invokePartial(partial, context, options) {
  options.partial = true;

  if (partial === undefined) {
    throw new _Exception2['default']('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? _COMPILER_REVISION$REVISION_CHANGES$createFrame.createFrame(data) : {};
    data.root = context;
  }
  return data;
}
},{"./base":36,"./exception":37,"./utils":41}],40:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

exports['default'] = SafeString;
module.exports = exports['default'];
},{}],41:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.extend = extend;

// Older IE versions do not directly support indexOf so we must implement our own, sadly.
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#x27;',
  '`': '&#x60;'
};

var badChars = /[&<>"'`]/g,
    possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString;

exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/*eslint-disable func-style, no-var */
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  exports.isFunction = isFunction = function (value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
/*eslint-enable func-style, no-var */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
};exports.isArray = isArray;

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}
},{}],42:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime')['default'];

},{"./dist/cjs/handlebars.runtime":35}],43:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":42}],44:[function(require,module,exports){
'use strict';
var repeating = require('repeating');

module.exports = function (str, indent, count) {
	if (typeof str !== 'string' || typeof indent !== 'string') {
		throw new TypeError('`string` and `indent` should be strings');
	}

	if (count != null && typeof count !== 'number') {
		throw new TypeError('`count` should be a number');
	}

	indent = count > 1 ? repeating(indent, count) : indent;

	return str.replace(/^(?!\s*$)/mg, indent);
};

},{"repeating":45}],45:[function(require,module,exports){
'use strict';
var isFinite = require('is-finite');

module.exports = function (str, n) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string as the first argument');
	}

	if (n < 0 || !isFinite(n)) {
		throw new TypeError('Expected a finite positive number');
	}

	var ret = '';

	do {
		if (n & 1) {
			ret += str;
		}

		str += str;
	} while (n = n >> 1);

	return ret;
};

},{"is-finite":46}],46:[function(require,module,exports){
'use strict';
var numberIsNan = require('number-is-nan');

module.exports = Number.isFinite || function (val) {
	return !(typeof val !== 'number' || numberIsNan(val) || val === Infinity || val === -Infinity);
};

},{"number-is-nan":47}],47:[function(require,module,exports){
'use strict';
module.exports = Number.isNaN || function (x) {
	return x !== x;
};

},{}],48:[function(require,module,exports){
(function (Buffer){
(function (root, stringify) {
  /* istanbul ignore else */
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    // Node.
    module.exports = stringify();
  } else if (typeof define === 'function' && define.amd) {
    // AMD, registers as an anonymous module.
    define(function () {
      return stringify();
    });
  } else {
    // Browser global.
    root.javascriptStringify = stringify();
  }
})(this, function () {
  /**
   * Match all characters that need to be escaped in a string. Modified from
   * source to match single quotes instead of double.
   *
   * Source: https://github.com/douglascrockford/JSON-js/blob/master/json2.js
   *
   * @type {RegExp}
   */
  var ESCAPABLE = /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

  /**
   * Map of characters to escape characters.
   *
   * @type {Object}
   */
  var META_CHARS = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    "'":  "\\'",
    '"':  '\\"',
    '\\': '\\\\'
  };

  /**
   * Escape any character into its literal JavaScript string.
   *
   * @param  {String} char
   * @return {String}
   */
  var escapeChar = function (char) {
    var meta = META_CHARS[char];

    return meta || '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
  };

  /**
   * JavaScript reserved word list.
   */
  var RESERVED_WORDS = {};

  /**
   * Map reserved words to the object.
   */
  (
    'break else new var case finally return void catch for switch while ' +
    'continue function this with default if throw delete in try ' +
    'do instanceof typeof abstract enum int short boolean export ' +
    'interface static byte extends long super char final native synchronized ' +
    'class float package throws const goto private transient debugger ' +
    'implements protected volatile double import public let yield'
  ).split(' ').map(function (key) {
    RESERVED_WORDS[key] = true;
  });

  /**
   * Check if a variable name is valid.
   *
   * @param  {String}  name
   * @return {Boolean}
   */
  var isValidVariableName = function (name) {
    return !RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
  };

  /**
   * Return the global variable name.
   *
   * @return {String}
   */
  var getGlobalVariable = function (value, indent, stringify) {
    return 'Function(' + stringify('return this;') + ')()';
  };

  /**
   * Convert JavaScript objects into strings.
   *
   * @type {Object}
   */
  var OBJECT_TYPES = {
    '[object Array]': function (array, indent, stringify) {
      // Map array values to their stringified values with correct indentation.
      var values = array.map(function (value) {
        return indent + stringify(value).split('\n').join('\n' + indent);
      }).join(indent ? ',\n' : ',');

      // Wrap the array in newlines if we have indentation set.
      if (indent && values) {
        return '[\n' + values + '\n]';
      }

      return '[' + values + ']';
    },
    '[object Object]': function (object, indent, stringify) {
      if (typeof Buffer === 'function' && Buffer.isBuffer(object)) {
        return 'new Buffer(' + stringify(object.toString()) + ')';
      }

      // Iterate over object keys and concat string together.
      var values = Object.keys(object).reduce(function (values, key) {
        var value = stringify(object[key]);

        // Omit `undefined` object values.
        if (value === undefined) {
          return values;
        }

        // String format the key and value data.
        key   = isValidVariableName(key) ? key : stringify(key);
        value = String(value).split('\n').join('\n' + indent);

        // Push the current object key and value into the values array.
        values.push(indent + key + ':' + (indent ? ' ' : '') + value);

        return values;
      }, []).join(indent ? ',\n' : ',');

      // Wrap the object in newlines if we have indentation set.
      if (indent && values) {
        return '{\n' + values + '\n}';
      }

      return '{' + values + '}';
    },
    '[object Date]': function (date, indent, stringify) {
      return 'new Date(' + date.getTime() + ')';
    },
    '[object String]': function (string, indent, stringify) {
      return 'new String(' + stringify(string.toString()) + ')';
    },
    '[object Number]': function (number, indent, stringify) {
      return 'new Number(' + number + ')';
    },
    '[object Boolean]': function (boolean, indent, stringify) {
      return 'new Boolean(' + boolean + ')';
    },
    '[object RegExp]': String,
    '[object Function]': String,
    '[object global]': getGlobalVariable,
    '[object Window]': getGlobalVariable
  };

  /**
   * Convert JavaScript primitives into strings.
   *
   * @type {Object}
   */
  var PRIMITIVE_TYPES = {
    'string': function (string) {
      return "'" + string.replace(ESCAPABLE, escapeChar) + "'";
    },
    'number': String,
    'object': String,
    'boolean': String,
    'undefined': String
  };

  /**
   * Convert any value to a string.
   *
   * @param  {*}        value
   * @param  {String}   indent
   * @param  {Function} stringify
   * @return {String}
   */
  var stringify = function (value, indent, stringify) {
    // Convert primitives into strings.
    if (Object(value) !== value) {
      return PRIMITIVE_TYPES[typeof value](value, indent, stringify);
    }

    // Use the internal object string to select stringification method.
    var toString = OBJECT_TYPES[Object.prototype.toString.call(value)];

    // Convert objects into strings.
    return toString && toString(value, indent, stringify);
  };

  /**
   * Stringify an object into the literal string.
   *
   * @param  {Object}          value
   * @param  {Function}        [replacer]
   * @param  {(Number|String)} [space]
   * @return {String}
   */
  return function (value, replacer, space) {
    // Convert the spaces into a string.
    if (typeof space !== 'string') {
      space = new Array(Math.max(0, space|0) + 1).join(' ');
    }

    /**
     * Handle recursion by checking if we've visited this node every iteration.
     *
     * @param  {*}      value
     * @param  {Array}  cache
     * @return {String}
     */
    var recurse = function (value, cache, next) {
      // If we've already visited this node before, break the recursion.
      if (cache.indexOf(value) > -1) {
        return;
      }

      // Push the value into the values cache to avoid an infinite loop.
      cache.push(value);

      // Stringify the value and fallback to
      return next(value, space, function (value) {
        return recurse(value, cache.slice(), next);
      });
    };

    // If the user defined a replacer function, make the recursion function
    // a double step process - `replacer -> stringify -> replacer -> etc`.
    if (typeof replacer === 'function') {
      return recurse(value, [], function (value, space, next) {
        return replacer(value, space, function (value) {
          return stringify(value, space, next);
        });
      });
    }

    return recurse(value, [], stringify);
  };
});

}).call(this,require("buffer").Buffer)
},{"buffer":24}],49:[function(require,module,exports){
/**
 * Special language-specific overrides.
 *
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 *
 * @type {Object}
 */
var LANGUAGES = {
  tr: {
    regexp: /\u0130|\u0049|\u0049\u0307/g,
    map: {
      '\u0130': '\u0069',
      '\u0049': '\u0131',
      '\u0049\u0307': '\u0069'
    }
  },
  az: {
    regexp: /[\u0130]/g,
    map: {
      '\u0130': '\u0069',
      '\u0049': '\u0131',
      '\u0049\u0307': '\u0069'
    }
  },
  lt: {
    regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
    map: {
      '\u0049': '\u0069\u0307',
      '\u004A': '\u006A\u0307',
      '\u012E': '\u012F\u0307',
      '\u00CC': '\u0069\u0307\u0300',
      '\u00CD': '\u0069\u0307\u0301',
      '\u0128': '\u0069\u0307\u0303'
    }
  }
}

/**
 * Lowercase a string.
 *
 * @param  {String} str
 * @return {String}
 */
module.exports = function (str, locale) {
  var lang = LANGUAGES[locale]

  str = str == null ? '' : String(str)

  if (lang) {
    str = str.replace(lang.regexp, function (m) { return lang.map[m] })
  }

  return str.toLowerCase()
}

},{}],50:[function(require,module,exports){

var http = require('http');

/* istanbul ignore next: implementation differs on version */
if (http.METHODS) {

  module.exports = http.METHODS.map(function(method){
    return method.toLowerCase();
  });

} else {

  module.exports = [
    'get',
    'post',
    'put',
    'head',
    'delete',
    'options',
    'trace',
    'copy',
    'lock',
    'mkcol',
    'move',
    'purge',
    'propfind',
    'proppatch',
    'unlock',
    'report',
    'mkactivity',
    'checkout',
    'merge',
    'm-search',
    'notify',
    'subscribe',
    'unsubscribe',
    'patch',
    'search',
    'connect'
  ];

}

},{"http":23}],51:[function(require,module,exports){
/*!
 * object.pick <https://github.com/jonschlinkert/object.pick>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

module.exports = function pick(obj, keys) {
  var res = {};
  var i = 0;

  if (typeof obj !== 'object') {
    return res;
  }

  if (typeof keys === 'string') {
    if (keys in obj) {
      res[keys] = obj[keys];
    }
    return res;
  }

  var len = keys.length;

  while (len--) {
    var key = keys[i++];
    if (key in obj) {
      res[key] = obj[key];
    }
  }
  return res;
};

},{}],52:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./vendor/camel-case-regexp":53,"./vendor/non-word-regexp":54,"./vendor/trailing-digit-regexp":55,"dup":29,"lower-case":49}],53:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],54:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],55:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],56:[function(require,module,exports){
var sentenceCase = require('sentence-case');

/**
 * Param case a string.
 *
 * @param  {String} string
 * @param  {String} [locale]
 * @return {String}
 */
module.exports = function (string, locale) {
  return sentenceCase(string, locale, '-');
};

},{"sentence-case":52}],57:[function(require,module,exports){
var upperCase = require('upper-case')

/**
 * Upper case the first character of a string.
 *
 * @param  {String} str
 * @return {String}
 */
module.exports = function (str, locale) {
  if (str == null) {
    return ''
  }

  str = String(str)

  return upperCase(str.charAt(0), locale) + str.substr(1)
}

},{"upper-case":64}],58:[function(require,module,exports){
var camelCase = require('camel-case')
var upperCaseFirst = require('upper-case-first')

/**
 * Pascal case a string.
 *
 * @param  {String} string
 * @param  {String} [locale]
 * @return {String}
 */
module.exports = function (string, locale) {
  return upperCaseFirst(camelCase(string, locale), locale)
}

},{"camel-case":28,"upper-case-first":57}],59:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./vendor/camel-case-regexp":60,"./vendor/non-word-regexp":61,"./vendor/trailing-digit-regexp":62,"dup":29,"lower-case":49}],60:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],61:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],62:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],63:[function(require,module,exports){
var sentenceCase = require('sentence-case');

/**
 * Snake case a string.
 *
 * @param  {String} str
 * @param  {String} [locale]
 * @return {String}
 */
module.exports = function (str, locale) {
  return sentenceCase(str, locale, '_');
};

},{"sentence-case":59}],64:[function(require,module,exports){
/**
 * Special language-specific overrides.
 *
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 *
 * @type {Object}
 */
var LANGUAGES = {
  tr: {
    regexp: /[\u0069]/g,
    map: {
      '\u0069': '\u0130'
    }
  },
  az: {
    regexp: /[\u0069]/g,
    map: {
      '\u0069': '\u0130'
    }
  },
  lt: {
    regexp: /[\u0069\u006A\u012F]\u0307|\u0069\u0307[\u0300\u0301\u0303]/g,
    map: {
      '\u0069\u0307': '\u0049',
      '\u006A\u0307': '\u004A',
      '\u012F\u0307': '\u012E',
      '\u0069\u0307\u0300': '\u00CC',
      '\u0069\u0307\u0301': '\u00CD',
      '\u0069\u0307\u0303': '\u0128'
    }
  }
}

/**
 * Upper case a string.
 *
 * @param  {String} str
 * @return {String}
 */
module.exports = function (str, locale) {
  var lang = LANGUAGES[locale]

  str = str == null ? '' : String(str)

  if (lang) {
    str = str.replace(lang.regexp, function (m) { return lang.map[m] })
  }

  return str.toUpperCase()
}

},{}],65:[function(require,module,exports){
/**
 * Export all implemented languages.
 */
exports.javascript = require('./javascript');

},{"./javascript":4}]},{},[65])(65)
});