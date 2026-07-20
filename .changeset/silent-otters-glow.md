---
"@hey-api/openapi-ts": patch
---

`@hey-api/client-angular` now accepts `context` (Angular's `HttpContext`) on generated requests. `requestOptions()` already forwarded it into the underlying `HttpRequest` constructor, but the `Config`/`RequestOptions` types were missing the field, so it could not be set from a generated SDK call.
