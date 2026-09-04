---
"@hey-api/openapi-python": patch
---

**plugin(pydantic)**: generate a typed error model from an operation's 4xx and 5xx responses

Adds an `errors` config block to the `pydantic` plugin. For each operation with 4xx/5xx responses, generates `<Op>Error`: a deduplicated union of the operation's distinct error schemas, so a caller can validate an error body against a real model instead of a raw dict. A bare `$ref` error response resolves to the referenced model directly instead of being wrapped in a `RootModel`.

TypeScript's `@hey-api/typescript` plugin also generates a status-code-keyed `<Op>Errors` map (`{ '404': X; '500': Y }`), a zero-cost compile-time index type there. That map is deliberately not generated for Python: as a Pydantic model every status would be a required field, but a real response only ever carries one status, so no real payload could ever validate against it. Only the union, `<Op>Error`, is generated.

An error union that would collapse to `Any` (for example a no-content 4xx alongside a `text/plain` one, i.e. `Union[Any, str]`) tells a caller nothing, so no symbol is generated for that operation's error type at all in that case.

`errors` is enabled by default; set `errors: false` to opt out. This only generates models — it does not change what any generated SDK method does with a response.
