---
"@hey-api/openapi-ts": patch
---

**fix**: emit default imports of functions as value imports, not `import type`

A default-kind import of a function symbol (used by the `swr` plugin to import `useSWR`) was always printed as `import type`, producing generated code that fails to compile with `'useSWR' cannot be used as a value because it was imported using 'import type'`. The import's type-only status is now derived from how the symbol is actually used, matching named and namespace imports.
