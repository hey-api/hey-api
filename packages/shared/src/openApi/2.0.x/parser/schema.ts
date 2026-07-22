import type { OpenAPIV2 } from '@hey-api/spec-types';

import type { Context } from '../../../ir/context';
import type { IR } from '../../../ir/types';
import { addItemsToSchema } from '../../../ir/utils';
import type {
  SchemaState,
  SchemaType,
  SchemaWithRequired,
} from '../../../openApi/shared/types/schema';
import { discriminatorValues } from '../../../openApi/shared/utils/discriminator';
import { isTopLevelComponent, refToName } from '../../../utils/ref';

export function getSchemaType(
  schema: OpenAPIV2.SchemaObject,
): SchemaType<OpenAPIV2.SchemaObject> | undefined {
  if (schema.type) {
    return schema.type;
  }

  // infer object based on the presence of properties
  if (schema.properties) {
    return 'object';
  }

  return;
}

function parseSchemaJsDoc({
  irSchema,
  schema,
}: {
  irSchema: IR.SchemaObject;
  schema: OpenAPIV2.SchemaObject;
}) {
  if (schema.example) {
    irSchema.example = schema.example;
  }

  if (schema.description) {
    irSchema.description = schema.description;
  }

  if (schema.title) {
    irSchema.title = schema.title;
  }
}

function parseSchemaMeta({
  irSchema,
  schema,
}: {
  irSchema: IR.SchemaObject;
  schema: OpenAPIV2.SchemaObject;
}) {
  if (schema.default !== undefined) {
    irSchema.default = schema.default;
  }

  if (schema.exclusiveMaximum) {
    if (schema.maximum !== undefined) {
      irSchema.exclusiveMaximum = schema.maximum;
    }
  } else if (schema.maximum !== undefined) {
    irSchema.maximum = schema.maximum;
  }

  if (schema.exclusiveMinimum) {
    if (schema.minimum !== undefined) {
      irSchema.exclusiveMinimum = schema.minimum;
    }
  } else if (schema.minimum !== undefined) {
    irSchema.minimum = schema.minimum;
  }

  if (schema.format) {
    irSchema.format = schema.format;
  }

  if (schema.maxItems !== undefined) {
    irSchema.maxItems = schema.maxItems;
  }

  if (schema.maxLength !== undefined) {
    irSchema.maxLength = schema.maxLength;
  }

  if (schema.minItems !== undefined) {
    irSchema.minItems = schema.minItems;
  }

  if (schema.minLength !== undefined) {
    irSchema.minLength = schema.minLength;
  }

  if (schema.pattern) {
    irSchema.pattern = schema.pattern;
  }

  if (schema.readOnly) {
    irSchema.accessScope = 'read';
  }
}

function parseArray({
  context,
  irSchema = {},
  schema,
  state,
}: {
  context: Context;
  irSchema?: IR.SchemaObject;
  schema: OpenAPIV2.SchemaObject;
  state: SchemaState;
}): IR.SchemaObject {
  if (schema.maxItems && schema.maxItems === schema.minItems) {
    irSchema.type = 'tuple';
  } else {
    irSchema.type = 'array';
  }

  let schemaItems: Array<IR.SchemaObject> = [];

  if (schema.items) {
    const irItemsSchema = schemaToIrSchema({
      context,
      schema: schema.items,
      state,
    });

    if (!schemaItems.length && schema.maxItems && schema.maxItems === schema.minItems) {
      schemaItems = Array(schema.maxItems).fill(irItemsSchema);
    } else {
      if ('$ref' in schema.items) {
        schemaItems.push(irItemsSchema);
      } else {
        const ofArray = schema.items.allOf;
        if (ofArray && ofArray.length > 1 && !schema.items['x-nullable']) {
          // bring composition up to avoid incorrectly nested arrays
          Object.assign(irSchema, irItemsSchema);
        } else {
          schemaItems.push(irItemsSchema);
        }
      }
    }
  }

  irSchema = addItemsToSchema({
    items: schemaItems,
    schema: irSchema,
  });

  return irSchema;
}

function parseBoolean({
  irSchema = {},
}: {
  context: Context;
  irSchema?: IR.SchemaObject;
  schema: OpenAPIV2.SchemaObject;
  state: SchemaState;
}): IR.SchemaObject {
  irSchema.type = 'boolean';

  return irSchema;
}

function parseNumber({
  irSchema = {},
  schema,
}: {
  context: Context;
  irSchema?: IR.SchemaObject;
  schema: SchemaWithRequired<OpenAPIV2.SchemaObject, 'type'>;
  state: SchemaState;
}): IR.SchemaObject {
  irSchema.type = schema.type;

  return irSchema;
}

function parseObject({
  context,
  irSchema = {},
  schema,
  state,
}: {
  context: Context;
  irSchema?: IR.SchemaObject;
  schema: OpenAPIV2.SchemaObject;
  state: SchemaState;
}): IR.SchemaObject {
  irSchema.type = 'object';

  let isSchemaPropertiesEmpty = true;

  if (schema.properties) {
    const schemaProperties: Record<string, IR.SchemaObject> = {};

    for (const name in schema.properties) {
      isSchemaPropertiesEmpty = false;

      const property = schema.properties[name]!;
      if (typeof property === 'boolean') {
        // TODO: parser - handle boolean properties
      } else {
        const irPropertySchema = schemaToIrSchema({
          context,
          schema: property,
          state,
        });
        schemaProperties[name] = irPropertySchema;
      }
    }

    if (!isSchemaPropertiesEmpty) {
      irSchema.properties = schemaProperties;
    }
  }

  if (schema.additionalProperties === undefined) {
    if (!irSchema.properties) {
      irSchema.additionalProperties = {
        type: 'unknown',
      };
    }
  } else if (typeof schema.additionalProperties === 'boolean') {
    // Avoid [key: string]: never for empty objects with additionalProperties: false inside allOf
    // This would override inherited properties from other schemas in the composition
    const isEmptyObjectInAllOf =
      state.inAllOf &&
      schema.additionalProperties === false &&
      (!schema.properties || isSchemaPropertiesEmpty);

    if (!isEmptyObjectInAllOf) {
      irSchema.additionalProperties = {
        type: schema.additionalProperties ? 'unknown' : 'never',
      };
    }
  } else {
    const irAdditionalPropertiesSchema = schemaToIrSchema({
      context,
      schema: schema.additionalProperties,
      state,
    });
    irSchema.additionalProperties = irAdditionalPropertiesSchema;
  }

  if (schema.required) {
    irSchema.required = schema.required;
  }

  return irSchema;
}

function parseString({
  irSchema = {},
}: {
  context: Context;
  irSchema?: IR.SchemaObject;
  schema: OpenAPIV2.SchemaObject;
  state: SchemaState;
}): IR.SchemaObject {
  irSchema.type = 'string';

  return irSchema;
}

export function parseExtensions({ source, target }: { source: object; target: object }) {
  for (const key in source) {
    if (key.startsWith('x-')) {
      (target as Record<string, unknown>)[key] = (source as Record<string, unknown>)[key];
    }
  }
}

function initIrSchema({ schema }: { schema: OpenAPIV2.SchemaObject }): IR.SchemaObject {
  const irSchema: IR.SchemaObject = {};

  parseSchemaJsDoc({
    irSchema,
    schema,
  });

  parseExtensions({
    source: schema,
    target: irSchema,
  });

  return irSchema;
}

function parseAllOf({
  context,
  schema,
  state,
}: {
  context: Context;
  schema: SchemaWithRequired<OpenAPIV2.SchemaObject, 'allOf'>;
  state: SchemaState;
}): IR.SchemaObject {
  let irSchema = initIrSchema({ schema });

  const schemaItems: Array<IR.SchemaObject> = [];
  const schemaType = getSchemaType(schema);

  const compositionSchemas = schema.allOf;

  for (const compositionSchema of compositionSchemas) {
    const originalInAllOf = state.inAllOf;
    // Don't propagate inAllOf flag to $ref schemas to avoid issues with reusable components
    if (!('$ref' in compositionSchema)) {
      state.inAllOf = true;
    }
    const irCompositionSchema = schemaToIrSchema({
      context,
      schema: compositionSchema,
      state,
    });
    state.inAllOf = originalInAllOf;

    if (schema.required) {
      if (irCompositionSchema.required) {
        irCompositionSchema.required.push(...schema.required);
      } else {
        irCompositionSchema.required = schema.required;
      }
    }

    schemaItems.push(irCompositionSchema);

    if (compositionSchema.$ref) {
      const ref = context.resolveRef<OpenAPIV2.SchemaObject>(compositionSchema.$ref);
      // `$ref` should be passed from the root `parseSchema()` call
      if (ref.discriminator && state.$ref) {
        const values = discriminatorValues(state.$ref);
        const valueSchemas: ReadonlyArray<IR.SchemaObject> = values.map((value) => ({
          const: value,
          type: 'string',
        }));
        const irDiscriminatorSchema: IR.SchemaObject = {
          properties: {
            [ref.discriminator]:
              valueSchemas.length > 1
                ? {
                    items: valueSchemas,
                    logicalOperator: 'or',
                  }
                : valueSchemas[0]!,
          },
          type: 'object',
        };
        if (ref.required?.includes(ref.discriminator)) {
          irDiscriminatorSchema.required = [ref.discriminator];
        }
        schemaItems.push(irDiscriminatorSchema);
      }
    }
  }

  if (schemaType === 'object') {
    const irObjectSchema = parseOneType({
      context,
      schema: {
        ...schema,
        type: 'object',
      },
      state,
    });

    if (irObjectSchema.properties) {
      for (const requiredProperty of irObjectSchema.required ?? []) {
        if (!irObjectSchema.properties[requiredProperty]) {
          for (const compositionSchema of compositionSchemas) {
            // TODO: parser - this could be probably resolved more accurately
            const finalCompositionSchema = compositionSchema.$ref
              ? context.resolveRef<OpenAPIV2.SchemaObject>(compositionSchema.$ref)
              : compositionSchema;

            if (getSchemaType(finalCompositionSchema) === 'object') {
              const irCompositionSchema = parseOneType({
                context,
                schema: {
                  ...finalCompositionSchema,
                  type: 'object',
                },
                state,
              });

              if (irCompositionSchema.properties?.[requiredProperty]) {
                irObjectSchema.properties[requiredProperty] =
                  irCompositionSchema.properties[requiredProperty];
                break;
              }
            }
          }
        }
      }
      schemaItems.push(irObjectSchema);
    }
  }

  irSchema = addItemsToSchema({
    items: schemaItems,
    logicalOperator: 'and',
    mutateSchemaOneItem: true,
    schema: irSchema,
  });

  if (schema['x-nullable']) {
    // nest composition to avoid producing an intersection with null
    const nestedItems: Array<IR.SchemaObject> = [
      {
        type: 'null',
      },
    ];

    if (schemaItems.length) {
      nestedItems.unshift(irSchema);
    }

    irSchema = {
      items: nestedItems,
      logicalOperator: 'or',
    };

    // TODO: parser - this is a hack to bring back up meta fields
    // without it, some schemas were missing original deprecated
    if (nestedItems[0]!.deprecated) {
      irSchema.deprecated = nestedItems[0]!.deprecated;
    }

    // TODO: parser - this is a hack to bring back up meta fields
    // without it, some schemas were missing original description
    if (nestedItems[0]!.description) {
      irSchema.description = nestedItems[0]!.description;
    }
  }

  return irSchema;
}

function parseEnum({
  context,
  schema,
  state,
}: {
  context: Context;
  schema: SchemaWithRequired<OpenAPIV2.SchemaObject, 'enum'>;
  state: SchemaState;
}): IR.SchemaObject {
  let irSchema = initIrSchema({ schema });

  parseSchemaMeta({ irSchema, schema });

  irSchema.type = 'enum';

  const schemaItems: Array<IR.SchemaObject> = [];
  const xEnumDescriptions = schema['x-enum-descriptions'];
  const xEnumVarnames = schema['x-enum-varnames'];
  const xEnumNames = schema['x-enumNames'];
  let hasNullValue = false;

  for (let index = 0, len = schema.enum.length; index < len; index++) {
    const enumValue = schema.enum[index];
    const typeOfEnumValue = typeof enumValue;
    let enumType: SchemaType<OpenAPIV2.SchemaObject> | 'null' | undefined;

    if (
      typeOfEnumValue === 'string' ||
      typeOfEnumValue === 'number' ||
      typeOfEnumValue === 'boolean'
    ) {
      enumType = typeOfEnumValue;
    } else if (typeOfEnumValue === 'object' && Array.isArray(enumValue)) {
      enumType = 'array';
    } else if (enumValue === null) {
      // nullable must be true
      if (schema['x-nullable']) {
        enumType = 'null';
        hasNullValue = true;
      }
    } else {
      console.warn(
        '🚨',
        `unhandled "${typeOfEnumValue}" typeof value "${enumValue}" for enum`,
        schema.enum,
      );
    }

    if (!enumType) {
      continue;
    }

    const irTypeSchema = parseOneType({
      context,
      schema: {
        description: xEnumDescriptions?.[index],
        title: xEnumVarnames?.[index] ?? xEnumNames?.[index],
        // cast enum to string temporarily
        type: enumType === 'null' ? 'string' : enumType,
      },
      state,
    });

    irTypeSchema.const = enumValue;

    // cast enum back
    if (enumType === 'null') {
      irTypeSchema.type = enumType;
    }

    if (irTypeSchema.type === 'array') {
      irTypeSchema.type = 'tuple';
    }

    schemaItems.push(irTypeSchema);
  }

  irSchema = addItemsToSchema({
    items: schemaItems,
    schema: irSchema,
  });

  // `x-nullable` is OAS2's convention for nullable fields (2.0 has no native
  // `nullable` keyword). schemaToIrSchema() dispatches enum schemas here
  // before ever reaching parseType()/parseNullableType(), the only other
  // place that reads it -- so without this, an enum with `x-nullable: true`
  // but no literal `null` among its values silently lost its nullability.
  if (schema['x-nullable'] && !hasNullValue) {
    irSchema = addItemsToSchema({
      items: [irSchema, { type: 'null' }],
      schema: initIrSchema({ schema }),
    });
  }

  return irSchema;
}

function parseRef({
  context,
  schema,
  state,
}: {
  context: Context;
  schema: SchemaWithRequired<OpenAPIV2.SchemaObject, '$ref'>;
  state: SchemaState;
}): IR.SchemaObject {
  const irSchema: IR.SchemaObject = {};
  // Inline non-component refs (e.g. #/paths/...) and deep path refs (e.g. #/definitions/Foo/properties/bar)
  // to avoid generating orphaned named types or referencing unregistered symbols
  const isComponentsRef = isTopLevelComponent(schema.$ref);
  if (!isComponentsRef) {
    if (!state.circularReferenceTracker.has(schema.$ref)) {
      const refSchema = context.resolveRef<OpenAPIV2.SchemaObject>(schema.$ref);
      const originalRef = state.$ref;
      state.$ref = schema.$ref;
      const irSchema = schemaToIrSchema({
        context,
        schema: refSchema,
        state,
      });
      state.$ref = originalRef;
      return irSchema;
    }
    // Fallback to preserving the ref if circular
  }

  irSchema.$ref = schema.$ref;

  // rewrite definitions refs as the internal schema follows OpenAPI 3.x syntax
  // and stores all definitions as reusable schemas
  irSchema.$ref = irSchema.$ref.replace(/#\/definitions\/([^/]+)/g, '#/components/schemas/$1');

  if (!state.circularReferenceTracker.has(schema.$ref)) {
    const refSchema = context.resolveRef<OpenAPIV2.SchemaObject>(schema.$ref);
    const originalRef = state.$ref;
    state.$ref = schema.$ref;
    schemaToIrSchema({
      context,
      schema: refSchema,
      state,
    });
    state.$ref = originalRef;
  }

  return irSchema;
}

function parseNullableType({
  context,
  irSchema,
  schema,
  state,
}: {
  context: Context;
  irSchema?: IR.SchemaObject;
  schema: SchemaWithRequired<OpenAPIV2.SchemaObject, 'type'>;
  state: SchemaState;
}): IR.SchemaObject {
  if (!irSchema) {
    irSchema = initIrSchema({ schema });
  }

  const typeIrSchema: IR.SchemaObject = {};

  parseSchemaMeta({ irSchema: typeIrSchema, schema });

  if (typeIrSchema.default === null) {
    // clear to avoid duplicate default inside the non-null schema.
    // this would produce incorrect validator output
    delete typeIrSchema.default;
  }

  const schemaItems: Array<IR.SchemaObject> = [
    parseOneType({
      context,
      irSchema: typeIrSchema,
      schema,
      state,
    }),
    {
      type: 'null',
    },
  ];

  irSchema = addItemsToSchema({
    items: schemaItems,
    schema: irSchema,
  });

  return irSchema;
}

function parseType({
  context,
  schema,
  state,
}: {
  context: Context;
  schema: SchemaWithRequired<OpenAPIV2.SchemaObject, 'type'>;
  state: SchemaState;
}): IR.SchemaObject {
  const irSchema = initIrSchema({ schema });

  parseSchemaMeta({ irSchema, schema });

  const type = getSchemaType(schema);

  if (!type) {
    return irSchema;
  }

  if (schema['x-nullable']) {
    return parseNullableType({
      context,
      irSchema,
      schema: {
        ...schema,
        type,
      },
      state,
    });
  }

  return parseOneType({
    context,
    irSchema,
    schema: {
      ...schema,
      type,
    },
    state,
  });
}

function parseOneType({
  context,
  irSchema,
  schema,
  state,
}: {
  context: Context;
  irSchema?: IR.SchemaObject;
  schema: SchemaWithRequired<OpenAPIV2.SchemaObject, 'type'>;
  state: SchemaState;
}): IR.SchemaObject {
  if (!irSchema) {
    irSchema = initIrSchema({ schema });

    parseSchemaMeta({ irSchema, schema });
  }

  switch (schema.type) {
    case 'array':
      return parseArray({
        context,
        irSchema,
        schema,
        state,
      });
    case 'boolean':
      return parseBoolean({
        context,
        irSchema,
        schema,
        state,
      });
    case 'integer':
    case 'number':
      return parseNumber({
        context,
        irSchema,
        schema,
        state,
      });
    case 'object':
      return parseObject({
        context,
        irSchema,
        schema,
        state,
      });
    case 'string':
      return parseString({
        context,
        irSchema,
        schema,
        state,
      });
    default:
      // gracefully handle invalid type
      return parseUnknown({
        context,
        irSchema,
        schema,
      });
  }
}

function parseUnknown({
  irSchema,
  schema,
}: {
  context: Context;
  irSchema?: IR.SchemaObject;
  schema: OpenAPIV2.SchemaObject;
}): IR.SchemaObject {
  if (!irSchema) {
    irSchema = initIrSchema({ schema });
  }

  irSchema.type = 'unknown';

  parseSchemaMeta({ irSchema, schema });

  return irSchema;
}

export function schemaToIrSchema({
  context,
  schema,
  state,
}: {
  context: Context;
  schema: OpenAPIV2.SchemaObject;
  state: SchemaState | undefined;
}): IR.SchemaObject {
  if (!state) {
    state = {
      circularReferenceTracker: new Set(),
    };
  }

  if (state.$ref) {
    state.circularReferenceTracker.add(state.$ref);
  }

  if (schema.$ref) {
    return parseRef({
      context,
      schema: schema as SchemaWithRequired<OpenAPIV2.SchemaObject, '$ref'>,
      state,
    });
  }

  if (schema.enum) {
    return parseEnum({
      context,
      schema: schema as SchemaWithRequired<OpenAPIV2.SchemaObject, 'enum'>,
      state,
    });
  }

  if (schema.allOf) {
    return parseAllOf({
      context,
      schema: schema as SchemaWithRequired<OpenAPIV2.SchemaObject, 'allOf'>,
      state,
    });
  }

  // infer object based on the presence of properties
  if (schema.type || schema.properties) {
    return parseType({
      context,
      schema: schema as SchemaWithRequired<OpenAPIV2.SchemaObject, 'type'>,
      state,
    });
  }

  return parseUnknown({ context, schema });
}

export function parseSchema({
  $ref,
  context,
  schema,
}: {
  $ref: string;
  context: Context;
  schema: OpenAPIV2.SchemaObject;
}) {
  if (!context.ir.components) {
    context.ir.components = {};
  }

  if (!context.ir.components.schemas) {
    context.ir.components.schemas = {};
  }

  context.ir.components.schemas[refToName($ref)] = schemaToIrSchema({
    context,
    schema,
    state: {
      $ref,
      circularReferenceTracker: new Set(),
    },
  });
}
