import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import type { Context } from '../../../ir/context';
import type { IR } from '../../../ir/types';
import { refToName } from '../../../utils/ref';
import { mediaTypeObjects } from './mediaType';
import { paginationField } from './pagination';
import { parseExtensions, schemaToIrSchema } from './schema';

/**
 * Returns default parameter `allowReserved` based on value of `in`.
 */
function defaultAllowReserved(_in: OpenAPIV3_1.ParameterObject['in']): boolean | undefined {
  switch (_in) {
    // this keyword only applies to parameters with an `in` value of `query`
    case 'query':
      return false;
    default:
      return;
  }
}

/**
 * Returns default parameter `explode` based on value of `style`.
 */
function defaultExplode(style: Required<OpenAPIV3_1.ParameterObject>['style']): boolean {
  switch (style) {
    // default value for `deepObject` is `false`, but that behavior is undefined
    // so we use `true` to make this work with the `client-fetch` package
    case 'deepObject':
    case 'form':
      return true;
    default:
      return false;
  }
}

/**
 * Returns default parameter `style` based on value of `in`.
 */
function defaultStyle(
  _in: OpenAPIV3_1.ParameterObject['in'],
): Required<OpenAPIV3_1.ParameterObject>['style'] {
  switch (_in) {
    case 'header':
    case 'path':
      return 'simple';
    case 'cookie':
    case 'query':
      return 'form';
  }
}

export function parametersArrayToObject({
  context,
  parameters,
}: {
  context: Context;
  parameters?: ReadonlyArray<OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject>;
}): IR.ParametersObject | undefined {
  if (!parameters || !Object.keys(parameters).length) {
    return;
  }

  const parametersObject: IR.ParametersObject = {};

  for (const parameterOrReference of parameters) {
    const parameter =
      '$ref' in parameterOrReference
        ? context.dereference<OpenAPIV3_1.ParameterObject>(parameterOrReference)
        : parameterOrReference;

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
  parameter: OpenAPIV3_1.ParameterObject;
}): IR.ParameterObject {
  // TODO: parser - fix
  let schema = parameter.schema;

  if (!schema) {
    const contents = mediaTypeObjects({ content: parameter.content });
    // TODO: add support for multiple content types, for now prefer JSON
    const content = contents.find((content) => content.type === 'json') || contents[0];
    if (content) {
      schema = content.schema;
    }
  }

  const finalSchema: OpenAPIV3_1.SchemaObject = {
    deprecated: parameter.deprecated,
    description: parameter.description,
    ...schema,
  };

  const pagination = paginationField({
    context,
    name: parameter.name,
    schema: finalSchema,
  });

  const style = parameter.style || defaultStyle(parameter.in);
  const explode = parameter.explode !== undefined ? parameter.explode : defaultExplode(style);
  const allowReserved =
    parameter.allowReserved !== undefined
      ? parameter.allowReserved
      : defaultAllowReserved(parameter.in);

  const irParameter: IR.ParameterObject = {
    allowReserved,
    explode,
    location: parameter.in,
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

  if (parameter.deprecated) {
    irParameter.deprecated = parameter.deprecated;
  }

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

export function parseParameter({
  $ref,
  context,
  parameter,
}: {
  $ref: string;
  context: Context;
  parameter: OpenAPIV3_1.ParameterObject;
}) {
  if (!context.ir.components) {
    context.ir.components = {};
  }

  if (!context.ir.components.parameters) {
    context.ir.components.parameters = {};
  }

  context.ir.components.parameters[refToName($ref)] = parameterToIrParameter({
    $ref,
    context,
    parameter,
  });
}
