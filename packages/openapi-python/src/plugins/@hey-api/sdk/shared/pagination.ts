import type { Symbol } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { operationPagination, operationResponsesMap } from '@hey-api/shared';

import type { HeyApiSdkPlugin } from '../types';

export type OperationPagination = {
  /** The response field reporting whether another page exists. */
  hasMore: string;
  /** The item type, so the page is typed as `Page[Item]`. */
  itemSymbol: Symbol;
  /** The response field holding the items of the page. */
  items: string;
  /** The response field the next request's value is read from. */
  next: string;
  /** The request parameter that carries that value back. */
  parameter: string;
  /** Whether that value is sent as it is, or counted up by one. */
  style: 'cursor' | 'pageNumber';
};

/** The parameter that continues the list, as the operation declares it. */
function continuationParameter({
  location,
  name,
  operation,
}: {
  location: keyof IR.ParametersObject;
  name: string;
  operation: IR.OperationObject;
}): IR.ParameterObject | undefined {
  const parameters = operation.parameters?.[location];
  for (const key in parameters) {
    if (parameters[key]!.name === name) {
      return parameters[key];
    }
  }
  return undefined;
}

function property({
  field,
  plugin,
  schema,
}: {
  field: string;
  plugin: HeyApiSdkPlugin['Instance'];
  schema: IR.SchemaObject;
}): IR.SchemaObject | undefined {
  const resolved = schema.$ref ? plugin.context.resolveIrRef<IR.SchemaObject>(schema.$ref) : schema;
  return resolved.properties?.[field];
}

/**
 * How this operation pages, or nothing when it does not page in a way the
 * generator can express.
 *
 * The request parameter comes from the parser, which already marks a
 * pagination parameter. The response side is named in the plugin config,
 * since nothing in the spec identifies which field holds the items.
 */
export function operationPaginationInfo({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
}): OperationPagination | undefined {
  const config = plugin.config.pagination;
  if (!config) return;

  const pagination = operationPagination({ context: plugin.context, operation });
  if (!pagination || pagination.in === 'body') return;
  const location: keyof IR.ParametersObject = pagination.in;

  const parameter = continuationParameter({ location, name: pagination.name, operation });
  // A required continuation parameter would leave the method without a default
  // for it, so the first page could not be asked for.
  if (!parameter || parameter.required) return;

  const { response } = operationResponsesMap(operation);
  if (!response) return;

  const items = property({ field: config.items, plugin, schema: response });
  if (items?.type !== 'array') return;

  const item = items.items?.[0];
  if (!item?.$ref) return;

  // An integer continues a list by counting up, anything else by carrying a
  // value the response hands back.
  const style = parameter.schema.type === 'integer' ? 'pageNumber' : 'cursor';
  const next = style === 'pageNumber' ? config.pageNumber : config.nextCursor;
  if (!next) return;

  // Reading a field the model does not declare would raise at the call, so an
  // operation missing either field pages the way it did before.
  for (const field of [config.hasMore, next]) {
    if (!property({ field, plugin, schema: response })) return;
  }

  return {
    hasMore: config.hasMore,
    itemSymbol: plugin.referenceSymbol({ category: 'schema', resourceId: item.$ref }),
    items: config.items,
    next,
    parameter: pagination.name,
    style,
  };
}
