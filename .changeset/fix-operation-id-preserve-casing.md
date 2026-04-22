---
"@hey-api/openapi-ts": patch
"@hey-api/shared": patch
---

**plugin(@hey-api/typescript)**: preserve acronym casing from `operationId` in operation-derived type names under `case: 'preserve'`

**plugin(zod)**: preserve acronym casing from `operationId` in operation schema names under `case: 'preserve'`

**plugin(valibot)**: preserve acronym casing from `operationId` in operation schema names under `case: 'preserve'`

Consumer-visible output change: under `case: 'preserve'`, operation-derived names (request/response/error types, zod/valibot schemas) that previously lowercased acronym segments (e.g. `describeHTTPRequest` → `describeHttpRequest`) now retain the original casing (`describeHTTPRequest`). Downstream code importing these names directly will need to update.
