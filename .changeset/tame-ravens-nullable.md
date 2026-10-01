---
"@hey-api/openapi-ts": patch
"@hey-api/shared": patch
---

**fix(parser)**: respect nullability on OpenAPI 2.0/3.0 enum schemas

An enum schema was dispatched to `parseEnum()` before nullability was
ever consulted (that check only ran for schemas going through
`parseType()`), so `{ type: 'string', enum: [...], 'x-nullable': true }`
(OpenAPI 2.0) and `{ type: 'string', enum: [...], nullable: true }`
(OpenAPI 3.0) silently lost their nullability and generated a
non-nullable union instead of `... | null`.
