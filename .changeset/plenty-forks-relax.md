---
"@hey-api/openapi-python": patch
---

**plugin(@hey-api/python-sdk)**: generate auth from OpenAPI security schemes

SDK methods now thread the operation's resolved `security` schemes through to the generated client, mirroring `@hey-api/openapi-ts`. Pass a static token or a callback to the generated `Client` (`Client(auth="token")` or `Client(auth=lambda scheme: "token")`) and it is applied to the header, query parameter, or cookie the spec names for each operation, including operations with no other parameters. An operation with `security: []` stays unauthenticated. Set `auth: false` on the `@hey-api/python-sdk` plugin to disable this.
