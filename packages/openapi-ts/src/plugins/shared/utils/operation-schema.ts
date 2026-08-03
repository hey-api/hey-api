import type { IR } from '@hey-api/shared';

export interface OperationSchemaResult {
  required: ReadonlyArray<string>;
  schema: IR.SchemaObject;
}

export function buildOperationSchema(operation: IR.OperationObject): OperationSchemaResult {
  const requiredProperties = new Set<string>();

  const schema: IR.SchemaObject = {
    properties: {
      body: { type: 'never' },
      path: { type: 'never' },
      query: { type: 'never' },
    },
    type: 'object',
  };

  if (operation.parameters) {
    // TODO: add support for cookies

    for (const location of ['header', 'path', 'query'] satisfies ReadonlyArray<
      keyof typeof operation.parameters
    >) {
      const params = operation.parameters[location];
      if (!params) continue;

      const properties: Record<string, IR.SchemaObject> = {};
      const required: Array<string> = [];
      const propKey = location === 'header' ? 'headers' : location;

      for (const key in params) {
        const parameter = params[key]!;
        properties[parameter.name] = parameter.schema;
        if (parameter.required) {
          required.push(parameter.name);
          requiredProperties.add(propKey);
        }
      }

      if (Object.keys(properties).length) {
        schema.properties![propKey] = { properties, required, type: 'object' };
      }
    }
  }

  if (operation.body) {
    schema.properties!.body = operation.body.schema;
    if (operation.body.required) {
      requiredProperties.add('body');
    }
  }

  schema.required = [...requiredProperties];

  return { required: schema.required, schema };
}
