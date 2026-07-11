import type { SymbolMeta } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { buildSymbolIn, toCase } from '@hey-api/shared';

import { $, regexp } from '../../../../ts-dsl';
import { createSchemaComment } from '../../../shared/utils/schema';
import type { HeyApiTypeScriptPlugin } from '../types';
import type { TypeScriptFinal } from './types';

function createSymbolMeta(
  args: SymbolMeta & Pick<Required<SymbolMeta>, 'category' | 'resourceId'>,
): SymbolMeta {
  return {
    ...args,
    resource: 'definition',
  };
}

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
      key = resolvedName !== null ? resolvedName : `${key}${duplicateAttempt + 1}`;
    } else {
      key = `${key}${duplicateAttempt + 1}`;
    }
  }

  return key;
}

function resolveItemsWithKeys(
  items: Required<TypeScriptFinal>['enumData']['items'],
  plugin: HeyApiTypeScriptPlugin['Instance'],
): Array<{ item: (typeof items)[number]; key: string }> {
  const duplicateCounts: Record<string, number> = {};

  return items.map((item) => {
    const baseKey = resolveEnumKey({ baseName: item.key, duplicateAttempt: 0, plugin });
    const duplicateAttempt = duplicateCounts[baseKey] ?? 0;
    duplicateCounts[baseKey] = duplicateAttempt + 1;

    return {
      item,
      key:
        duplicateAttempt === 0
          ? baseKey
          : resolveEnumKey({ baseName: item.key, duplicateAttempt, plugin }),
    };
  });
}

export function exportEnumAst({
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

  const { items, mode } = enumData;
  const itemsWithKeys = resolveItemsWithKeys(items, plugin);

  if (mode === 'javascript') {
    const filteredItems =
      plugin.config.enums.constantsIgnoreNull && items.some((item) => item.schema.const === null)
        ? items.filter((item) => item.schema.const !== null)
        : items;

    const symbolObject = plugin.symbol(
      buildSymbolIn({
        meta: createSymbolMeta({
          category: 'utility',
          resourceId,
        }),
        name,
        naming: plugin.config.definitions,
        plugin,
        schema,
      }),
    );

    const objectNode = $.const(symbolObject)
      .export()
      .$if(plugin.config.comments && createSchemaComment(schema), (c, v) =>
        c.styledDoc(v, plugin.config.commentsStyle),
      )
      .assign(
        $.object(
          ...itemsWithKeys
            .filter(({ item }) => filteredItems.includes(item))
            .map(({ item, key }) =>
              $.prop({ kind: 'prop' as const, name: key })
                .$if(plugin.config.comments && createSchemaComment(item.schema), (p, v) =>
                  p.styledDoc(v, plugin.config.commentsStyle),
                )
                .value($.fromValue(item.schema.const)),
            ),
        ).as('const'),
      );
    plugin.node(objectNode);

    const symbol = plugin.symbol(
      buildSymbolIn({
        meta: createSymbolMeta({
          category: 'type',
          resourceId,
        }),
        name,
        naming: plugin.config.definitions,
        plugin,
        schema,
      }),
    );
    const node = $.type
      .alias(symbol)
      .export()
      .$if(plugin.config.comments && createSchemaComment(schema), (t, v) =>
        t.styledDoc(v, plugin.config.commentsStyle),
      )
      .type($.type(symbolObject).idx($.type(symbolObject).typeofType().keyof()).typeofType());
    plugin.node(node);
    return true;
  }

  if (mode === 'typescript' || mode === 'typescript-const') {
    const hasInvalidTypes = items.some(
      (item) => typeof item.schema.const !== 'number' && typeof item.schema.const !== 'string',
    );
    if (hasInvalidTypes) return false;

    const symbol = plugin.symbol(
      buildSymbolIn({
        meta: createSymbolMeta({
          category: 'type',
          resourceId,
        }),
        name,
        naming: plugin.config.definitions,
        plugin,
        schema,
      }),
    );
    const enumNode = $.enum(symbol)
      .export()
      .$if(plugin.config.comments && createSchemaComment(schema), (e, v) => e.styledDoc(v))
      .const(mode === 'typescript-const')
      .members(
        ...itemsWithKeys.map(({ item, key }) =>
          $.member(key)
            .$if(plugin.config.comments && createSchemaComment(item.schema), (m, v) =>
              m.styledDoc(v, plugin.config.commentsStyle),
            )
            .value($.fromValue(item.schema.const)),
        ),
      );
    plugin.node(enumNode);
    return true;
  }

  return false;
}
