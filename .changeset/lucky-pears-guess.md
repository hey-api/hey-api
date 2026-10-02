---
"@hey-api/openapi-ts": patch
---

**plugin(@hey-api/sdk)**: generate compiling SDKs for clients without `responseStyle`, and type Nuxt's error parameter

`responseStyle: 'data'` emitted a `responseStyle` request option and a `TResponseStyle` type argument for every client, but only Angular, Fetch, Ky and Ofetch implement it. The TanStack Query, Pinia Colada and SWR plugins made the same assumption when unwrapping SDK results.

Separately, the Nuxt SDK's declared return type passed `DefaultT` where `RequestResult` expects `TError`, so every operation's annotation disagreed with its own call.
