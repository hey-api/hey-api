---
'@hey-api/openapi-ts': patch
---

fix: avoid `Headers.forEach` in `mergeHeaders` so requests don't fail in a detached realm

`Headers.forEach` is a Web IDL callback, so Blink refuses to invoke it once the owning realm is detached and throws `Failed to execute 'forEach' on 'Headers': The provided callback is no longer runnable.` `mergeHeaders` now iterates `Headers.entries()` and only falls back to `forEach` when `entries` is missing.
