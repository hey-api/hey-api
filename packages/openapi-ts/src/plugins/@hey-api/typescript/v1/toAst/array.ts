import { childContext } from '@hey-api/shared';
import { deduplicateSchema } from '@hey-api/shared';

import { $ } from '../../../../../ts-dsl';
import type { ArrayResolverContext } from '../../resolvers';
import type { Type, TypeScriptResult } from '../../shared/types';

function baseNode(ctx: ArrayResolverContext): Type {
  const { path, plugin, schema, walk } = ctx;

  if (!schema.items) {
    return $.type('Array').generic($.type(plugin.config.topType));
  }

  const dedupedSchema = deduplicateSchema({ detectFormat: true, schema });
  if (!dedupedSchema.items) {
    return $.type('Array').generic($.type(plugin.config.topType));
  }

  const itemResults: Array<TypeScriptResult> = dedupedSchema.items.map((item, index) =>
    walk(item, childContext({ path, plugin }, 'items', index)),
  );
  if (itemResults.length === 1) {
    return $.type('Array').generic(itemResults[0]!.type);
  }

  return dedupedSchema.logicalOperator === 'and'
    ? $.type('Array').generic($.type.and(...itemResults.map((r) => r.type)))
    : $.type('Array').generic($.type.or(...itemResults.map((r) => r.type)));
}

function arrayResolver(ctx: ArrayResolverContext): Type {
  return ctx.nodes.base(ctx);
}

export function arrayToAst({
  path,
  plugin,
  schema,
  walk,
}: Pick<ArrayResolverContext, 'path' | 'plugin' | 'schema' | 'walk'>): Type {
  const ctx: ArrayResolverContext = {
    $,
    nodes: {
      base: baseNode,
    },
    path,
    plugin,
    schema,
    walk,
  };

  const resolver = plugin.config.$resolvers?.array ?? plugin.config['~resolvers']?.array;
  return resolver?.(ctx) ?? arrayResolver(ctx);
}
