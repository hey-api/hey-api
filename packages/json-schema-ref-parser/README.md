# JSON Schema $Ref Parser

#### Parse, Resolve, and Dereference JSON Schema $ref pointers

## Installation

Install using [npm](https://docs.npmjs.com/about-npm/):

```bash
npm install @hey-api/json-schema-ref-parser
pnpm add @hey-api/json-schema-ref-parser
yarn add @hey-api/json-schema-ref-parser
bun add @hey-api/json-schema-ref-parser
```

## The Problem:

You've got a JSON Schema with `$ref` pointers to other files and/or URLs. Maybe you know all the referenced files ahead
of time. Maybe you don't. Maybe some are local files, and others are remote URLs. Maybe they are a mix of JSON and YAML
format. Maybe some of the files contain cross-references to each other.

```json
{
  "definitions": {
    "person": {
      // references an external file
      "$ref": "schemas/people/Bruce-Wayne.json"
    },
    "place": {
      // references a sub-schema in an external file
      "$ref": "schemas/places.yaml#/definitions/Gotham-City"
    },
    "thing": {
      // references a URL
      "$ref": "http://wayne-enterprises.com/things/batmobile"
    },
    "color": {
      // references a value in an external file via an internal reference
      "$ref": "#/definitions/thing/properties/colors/black-as-the-night"
    }
  }
}
```

## The Solution:

JSON Schema $Ref Parser is a full [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03)
and [JSON Pointer](https://tools.ietf.org/html/rfc6901) implementation that crawls even the most
complex [JSON Schemas](http://json-schema.org/latest/json-schema-core.html) and gives you simple, straightforward
JavaScript objects.

- Use **JSON** or **YAML** schemas &mdash; or even a mix of both!
- Supports `$ref` pointers to external files and URLs, as well as custom sources such as databases
- Can bundle multiple files into a single schema that only has _internal_ `$ref` pointers
- Can dereference your schema, producing a plain-old JavaScript object that's easy to work with
- Supports circular references, nested references,
  back-references, and cross-references between files
- Maintains object reference equality &mdash; `$ref` pointers to the same value always resolve to the same object
  instance
- Compatible with Node LTS and beyond, and all major web browsers on Windows, Mac, and Linux

### New in this fork (@hey-api)

- **Multiple inputs with `bundleMany`**: Merge and bundle several OpenAPI/JSON Schema inputs (files, URLs, or raw objects) into a single schema. Components are prefixed to avoid name collisions, paths are namespaced on conflict, and `$ref`s are rewritten accordingly.

```javascript
import { $RefParser } from '@hey-api/json-schema-ref-parser';

const parser = new $RefParser();
const merged = await parser.bundleMany({
  pathOrUrlOrSchemas: [
    './specs/a.yaml',
    'https://example.com/b.yaml',
    { openapi: '3.1.0', info: { title: 'Inline' }, paths: {} },
  ],
});

// merged.components.* will contain prefixed names like a_<name>, b_<name>, etc.
```

- **Dereference hooks**: Fine-tune dereferencing with `excludedPathMatcher(path) => boolean` to skip subpaths and `onDereference(path, value, parent, parentPropName)` to observe replacements.

```javascript
const parser = new $RefParser();
parser.options.dereference.excludedPathMatcher = (p) => p.includes('/example/');
parser.options.dereference.onDereference = (p, v) => {
  // inspect p / v as needed
};
await parser.dereference({ pathOrUrlOrSchema: './openapi.yaml' });
```

- **Smart input resolution**: You can pass a file path, URL, or raw schema object. If a raw schema includes `$id`, it is used as the base URL for resolving relative `$ref`s.

```javascript
await new $RefParser().bundle({
  pathOrUrlOrSchema: {
    $id: 'https://api.example.com/openapi.json',
    openapi: '3.1.0',
    paths: {
      '/ping': { get: { responses: { 200: { description: 'ok' } } } },
    },
  },
});
```

<!-- template-contributing-start -->

## Contributing

Want to see your code in products used by millions?

Start with our [Contributing](https://heyapi.dev/docs/openapi/typescript/community/contributing) guide and release your first feature.

<!-- template-contributing-end -->

<!-- template-sponsors-start -->

## Sponsors

Partners behind the future of API tooling. [Become a sponsor](https://github.com/sponsors/hey-api).

<h3 align="center">Gold</h3>

<table align="center">
  <tbody>
      <td align="center" width="50%">
        <p></p>
        <p>
          <a href="https://kutt.to/QM9Q2N" target="_blank">
            <picture height="50px">
              <source media="(prefers-color-scheme: dark)" srcset="https://heyapi.dev/assets/opencode/logo-light.svg">
              <img alt="Opencode logo" height="50px" src="https://heyapi.dev/assets/opencode/logo-dark.svg">
            </picture>
          </a>
          <br/>
          The open source coding agent.
          <br/>
          <a href="https://kutt.to/QM9Q2N" style="text-decoration:none;" target="_blank">
            opencode.ai
          </a>
        </p>
        <p></p>
      </td>
    </tr>
  </tbody>
</table>

<h3 align="center">Silver</h3>

<table align="center">
  <tbody>
    <tr>
      <td align="center" width="33.333%">
        <a href="https://kutt.to/skQUVd" target="_blank">
          <picture height="40px">
            <source media="(prefers-color-scheme: dark)" srcset="https://heyapi.dev/assets/scalar/logo-light.svg">
            <img alt="Scalar logo" height="40px" src="https://heyapi.dev/assets/scalar/logo-dark.svg">
          </picture>
        </a>
        <br/>
        <a href="https://kutt.to/skQUVd" style="text-decoration:none;" target="_blank">
          scalar.com
        </a>
      </td>
      <td align="center" width="33.333%">
        <a href="https://kutt.to/Dr9GuW" target="_blank">
          <picture height="40px">
            <source media="(prefers-color-scheme: dark)" srcset="https://heyapi.dev/assets/fastapi/logo-light.svg">
            <img alt="FastAPI logo" height="40px" src="https://heyapi.dev/assets/fastapi/logo-dark.svg">
          </picture>
        </a>
        <br/>
        <a href="https://kutt.to/Dr9GuW" style="text-decoration:none;" target="_blank">
          fastapi.tiangolo.com
        </a>
      </td>
      <td align="center" width="33.333%">
        <a href="https://kutt.to/yZVkdV" target="_blank">
          <picture height="40px">
            <source media="(prefers-color-scheme: dark)" srcset="https://heyapi.dev/assets/brands/unblocked/logo-light.svg">
            <img alt="Unblocked logo" height="40px" src="https://heyapi.dev/assets/brands/unblocked/logo-dark.svg">
          </picture>
        </a>
        <br/>
        <a href="https://kutt.to/yZVkdV" style="text-decoration:none;" target="_blank">
          getunblocked.com
        </a>
      </td>
    </tr>
  </tbody>
</table>

<h3 align="center">Bronze</h3>

<table align="center">
  <tbody>
    <tr>
      <td align="center" width="33.333%">
        <a href="https://kutt.to/YpaKsX" target="_blank">
          <picture height="34px">
            <source media="(prefers-color-scheme: dark)" srcset="https://heyapi.dev/assets/.gen/kinde-logo-wordmark-dark-480w.webp">
            <img alt="Kinde logo" height="34px" src="https://heyapi.dev/assets/.gen/kinde-logo-wordmark-480w.jpeg">
          </picture>
        </a>
      </td>
      <td align="center" width="33.333%">
        <a href="https://kutt.to/HW4GYR" target="_blank">
          <picture height="34px">
            <source media="(prefers-color-scheme: dark)" srcset="https://heyapi.dev/assets/photon/logo-light.svg">
            <img alt="Photon logo" height="34px" src="https://heyapi.dev/assets/photon/logo-dark.svg">
          </picture>
        </a>
      </td>
    </tr>
  </tbody>
</table>
<!-- template-sponsors-end -->

<!-- template-license-start -->

## License

Released under the [MIT License](https://github.com/hey-api/hey-api/blob/main/LICENSE).

<!-- template-license-end -->
