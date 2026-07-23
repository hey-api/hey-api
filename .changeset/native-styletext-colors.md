---
"@hey-api/openapi-python": patch
"@hey-api/codegen-core": patch
"@hey-api/openapi-ts": patch
"@hey-api/shared": patch
---

Use Node's built-in `node:util` `styleText` for terminal coloring instead of the `ansi-colors` and `color-support` packages.
