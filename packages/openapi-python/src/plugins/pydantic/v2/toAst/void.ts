import type { SchemaVisitorContext, SchemaWithType } from '@hey-api/shared';

import { $ } from '../../../../py-dsl';
import { $ as $$ } from '../../dsl';
import type { VoidResolverContext } from '../../resolvers';
import type { PydanticType } from '../../shared/types';
import type { PydanticPlugin } from '../../types';

function baseNode(_ctx: VoidResolverContext): PydanticType {
  const type = $$.constrainedType('None');
  return {
    node: { kind: 'rootModel', type },
    type,
  };
}

function voidResolver(ctx: VoidResolverContext): PydanticType {
  return ctx.nodes.base(ctx);
}

export function voidToType({
  path,
  plugin,
  schema,
}: SchemaVisitorContext<PydanticPlugin['Instance']> & {
  schema: SchemaWithType<'void'>;
}): PydanticType {
  const ctx: VoidResolverContext = {
    $,
    nodes: {
      base: baseNode,
    },
    path,
    plugin,
    schema,
  };

  const resolver = plugin.config.$resolvers?.void ?? plugin.config['~resolvers']?.void;
  return resolver?.(ctx) ?? voidResolver(ctx);
}
