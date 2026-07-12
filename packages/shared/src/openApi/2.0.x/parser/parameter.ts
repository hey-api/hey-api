import type { OpenAPIV2 } from '@hey-api/spec-types';

import type { Context } from '../../../ir/context';
import type { IR } from '../../../ir/types';
import { paginationField } from './pagination';
import { parseExtensions, schemaToIrSchema } from './schema';

type Parameter = Exclude<OpenAPIV2.ParameterObject, { in: 'body' }>;

/**
 * Returns default parameter `explode` based on value of `collectionFormat`.
 */
function defaultExplode(collectionFormat: Parameter['collectionFormat']): boolean {
  switch (collectionFormat) {
    case 'multi':
      return true;
    case 'csv':
    case 'pipes':
    case 'ssv':
    case 'tsv':
    default:
      return false;
  }
}

/**
 * Returns default parameter `style` based on value of `in`.
 */
function defaultStyle(_in: Parameter['in']): Required<IR.ParameterObject>['style'] {
  switch (_in) {
    case 'header':
    case 'path':
      return 'simple';
    case 'query':
    default:
      return 'form';
  }
}

export function parametersArrayToObject({
  context,
  operation,
  parameters,
}: {
  context: Context;
  operation: OpenAPIV2.OperationObject;
  parameters?: ReadonlyArray<OpenAPIV2.ParameterObject | OpenAPIV2.ReferenceObject>;
}): IR.ParametersObject | undefined {
  if (!parameters || !Object.keys(parameters).length) {
    return;
  }

  const parametersObject: IR.ParametersObject = {};

  for (const parameterOrReference of parameters) {
    const parameter =
      '$ref' in parameterOrReference
        ? context.dereference<OpenAPIV2.ParameterObject>(parameterOrReference)
        : parameterOrReference;

    // push request body parameters into a separate field
    if (parameter.in === 'body' || parameter.in === 'formData') {
      // @ts-expect-error
      if (!operation.requestBody) {
        // @ts-expect-error
        operation.requestBody = [];
      }

      // @ts-expect-error
      operation.requestBody.push(parameter);
      continue;
    }

    if (!parametersObject[parameter.in]) {
      parametersObject[parameter.in] = {};
    }

    // lowercase keys for case insensitive access
    parametersObject[parameter.in]![parameter.name.toLocaleLowerCase()] = parameterToIrParameter({
      $ref: `#/todo/real/path/to/parameter/${parameter.name}`,
      context,
      parameter,
    });
  }

  return parametersObject;
}

function parameterToIrParameter({
  $ref,
  context,
  parameter,
}: {
  $ref: string;
  context: Context;
  parameter: Parameter;
}): IR.ParameterObject {
  const schema = parameter;

  const finalSchema: OpenAPIV2.SchemaObject =
    schema && '$ref' in schema
      ? {
          allOf: [
            {
              ...schema,
              $ref: schema.$ref as string,
              required: Array.isArray(schema.required) ? schema.required : [],
              type: schema.type as OpenAPIV2.SchemaObject['type'],
            },
          ],
          description: parameter.description,
        }
      : {
          description: parameter.description,
          ...schema,
          required: Array.isArray(schema.required) ? schema.required : [],
          type: schema.type as OpenAPIV2.SchemaObject['type'],
        };

  const pagination = paginationField({
    context,
    name: parameter.name,
    schema: finalSchema,
  });

  const style = defaultStyle(parameter.in);
  const explode = defaultExplode(parameter.collectionFormat);
  const allowReserved = false;

  const irParameter: IR.ParameterObject = {
    allowReserved,
    explode,
    location: parameter.in as IR.ParameterObject['location'],
    name: parameter.name,
    schema: schemaToIrSchema({
      context,
      schema: finalSchema,
      state: {
        $ref,
        circularReferenceTracker: new Set(),
      },
    }),
    style,
  };

  if (parameter.description) {
    irParameter.description = parameter.description;
  }

  if (pagination) {
    irParameter.pagination = pagination;
  }

  if (parameter.required) {
    irParameter.required = parameter.required;
  }

  parseExtensions({
    source: parameter,
    target: irParameter,
  });

  return irParameter;
}
