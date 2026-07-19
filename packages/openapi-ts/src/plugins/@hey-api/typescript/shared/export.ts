import type { IR } from '@hey-api/shared';
import { buildSymbolIn, pathToName, toCase } from '@hey-api/shared';
import { pathToJsonPointer } from '@hey-api/shared';

import { createSchemaComment } from '../../../../plugins/shared/utils/schema';
import { $, regexp } from '../../../../ts-dsl';
import type { HeyApiTypeScriptPlugin } from '../types';
import type { ProcessorContext } from './processor';
import type { TypeScriptFinal } from './types';

function resolveEnumKey({
  baseName,
  duplicateAttempt,
  plugin,
}: {
  baseName: string;
  duplicateAttempt: number;
  plugin: HeyApiTypeScriptPlugin['Instance'];
}): string {
  let key = toCase(baseName, plugin.config.enums.case, {
    stripLeadingSeparators: false,
  });

  regexp.number.lastIndex = 0;
  if (
    regexp.number.test(key) &&
    plugin.config.enums.enabled &&
    (plugin.config.enums.mode === 'typescript' || plugin.config.enums.mode === 'typescript-const')
  ) {
    key = `_${key}`;
  }

  if (duplicateAttempt > 0) {
    const nameConflictResolver = plugin.context.config.output?.nameConflictResolver;
    if (nameConflictResolver) {
      const resolvedName = nameConflictResolver({
        attempt: duplicateAttempt,
        baseName: key,
      });
      if (resolvedName !== null) {
        key = resolvedName;
      } else {
        key = `${key}${duplicateAttempt + 1}`;
      }
    } else {
      key = `${key}${duplicateAttempt + 1}`;
    }
  }

  return key;
}

function buildEnumExport({
  enumData,
  name,
  plugin,
  resourceId,
  schema,
}: {
  enumData: TypeScriptFinal['enumData'];
  name: string;
  plugin: HeyApiTypeScriptPlugin['Instance'];
  resourceId: string;
  schema: IR.SchemaObject;
}): boolean {
  if (!enumData || enumData.mode === 'type') return false;

  const mode = enumData.mode;
  const items = enumData.items;
  const duplicateCounts: Record<string, number> = {};

  const itemsWithAttempts = items.map((item, index) => {
    const candidateKey = toCase(item.key, plugin.config.enums.case, {
      stripLeadingSeparators: false,
    });

    regexp.number.lastIndex = 0;
    const baseKey =
      regexp.number.test(candidateKey) &&
      plugin.config.enums.enabled &&
      (plugin.config.enums.mode === 'typescript' || plugin.config.enums.mode === 'typescript-const')
        ? `_${candidateKey}`
        : candidateKey;

    const duplicateAttempt = duplicateCounts[baseKey] ?? 0;
    duplicateCounts[baseKey] = duplicateAttempt + 1;

    return {
      duplicateAttempt,
      index,
      item,
    };
  });

  if (mode === 'javascript') {
    const filteredItems =
      plugin.config.enums.constantsIgnoreNull && items.some((item) => item.schema.const === null)
        ? items.filter((item) => item.schema.const !== null)
        : items;

    const symbolObject = plugin.registerSymbol(
      buildSymbolIn({
        meta: {
          category: 'utility',
          resource: 'definition',
          resourceId,
          tool: 'typescript',
        },
        name,
        naming: plugin.config.definitions,
        plugin,
        schema,
      }),
    );

    const objectNode = $.const(symbolObject)
      .export()
      .$if(plugin.config.comments && createSchemaComment(schema), (c, v) => c.doc(v))
      .assign(
        $.object(
          ...itemsWithAttempts
            .filter(({ item }) => filteredItems.includes(item))
            .map(({ duplicateAttempt, item }) =>
              $.prop({
                kind: 'prop' as const,
                name: resolveEnumKey({ baseName: item.key, duplicateAttempt, plugin }),
              })
                .$if(
                  plugin.config.comments &&
                    // Enum member docs must come only from the enum's schema.description.
                    // x-enum-varnames describes member identifiers, not documentation.
                    createSchemaComment(item.schema),
                  (p, v) => p.doc(v),
                )
                .value($.fromValue(item.schema.const)),
            ),
        ).as('const'),
      );
    plugin.node(objectNode);

    const symbol = plugin.registerSymbol(
      buildSymbolIn({
        meta: {
          category: 'type',
          resource: 'definition',
          resourceId,
          tool: 'typescript',
        },
        name,
        naming: plugin.config.definitions,
        plugin,
        schema,
      }),
    );
    const node = $.type
      .alias(symbol)
      .export()
      .$if(plugin.config.comments && createSchemaComment(schema), (t, v) => t.doc(v))
      .type($.type(symbolObject).idx($.type(symbolObject).typeofType().keyof()).typeofType());
    plugin.node(node);
    return true;
  }

  if (mode === 'typescript' || mode === 'typescript-const') {
    const hasInvalidTypes = items.some(
      (item) => typeof item.schema.const !== 'number' && typeof item.schema.const !== 'string',
    );
    if (hasInvalidTypes) return false;

    const symbol = plugin.registerSymbol(
      buildSymbolIn({
        meta: {
          category: 'type',
          resource: 'definition',
          resourceId,
          tool: 'typescript',
        },
        name,
        naming: plugin.config.definitions,
        plugin,
        schema,
      }),
    );
    const enumNode = $.enum(symbol)
      .export()
      .$if(plugin.config.comments && createSchemaComment(schema), (e, v) => e.doc(v))
      .const(mode === 'typescript-const')
      .members(
        ...itemsWithAttempts.map(({ duplicateAttempt, item }) =>
          $.member(resolveEnumKey({ baseName: item.key, duplicateAttempt, plugin }))
            .$if(plugin.config.comments && createSchemaComment(item.schema), (m, v) => m.doc(v))
            .value($.fromValue(item.schema.const)),
        ),
      );
    plugin.node(enumNode);
    return true;
  }

  return false;
}

export function exportAst({
  final,
  meta,
  naming,
  namingAnchor,
  path,
  plugin,
  schema,
  tags,
}: Pick<
  ProcessorContext,
  'meta' | 'naming' | 'namingAnchor' | 'path' | 'plugin' | 'schema' | 'tags'
> & {
  final: TypeScriptFinal;
}): void {
  const $ref = meta.resourceId || pathToJsonPointer(path);
  const name = pathToName(path, { anchor: namingAnchor });

  const hasEnumExport = buildEnumExport({
    enumData: final.enumData,
    name,
    plugin,
    resourceId: $ref,
    schema,
  });

  // If enum declaration/const object has been emitted, do not emit fallback type alias.
  if (hasEnumExport) {
    return;
  }

  const symbol = plugin.registerSymbol(
    buildSymbolIn({
      meta: {
        category: 'type',
        path,
        resource: 'definition',
        resourceId: $ref,
        tags,
        tool: 'typescript',
      },
      name,
      naming,
      plugin,
      schema,
    }),
  );

  const node = $.type
    .alias(symbol)
    .export()
    .$if(plugin.config.comments && createSchemaComment(schema), (t, v) => t.doc(v))
    .type(final.type);
  plugin.node(node);
}
