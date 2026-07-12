import type { SchemaVisitorContext, SchemaWithType } from '@hey-api/shared';

import { $ } from '../../../../py-dsl';
import { $ as $$ } from '../../dsl';
import type { NullResolverContext } from '../../resolvers';
import type { PydanticType } from '../../shared/types';
import type { PydanticPlugin } from '../../types';

function baseNode(_ctx: NullResolverContext): PydanticType {
  const type = $$.constrainedType('None');
  return {
    node: { kind: 'rootModel', type },
    type,
  };
}

function nullResolver(ctx: NullResolverContext): PydanticType {
  return ctx.nodes.base(ctx);
}

export function nullToType({
  path,
  plugin,
  schema,
}: SchemaVisitorContext<PydanticPlugin['Instance']> & {
  schema: SchemaWithType<'null'>;
}): PydanticType {
  const ctx: NullResolverContext = {
    $,
    nodes: {
      base: baseNode,
    },
    path,
    plugin,
    schema,
  };

  const resolver = plugin.config.$resolvers?.null ?? plugin.config['~resolvers']?.null;
  return resolver?.(ctx) ?? nullResolver(ctx);
}
