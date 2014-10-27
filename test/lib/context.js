var expect = require('chai').expect;
var context = require('../../lib/compile/context');

describe('context', function () {
  var spec = {
    format: {
      variable: require('camel-case')
    }
  };

  it('should generate a basic context object', function () {
    var ast = {
      title: 'My API',
      version: 'v1.1.0',
      baseUri: 'http://example.com'
    };

    var output = context(ast, spec);

    expect(output.id).to.be.a('string');
    expect(output.title).to.equal('My API');
    expect(output.version).to.equal('v1.1.0');
    expect(output.baseUri).to.equal('http://example.com');
    expect(output.baseUriParameters).to.deep.equal({});
    expect(output.resources).to.be.an('object');
    expect(output.allMethods).to.be.an('array');
    expect(output.allResources).to.be.an('array');
    expect(output.allResources[0]).to.equal(output.resources);
  });

  describe('resources', function () {
    it('should compile an ast into general code layout', function () {
      var ast = {
        resources: [{
          relativeUri: '/statuses',
          resources: [{
            relativeUri: '/mentions_timeline{mediaTypeExtension}',
            uriParameters: {
              mediaTypeExtension: {
                enum: ['.json']
              }
            },
            methods: [{
              method: 'get',
              queryParameters: {
                count: {
                  type: 'integer'
                }
              }
            }]
          }]
        }]
      };

      var resources = context(ast, spec).resources;

      expect(resources.relativeUri).to.equal('');

      var statuses = resources.children.statuses;

      // Expect status structure to match.
      expect(statuses).to.be.an('object');
      expect(statuses.parent).to.equal(resources);
      expect(statuses.relativeUri).to.equal('/statuses');

      var mentionsTimeline = statuses.children.mentionsTimeline;

      // Expect mentions timeline resource to match.
      expect(mentionsTimeline).to.be.an('object');
      expect(mentionsTimeline.parent).to.equal(statuses);
      expect(mentionsTimeline.relativeUri).to.equal('/mentions_timeline');

      var mediaTypeExtension = mentionsTimeline.children.mediaTypeExtension;

      // Expect the media type extension resource to match.
      expect(mediaTypeExtension).to.be.an('object');
      expect(mediaTypeExtension.parent).to.equal(mentionsTimeline);
      expect(mediaTypeExtension.relativeUri).to.equal('.{0}');
    });
  });
});
