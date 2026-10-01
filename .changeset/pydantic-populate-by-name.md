---
"@hey-api/openapi-python": patch
---

**plugin(pydantic)**: emit `populate_by_name` on a model that has an aliased field

The config was computed from the fields and then discarded, because its emission was gated on a separate flag that only an explicit `additionalProperties` config sets. A model with an alias but no other config rendered no `model_config` at all, so populating it by the generated field name was silently ignored: `Thing(class_="c").class_` returned `None`.
