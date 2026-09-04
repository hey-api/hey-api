---
"@hey-api/openapi-python": patch
---

**plugin(pydantic)**: a property name starting with a digit no longer breaks the module

Such a name was sanitised by prepending an underscore, and Pydantic reserves a leading underscore for a private attribute, so the generated class raised `NameError` while its body executed and aborted the import of the whole module. The field is now prefixed with `field_` instead, keeping the wire name as its alias.
