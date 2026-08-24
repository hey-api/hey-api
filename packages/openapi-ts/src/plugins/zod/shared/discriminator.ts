import type { IR } from '@hey-api/shared';

import { ZodContracts } from '../contracts';
import type { ZodPlugin } from '../types';
import type { ZodMeta, ZodResult } from './types';

function isRecordShaped(schema: IR.SchemaObject | undefined): boolean {
  if (!schema || schema.type !== 'object') return false;
  const hasProperties = schema.properties && Object.keys(schema.properties).length > 0;
  return !hasProperties && Boolean(schema.additionalProperties);
}

function hasPropertyCountConstraints({
  resolveIrRef,
  schema,
  visited = new Set<IR.SchemaObject>(),
}: {
  resolveIrRef: (ref: string) => IR.SchemaObject | undefined;
  schema: IR.SchemaObject | undefined;
  visited?: Set<IR.SchemaObject>;
}): boolean {
  if (!schema || visited.has(schema)) return false;
  visited.add(schema);

  if (schema.minProperties !== undefined || schema.maxProperties !== undefined) {
    return true;
  }

  if (schema.$ref) {
    return hasPropertyCountConstraints({
      resolveIrRef,
      schema: resolveIrRef(schema.$ref),
      visited,
    });
  }

  if (schema.logicalOperator === 'and' && schema.items?.length === 1) {
    return hasPropertyCountConstraints({
      resolveIrRef,
      schema: schema.items[0],
      visited,
    });
  }

  return false;
}

export function shouldFallBackToUnion({
  childResults,
  parentSchema,
  plugin,
  schemas,
}: {
  childResults: ReadonlyArray<ZodResult>;
  parentSchema: IR.SchemaObject;
  plugin: ZodPlugin['Instance'];
  schemas: ReadonlyArray<IR.SchemaObject>;
}): boolean {
  if (!parentSchema.discriminator) return false;

  for (let index = 0; index < schemas.length; index++) {
    const schema = schemas[index]!;
    if (schema.type === 'null' || schema.const === null) continue;

    const ref = schema.$ref;
    if (!ref) continue;

    let resolved: IR.SchemaObject | undefined;
    try {
      resolved = plugin.context.resolveIrRef<IR.SchemaObject>(ref);
    } catch {
      continue;
    }

    if (
      hasPropertyCountConstraints({
        resolveIrRef: (propertyRef) => {
          try {
            return plugin.context.resolveIrRef<IR.SchemaObject>(propertyRef);
          } catch {
            return;
          }
        },
        schema: resolved,
      })
    ) {
      return true;
    }

    if (
      (plugin.querySymbol(ZodContracts.definition(ref))?.meta as unknown as ZodMeta)?.isIntersection
    ) {
      if (!(resolved?.logicalOperator === 'and' && resolved.items?.length === 1)) {
        return true;
      }
    }

    if (isRecordShaped(resolved)) return true;

    if (childResults[index]!.meta.hasLazy) return true;
  }

  return false;
}
