import { childContext } from '@hey-api/shared';

import { $ } from '../../../../../ts-dsl';
import type { TupleResolverContext } from '../../resolvers';
import type { Type } from '../../shared/types';

function baseNode(ctx: TupleResolverContext): Type {
  const { path, plugin, schema, walk } = ctx;
  const itemTypes: Array<Type> = [];

  if (schema.items) {
    schema.items.forEach((item, index) => {
      const result = walk(item, childContext({ path, plugin }, 'items', index));
      itemTypes.push(result.type);
    });
  }

  return $.type.tuple(...itemTypes);
}

function constNode(ctx: TupleResolverContext): Type | undefined {
  const { schema } = ctx;

  if (!schema.const || !Array.isArray(schema.const)) {
    return;
  }

  const itemTypes = schema.const.map((value) => $.type.fromValue(value));
  return $.type.tuple(...itemTypes);
}

function tupleResolver(ctx: TupleResolverContext): Type {
  const constResult = ctx.nodes.const(ctx);
  if (constResult) return constResult;

  return ctx.nodes.base(ctx);
}

export function tupleToAst({
  path,
  plugin,
  schema,
  walk,
}: Pick<TupleResolverContext, 'path' | 'plugin' | 'schema' | 'walk'>): Type {
  const ctx: TupleResolverContext = {
    $,
    nodes: {
      base: baseNode,
      const: constNode,
    },
    path,
    plugin,
    schema,
    walk,
  };

  const resolver = plugin.config.$resolvers?.tuple ?? plugin.config['~resolvers']?.tuple;
  return resolver?.(ctx) ?? tupleResolver(ctx);
}
