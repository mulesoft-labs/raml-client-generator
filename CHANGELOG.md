# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## [0.1.1](https://github.com/mulesoft/raml-client-generator/compare/v0.1.0...v0.1.1) - 2015-06-20

### Fixed

- Added `raml-client-generator.js` to package files array.

## [0.1.0](https://github.com/mulesoft/raml-client-generator/compare/v0.0.7...v0.1.0) - 2015-06-16

### Changed

- Project is now being built by combining multiple common dependencies.

## [0.0.7](https://github.com/mulesoft/raml-client-generator/compare/v0.0.6...v0.0.7) - 2015-03-25

### Added

- Added `files` array to `package.json`.
- Added downloads badge to README.
- Added documentation to RAML context object.
- Running tests on Node 0.12.

### Changed

- Update Popsicle to latest version.
- Allow generated file names to be programmatically generated.
- Updated implementation documentation.
- Add post-generation install instructions.
- Updated major dependencies.
- Merge query objects in request methods of JavaScript clients.
- Support folders defined in the file key names.

### Fixed

- Tests working under Node 0.11.

### Removed

- No more streaming tests. The underlying implementation should be tested properly.

## [0.0.6](https://github.com/mulesoft/raml-client-generator/compare/v0.0.5...v0.0.6) - 2015-01-22

### Changed

- Update RAML Parser to `0.8.10`.

### Fixed

- Correct automatic build with `pre-commit`.

## [0.0.5](https://github.com/mulesoft/raml-client-generator/compare/v0.0.4...v0.0.5) - 2015-01-07

### Changed

- Automatically build and test on every commit.

## [0.0.4](https://github.com/mulesoft/raml-client-generator/compare/v0.0.3...v0.0.4) - 2015-01-07

### Changed

- Tidy up generated `package.json` for JavaScript.

## [0.0.3](https://github.com/mulesoft/raml-client-generator/compare/v0.0.2...v0.0.3) - 2014-12-31

### Fixed

- Remove dangling `lodash` require.

## [0.0.2](https://github.com/mulesoft/raml-client-generator/compare/v0.0.1...v0.0.2) - 2014-12-31

### Added

- Add `bower.json`

### Changed

- Update `methods` with browser support and smaller build output.
- Remove `lodash` usage for smaller builds.

### Added

- Support build for browserify.

## 0.0.1 - 2014-12-19

### Added

- Initial project release.
