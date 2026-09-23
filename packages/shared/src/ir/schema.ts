import type { IR } from './types';

/**
 * Ensure we don't produce redundant types, e.g., string | string.
 */
export function deduplicateSchema<T extends IR.SchemaObject>({
  detectFormat = true,
  schema,
}: {
  detectFormat?: boolean;
  schema: T;
}): T {
  if (!schema.items) {
    return schema;
  }

  const uniqueItems: Array<IR.SchemaObject> = [];
  const typeIds: Array<string> = [];

  for (const item of schema.items) {
    // an `unknown` member adds no constraints to an intersection, drop it.
    // dropping it unconditionally is what lets the composition's own metadata
    // survive: keeping a lone one lifts it, and the `result.type === 'unknown'`
    // branch below then discards the whole schema
    if (schema.logicalOperator === 'and' && item.type === 'unknown') {
      continue;
    }

    // skip nested schemas for now, handle if necessary
    if ((!item.type && item.items) || schema.type === 'tuple') {
      uniqueItems.push(item);
      continue;
    }

    if (
      // no `type` might still include `$ref` or `const`
      !item.type ||
      item.type === 'boolean' ||
      item.type === 'integer' ||
      item.type === 'null' ||
      item.type === 'number' ||
      item.type === 'string' ||
      item.type === 'unknown' ||
      item.type === 'void'
    ) {
      // const needs namespace to handle empty string values, otherwise
      // fallback would equal an actual value and we would skip an item
      const constant = item.const !== undefined ? `const-${item.const}` : '';
      const format = item.format !== undefined && detectFormat ? `format-${item.format}` : '';

      // Include validation constraints in the type ID to avoid incorrect deduplication
      const constraints = [
        item.minLength !== undefined ? `minLength-${item.minLength}` : '',
        item.maxLength !== undefined ? `maxLength-${item.maxLength}` : '',
        item.minimum !== undefined ? `minimum-${item.minimum}` : '',
        item.maximum !== undefined ? `maximum-${item.maximum}` : '',
        item.exclusiveMinimum !== undefined ? `exclusiveMinimum-${item.exclusiveMinimum}` : '',
        item.exclusiveMaximum !== undefined ? `exclusiveMaximum-${item.exclusiveMaximum}` : '',
        item.minItems !== undefined ? `minItems-${item.minItems}` : '',
        item.maxItems !== undefined ? `maxItems-${item.maxItems}` : '',
        item.pattern !== undefined ? `pattern-${item.pattern}` : '',
      ].join('');

      const typeId = `${item.$ref ?? ''}${item.type ?? ''}${constant}${format}${constraints}`;
      if (!typeIds.includes(typeId)) {
        typeIds.push(typeId);
        uniqueItems.push(item);
      }
      continue;
    }

    uniqueItems.push(item);
  }

  const result = { ...schema };

  if (
    uniqueItems.length <= 1 &&
    result.type !== 'array' &&
    result.type !== 'enum' &&
    result.type !== 'tuple'
  ) {
    // bring the only item up to clean up the schema
    const liftedSchema = uniqueItems[0];
    result.items = undefined;
    result.logicalOperator = undefined;

    Object.assign(result, liftedSchema);
  } else {
    result.items = uniqueItems;
  }

  // exclude unknown if it's the only type left
  if (result.type === 'unknown') {
    return {} as T;
  }

  return result;
}
