import type { IR } from '@hey-api/shared';
import { refToName, toCase } from '@hey-api/shared';

import { safeRuntimeName } from '../../../../py-dsl/utils/name';

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
  in: Location | 'headers';
  key: string;
  map?: string;
};

type Signature = {
  bodyRef?: string;
  fields: Field[];
  parameters: SignatureParameters;
};

// `X-Foo` and `X_Foo` both convert to `x_foo`, so a taken name gets a suffix.
function toPythonName(name: string, taken: SignatureParameters): string {
  let pythonName = safeRuntimeName(toCase(name, 'snake_case'));
  while (Object.hasOwn(taken, pythonName)) {
    pythonName = `${pythonName}_`;
  }
  return pythonName;
}

export function getSignatureParameters({
  operation,
}: {
  operation: IR.OperationObject;
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

  if (operation.body) {
    if (
      !operation.body.schema.logicalOperator &&
      operation.body.schema.type === 'object' &&
      operation.body.schema.properties
    ) {
      const properties = operation.body.schema.properties;
      for (const key in properties) {
        addParameter(key, 'body');
      }
    } else if (operation.body.schema.$ref) {
      const name = refToName(operation.body.schema.$ref);
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
        const name = toPythonName(
          conflicts.has(originalName) ? `${location}_${originalName}` : originalName,
          signatureParameters,
        );
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

  if (operation.body) {
    const location = 'body';
    if (
      !operation.body.schema.logicalOperator &&
      operation.body.schema.type === 'object' &&
      operation.body.schema.properties
    ) {
      const properties = operation.body.schema.properties;
      for (const originalName in properties) {
        const property = properties[originalName]!;
        const name = toPythonName(
          conflicts.has(originalName) ? `${location}_${originalName}` : originalName,
          signatureParameters,
        );
        const signatureParameter: SignatureParameter = {
          in: location,
          isRequired: operation.body.schema.required?.includes(originalName) ?? false,
          name,
          schema: property,
        };
        if (name !== originalName) {
          signatureParameter.originalName = originalName;
        }
        signatureParameters[name] = signatureParameter;
        fields.push({
          in: location,
          key: name,
          ...(name !== originalName ? { map: originalName } : {}),
        });
      }
    } else if (operation.body.schema.$ref) {
      const value = refToName(operation.body.schema.$ref);
      const originalName = toCase(value, 'snake_case');
      const name = toPythonName(
        conflicts.has(originalName) ? `${location}_${originalName}` : originalName,
        signatureParameters,
      );
      bodyRef = toCase(value, 'PascalCase');
      const signatureParameter: SignatureParameter = {
        in: location,
        isRequired: operation.body.required ?? false,
        name,
        schema: operation.body.schema,
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
        schema: operation.body.schema,
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
