---
"@hey-api/openapi-ts": patch
---

**fix(sdk)**: keep `parameters` required in `paramsStructure: 'flat'` when `options` is required (e.g. `client: false`)

When the SDK `options` argument is required (for example with `client: false`), an operation whose parameters are all optional generated `(parameters?: ..., options: ...)` — a required parameter following an optional one, which TypeScript rejects with TS1016. `parameters` is now emitted as required whenever `options` is; callers can still pass `{}`.
