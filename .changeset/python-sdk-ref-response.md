---
"@hey-api/openapi-python": patch
---

**sdk**: return the referenced model for a response declared as a `$ref`

A success response whose schema is nothing but a `$ref` was returned as the per-operation `RootModel` holding it, so every caller unwrapped `.root` before reading a field. Such a response is the referenced component, so the method now returns and validates that model directly, as the TypeScript SDK already types it.

A response that only points at a shape the generator emits as a `TypeAlias`, such as a bare number or an enum, keeps the per-operation model, because a type alias has no `model_validate`.
