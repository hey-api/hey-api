---
"@hey-api/openapi-ts": minor
---

**plugin(@tanstack/react-query, @tanstack/preact-query)**: feat: add `queryOptions` override parameter to generated `useQuery` hooks

When `useQuery` hook generation is enabled, generated hooks now accept an optional `queryOptions` property (typed via a new `UseQueryParams<typeof xOptions>` alias) that is spread over the computed query options, mirroring the existing `mutationOptions` override on `useMutation` hooks. This lets consumers override TanStack Query options like `staleTime`, `gcTime`, or `enabled` per call site without losing type safety.

Opt in to `useQuery` hook generation with `useQuery: true` in your plugin config.
