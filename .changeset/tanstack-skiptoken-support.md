---
"@hey-api/openapi-ts": minor
---

**plugin(@tanstack/query)**: feat: add `skipToken` support to `queryOptions`, `infiniteQueryOptions`, and the generated `*QueryKey` helpers

Generated `*Options` factories and exported `*QueryKey` helpers now accept `Options<T> | typeof skipToken`. When `skipToken` is passed, `queryFn` short-circuits to `skipToken` (disabling the query per TanStack Query's conventions) and `queryKey` is built from the unwrapped value via a shared `unwrapSkipToken` helper. Existing call sites passing `Options<T>` continue to work unchanged.
