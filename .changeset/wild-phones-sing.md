---
"@hey-api/shared": patch
---

Fix crash when a plugin is registered without a valid `handler` function. Previously this surfaced as a cryptic `this.handler is not a function` at runtime; now it throws a descriptive error naming the offending plugin.