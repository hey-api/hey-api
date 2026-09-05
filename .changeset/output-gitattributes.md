---
"@hey-api/openapi-python": minor
"@hey-api/openapi-ts": minor
"@hey-api/shared": minor
---

feat(output): generate `.gitattributes` for committed clients

Generated output now includes a `.gitattributes` file that marks suffixed generated files and entry files with `linguist-generated` and `-diff`. Disable with `output.gitAttributes: false`.
