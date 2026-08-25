---
"@hey-api/openapi-ts": patch
---

**fix**: generated fetch and SSE clients no longer leak internal options into the `Request` init, fixing `TypeError: Failed to construct 'Request'` on Deno and Bun

The `client-fetch` and core SSE runtimes spread their internal options object into `new Request(url, init)`. Node, undici and browsers ignore unknown `RequestInit` keys, but Deno and Bun validate the init strictly (Deno treats `client` as a `Deno.HttpClient`) and throw on every request. The init is now sanitized to standard `RequestInit` fields before constructing the `Request`. This is a no-op on Node and in the browser.
