---
"@hey-api/openapi-ts": patch
"@hey-api/shared": patch
---

**fix(parser)**: respect `x-nullable` on OpenAPI 2.0 enum schemas

An enum schema was dispatched to `parseEnum()` before `x-nullable` was
ever consulted (that check only ran for schemas going through
`parseType()`), so `{ type: 'string', enum: [...], 'x-nullable': true }`
silently lost its nullability and generated a non-nullable union instead
of `... | null`.
