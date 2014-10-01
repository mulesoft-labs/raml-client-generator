# Language Implementation

To maintain consistency between clients and across multiple languages, we are aiming to stay as close as possible to certain behaviours and DSLs.

## File Structure

Every language implementation should contain a bare minimum of a readme file, package definition (dependencies and module information) and the source files.

## API Client

The API client should be a class or similar language contruct capable of being initialized multiple times. This is practical so that multiple clients of that same API can co-exist with same interface but different option overrides.

## Resource DSL

The core generator maintains a consistent DLS for all resource endpoints. By generating the relevant classes, objects or functions related to the route, you should end up with a highly readable and understandable DSL. For example, the resource `GET /user/{userId}/friends` will become `client.resources.user.userId(num).friends.get()`.

All resources should be nested under the `resources` property of the root client instance.

## Resource Verbs

Every resource request verb should be available as a different method at the end of their respective DSL chains. The implementation and return of this method may, however, differ between language implementations. In JavaScript, this method returns a promise.

The resource request method should accept a minimum of two arguments. The first is a request shorthand. With GET and HEAD requests, the shorthand should automatically set the query parameters. All other methods using the shorthand will set the body. The second arguments is an options map containing valid options such as `query`, `headers`, `body`, `baseUri` and `baseUriParameters.

## Resource Request Bodies

The request body should attempt, where possible, to automatically convert the body to something that is valid to be sent to an external server. If the body is already in a valid format, no conversion is necessary. If a conversion is determined to not be possible, you should throw an error. The method for determining to convert the body is expanded below.

If the `Content-Type` header is set, attempt to use it to convert known formats. For example, stringify as JSON when the header is `application/json`. If no `Content-Type` header is set, it should select the most relevant format for your language from the allowed media types.

By default, all clients need to support JSON (`application/json`), url encoded forms (`application/x-www-form-urlencoded`) and multipart forms (`multipart/form-data`).

## Responses

Although the response method may differ between language implementation, the eventual result should not. All responses should be returned using a standard map with four properties - `status`, `headers`, `body` and `raw`.

* **status** - The status code of response as a number. E.g. `200`.
* **headers** - A map of headers to values. The header key will always be lowercase.
* **body** - The automatically parsed response body represented as a native type.
* **raw** - The reference to the original raw response in the target language.

The response body must be parsed according to the response `Content-Type` header. If parsing fails, it should throw an error. By default, all clients must support responses as JSON (`application/json`) and url encoded forms (`application/x-www-form-urlencoded`). If the `Content-Type` is not understood, it should be returned as a string or buffer.
