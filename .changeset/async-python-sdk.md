---
'@hey-api/openapi-python': patch
---

**plugin(@hey-api/client-httpx)**: generate an async SDK class tree (`AsyncSdk`, `AsyncWidgets`, ...) backed by `httpx.AsyncClient`, alongside the existing sync one. Method names are identical on both trees; only the async ones use `async def`/`await`. Disable with `asyncMode: false` on `client-httpx`.
