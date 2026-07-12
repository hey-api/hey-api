import { childContext } from '@hey-api/shared';

import { $ } from '../../../../py-dsl';
import { $ as $$ } from '../../dsl';
import type { TupleResolverContext } from '../../resolvers';
import type { PydanticResult, PydanticType } from '../../shared/types';

function baseNode(ctx: TupleResolverContext): PydanticType {
  const { applyModifiers, childResults } = ctx;

  const itemTypes = childResults
    .map((r) => applyModifiers(r).type)
    .filter((t) => t !== undefined)
    .map((t) => t!.type);

  return { type: $$.constrainedType($.type.tuple(...itemTypes)) };
}

function constNode(_ctx: TupleResolverContext): PydanticType | undefined {
  return;
}

function tupleResolver(ctx: TupleResolverContext): PydanticType {
  const baseResult = ctx.nodes.base(ctx);

  if (ctx.schema.description !== undefined && baseResult.type) {
    return {
      ...baseResult,
      type: baseResult.type.mergeConstraints($$.constraints().description(ctx.schema.description)),
    };
  }

  return baseResult;
}

export interface TupleToTypeResult extends PydanticType {
  childResults: Array<PydanticResult>;
}

export function tupleToType(
  ctx: Pick<TupleResolverContext, 'applyModifiers' | 'path' | 'plugin' | 'schema' | 'walk'>,
): TupleToTypeResult {
  const { applyModifiers, path, plugin, schema, walk } = ctx;

  const childResults: Array<PydanticResult> = [];

  if (schema.items && schema.items.length) {
    for (let i = 0; i < schema.items.length; i++) {
      const item = schema.items[i]!;
      const result = walk(item, childContext({ path, plugin }, 'items', i));
      childResults.push(result);
    }
  }

  const resolverCtx: TupleResolverContext = {
    $,
    applyModifiers,
    childResults,
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
  const resolved = resolver?.(resolverCtx) ?? tupleResolver(resolverCtx);

  return {
    ...resolved,
    childResults,
  };
}
