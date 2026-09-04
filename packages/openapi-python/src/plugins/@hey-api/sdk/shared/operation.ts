import type { Symbol } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { mediaTypeToIrMediaType, operationResponsesMap, statusCodeToGroup } from '@hey-api/shared';

import { $ } from '../../../../py-dsl';
import type { HeyApiSdkPlugin } from '../types';
import { getSignatureParameters } from './signature';

type ResponseParseAs = 'content' | 'json' | 'text';

export type OperationResponse =
  | { kind: 'model'; parseAs: ResponseParseAs; symbol: Symbol }
  | { kind: 'none' }
  | { kind: 'raw' };

function mediaTypeToParseAs(mediaType: string): ResponseParseAs {
  const irMediaType = mediaTypeToIrMediaType({ mediaType });
  if (irMediaType === 'json') return 'json';
  if (irMediaType === 'text') return 'text';
  return 'content';
}

// The pydantic plugin's resolvers leave these shapes as a `TypeAlias`, which
// has no `model_validate`. See `intersectionToType` and `numberToType`.
function isUnparsableTopLevelSchema(schema: IR.SchemaObject): boolean {
  if (schema.logicalOperator === 'and' && (schema.items?.length ?? 0) > 1) {
    return true;
  }

  return (
    !schema.$ref &&
    (schema.type === 'enum' || schema.type === 'integer' || schema.type === 'number')
  );
}

/** The schema a `$ref` points at, or nothing when it cannot be resolved. */
function resolveIrRef({
  $ref,
  plugin,
}: {
  $ref: string;
  plugin: HeyApiSdkPlugin['Instance'];
}): IR.SchemaObject | undefined {
  try {
    return plugin.context.resolveIrRef<IR.SchemaObject>($ref);
  } catch {
    return undefined;
  }
}

export function operationResponse({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
}): OperationResponse {
  if (!operation.responses) {
    return { kind: 'raw' };
  }

  const successResponses = Object.keys(operation.responses)
    .filter((statusCode) => statusCodeToGroup({ statusCode }) === '2XX')
    .map((statusCode) => operation.responses![statusCode]!);

  if (!successResponses.length) {
    return { kind: 'raw' };
  }

  // An `unknown` schema with a media type is a declared body, not a no-body
  // response.
  const bodyResponses = successResponses.filter(
    (response) => response.schema.type !== 'void' && response.mediaType,
  );

  if (!bodyResponses.length) {
    return { kind: 'none' };
  }

  const mediaTypes = new Set(bodyResponses.map((response) => response.mediaType));

  // Different media types cannot share one way of reading the body.
  if (mediaTypes.size !== 1) {
    return { kind: 'raw' };
  }

  const { response } = operationResponsesMap(operation);

  if (!response || isUnparsableTopLevelSchema(response)) {
    return { kind: 'raw' };
  }

  const parseAs = mediaTypeToParseAs(bodyResponses[0]!.mediaType!);

  // A response declared as nothing but a `$ref` is that component. Returning
  // the component's own model lets a caller read its fields, instead of
  // unwrapping a per-operation `RootModel` that holds it and nothing else.
  // This is what the TypeScript SDK does, where such a response is typed as
  // the referenced schema.
  if (response.$ref) {
    const target = resolveIrRef({ $ref: response.$ref, plugin });
    if (target && !isUnparsableTopLevelSchema(target)) {
      return {
        kind: 'model',
        parseAs,
        symbol: plugin.referenceSymbol({
          category: 'schema',
          resourceId: response.$ref,
        }),
      };
    }
  }

  const symbol = plugin.querySymbol({
    category: 'schema',
    resource: 'operation',
    resourceId: operation.id,
    role: 'responses',
  });

  if (!symbol) {
    return { kind: 'raw' };
  }

  return { kind: 'model', parseAs, symbol };
}

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
    const signature = getSignatureParameters({ operation });
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
