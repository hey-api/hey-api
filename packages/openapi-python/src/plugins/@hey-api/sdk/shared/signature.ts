import type { IR } from '@hey-api/shared';
import { refToName, toCase } from '@hey-api/shared';

type Location = keyof IR.ParametersObject | 'body';

type SignatureParameter = {
  in: Location;
  isRequired: boolean;
  name: string;
  originalName?: string;
  schema: IR.SchemaObject;
};

type SignatureParameters = Record<string, SignatureParameter>;

type Field = {
  array?: boolean;
  binary?: boolean;
  in: Location | 'headers' | 'multipart';
  key: string;
  map?: string;
};

type Signature = {
  bodyRef?: string;
  fields: Field[];
  parameters: SignatureParameters;
};

export function getSignatureParameters({
  operation,
  resolveSchema,
}: {
  operation: IR.OperationObject;
  resolveSchema: (schema: IR.SchemaObject) => IR.SchemaObject;
}): Signature | undefined {
  const locations = ['header', 'path', 'query'] as const satisfies ReadonlyArray<Location>;
  const nameToLocations: Record<string, Set<Location>> = {};

  const addParameter = (name: string, location: Location): void => {
    if (!nameToLocations[name]) {
      nameToLocations[name] = new Set();
    }
    nameToLocations[name]!.add(location);
  };

  for (const location of locations) {
    const parameters = operation.parameters?.[location];
    if (parameters) {
      for (const key in parameters) {
        const parameter = parameters[key]!;
        addParameter(parameter.name, location);
      }
    }
  }

  const bodySchema =
    operation.body?.type === 'form-data'
      ? resolveSchema(operation.body.schema)
      : operation.body?.schema;

  if (
    operation.body?.type === 'form-data' &&
    (bodySchema?.logicalOperator || bodySchema?.type !== 'object' || !bodySchema.properties)
  ) {
    throw new Error(
      `Unsupported multipart body for ${operation.method.toUpperCase()} ${operation.path}: expected an object schema with properties.`,
    );
  }

  if (operation.body && bodySchema) {
    if (!bodySchema.logicalOperator && bodySchema.type === 'object' && bodySchema.properties) {
      const properties = bodySchema.properties;
      for (const key in properties) {
        addParameter(key, 'body');
      }
    } else if (bodySchema.$ref) {
      const name = refToName(bodySchema.$ref);
      const key = toCase(name, 'snake_case');
      addParameter(key, 'body');
    } else {
      addParameter('body', 'body');
    }
  }

  const conflicts = new Set<string>();
  for (const name in nameToLocations) {
    if (nameToLocations[name]!.size > 1) {
      conflicts.add(name);
    }
  }

  const signatureParameters: SignatureParameters = {};
  const fields: Field[] = [];

  for (const location of locations) {
    const parameters = operation.parameters?.[location];
    if (parameters) {
      for (const key in parameters) {
        const parameter = parameters[key]!;
        const originalName = parameter.name;
        const name = conflicts.has(originalName) ? `${location}_${originalName}` : originalName;
        const signatureParameter: SignatureParameter = {
          in: location,
          isRequired: parameter.required ?? false,
          name,
          schema: parameter.schema,
        };
        if (name !== originalName) {
          signatureParameter.originalName = originalName;
        }
        signatureParameters[name] = signatureParameter;
        fields.push({
          in: location === 'header' ? 'headers' : location,
          key: name,
          ...(name !== originalName ? { map: originalName } : {}),
        });
      }
    }
  }

  let bodyRef: string | undefined;

  if (operation.body && bodySchema) {
    const location = 'body';
    if (!bodySchema.logicalOperator && bodySchema.type === 'object' && bodySchema.properties) {
      const properties = bodySchema.properties;
      for (const originalName in properties) {
        const property = properties[originalName]!;
        const name = conflicts.has(originalName) ? `${location}_${originalName}` : originalName;
        const resolvedProperty = resolveSchema(property);
        const binaryItem =
          resolvedProperty.type === 'array' && resolvedProperty.items?.[0]
            ? resolveSchema(resolvedProperty.items[0])
            : undefined;
        const binaryArray = binaryItem?.type === 'string' && binaryItem.format === 'binary';
        const binary =
          operation.body.type === 'form-data' &&
          ((resolvedProperty.type === 'string' && resolvedProperty.format === 'binary') ||
            binaryArray);
        const signatureParameter: SignatureParameter = {
          in: location,
          isRequired: bodySchema.required?.includes(originalName) ?? false,
          name,
          schema: property,
        };
        if (name !== originalName) {
          signatureParameter.originalName = originalName;
        }
        signatureParameters[name] = signatureParameter;
        fields.push({
          in: operation.body.type === 'form-data' ? 'multipart' : location,
          key: name,
          ...(binary ? { binary: true } : {}),
          ...(operation.body.type === 'form-data' && resolvedProperty.type === 'array'
            ? { array: true }
            : {}),
          ...(name !== originalName ? { map: originalName } : {}),
        });
      }
    } else if (bodySchema.$ref) {
      const value = refToName(bodySchema.$ref);
      const originalName = toCase(value, 'snake_case');
      const name = conflicts.has(originalName) ? `${location}_${originalName}` : originalName;
      bodyRef = toCase(value, 'PascalCase');
      const signatureParameter: SignatureParameter = {
        in: location,
        isRequired: operation.body.required ?? false,
        name,
        schema: bodySchema,
      };
      if (name !== originalName) {
        signatureParameter.originalName = originalName;
      }
      signatureParameters[name] = signatureParameter;
      fields.push({
        in: location,
        key: name,
        map: 'body',
      });
    } else {
      signatureParameters.body = {
        in: location,
        isRequired: operation.body.required ?? false,
        name: 'body',
        schema: bodySchema,
      };
      fields.push({
        in: location,
        key: 'body',
        map: 'body',
      });
    }
  }

  if (!Object.keys(signatureParameters).length) {
    return;
  }

  return { bodyRef, fields, parameters: signatureParameters };
}
