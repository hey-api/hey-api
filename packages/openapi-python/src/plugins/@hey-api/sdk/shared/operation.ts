import type { Symbol } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';

import { $ } from '../../../../py-dsl';
import type { HeyApiSdkPlugin } from '../types';
import { getSignatureParameters } from './signature';

type OperationParameters = {
  bodyRef?: string;
  fields: Array<{
    in: string;
    key: string;
    map?: string;
  }>;
  parameters: Array<ReturnType<typeof $.param>>;
};

const PYTHON_BUILTIN_TYPES: Record<string, string> = {
  array: 'list',
  boolean: 'bool',
  integer: 'int',
  number: 'float',
  object: 'dict',
  string: 'str',
};

function schemaToPythonType(
  schema: IR.SchemaObject,
  plugin: HeyApiSdkPlugin['Instance'],
): ReturnType<typeof $.expr | typeof $.subscript> | Symbol {
  if (schema.$ref) {
    // TODO: contract (?)
    return plugin.referenceSymbol({
      category: 'schema',
      resourceId: schema.$ref,
    });
  }

  if (schema.type === 'array') {
    const itemsSchema = schema.items?.[0];
    const itemType = itemsSchema
      ? schemaToPythonType(itemsSchema, plugin)
      : plugin.imports.typing.Any;
    return $('list').slice(itemType);
  }

  if (schema.type === 'object' || schema.additionalProperties) {
    if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      const valueType = schemaToPythonType(schema.additionalProperties, plugin);
      return $('dict').slice('str', valueType);
    }
    return $('dict').slice('str', plugin.imports.typing.Any);
  }

  if (schema.type === 'tuple') {
    const itemsSchema = schema.items;
    const itemTypes = itemsSchema
      ? itemsSchema.map((item) => schemaToPythonType(item, plugin))
      : [];
    return $('tuple').slice(...itemTypes);
  }

  const builtinType = schema.type ? PYTHON_BUILTIN_TYPES[schema.type] : undefined;
  return $(builtinType ?? plugin.imports.typing.Any);
}

export function operationParameters({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
}): OperationParameters {
  const result: OperationParameters = {
    fields: [],
    parameters: [],
  };

  if (plugin.config.paramsStructure === 'flat') {
    const signature = getSignatureParameters({ operation, plugin });
    if (!signature) return result;

    result.bodyRef = signature.bodyRef;
    result.fields = signature.fields;

    const paramEntries = Object.entries(signature.parameters).sort(([, valueA], [, valueB]) =>
      valueA.isRequired === valueB.isRequired ? 0 : valueA.isRequired ? -1 : 1,
    );

    for (const [paramName, param] of paramEntries) {
      const type = schemaToPythonType(param.schema, plugin);

      if (param.isRequired) {
        result.parameters.push($.param(paramName).type(type));
      } else {
        result.parameters.push($.param(paramName).type($.type.or(type, 'None')).default('None'));
      }
    }
  }

  return result;
}
