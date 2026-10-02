---
"@hey-api/openapi-ts": patch
"@hey-api/shared": patch
---

**fix(parser)**: preserve nullability of enums when `enum` doesn't contain a literal `null` value

Previously, a nullable enum expressed as `{ "type": ["string", "null"], "enum": ["a", "b"] }` (OpenAPI 3.1) or `{ "nullable": true, "enum": ["a", "b"] }` (OpenAPI 3.0) lost its nullability during parsing, because the parser only detected `null` when it appeared as a literal value inside the `enum` array. This produced incorrect output across all consumers of the schema IR — for example, `z.enum(['a', 'b']).optional()` instead of `z.enum(['a', 'b']).nullish()` for an optional property in the Zod plugin, and `'a' | 'b'` instead of `'a' | 'b' | null` in the TypeScript types.
