---
"@hey-api/openapi-ts": patch
"@hey-api/shared": patch
---

**plugin(examples)**: fix crash on non-object path item members (e.g. `x-internal: true`, path-level `summary`) and stop skipping operations that define `summary`, `description`, or `parameters`
