import type { SchemaVisitorContext, SchemaWithType } from '@hey-api/shared';

import { $ } from '../../../../py-dsl';
import { $ as $$ } from '../../dsl';
import type { BooleanResolverContext } from '../../resolvers';
import type { PydanticType } from '../../shared/types';
import type { PydanticPlugin } from '../../types';

function constNode(ctx: BooleanResolverContext): PydanticType | undefined {
  const { plugin, schema } = ctx;

  if (typeof schema.const === 'boolean') {
    const literal = plugin.imports.typing.Literal;
    const type = $$.constrainedType($(literal).slice($.literal(schema.const)));
    return {
      node: { kind: 'rootModel', type },
      type,
    };
  }
}

function baseNode(_ctx: BooleanResolverContext): PydanticType {
  const type = $$.constrainedType('bool');
  return {
    node: { kind: 'rootModel', type },
    type,
  };
}

function booleanResolver(ctx: BooleanResolverContext): PydanticType {
  const constResult = ctx.nodes.const(ctx);
  if (constResult) return constResult;

  return ctx.nodes.base(ctx);
}

export function booleanToType({
  path,
  plugin,
  schema,
}: SchemaVisitorContext<PydanticPlugin['Instance']> & {
  schema: SchemaWithType<'boolean'>;
}): PydanticType {
  const ctx: BooleanResolverContext = {
    $,
    nodes: {
      base: baseNode,
      const: constNode,
    },
    path,
    plugin,
    schema,
  };

  const resolver = plugin.config.$resolvers?.boolean ?? plugin.config['~resolvers']?.boolean;
  return resolver?.(ctx) ?? booleanResolver(ctx);
}
