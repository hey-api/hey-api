import type { SchemaVisitorContext, SchemaWithType } from '@hey-api/shared';

import { $ } from '../../../../py-dsl';
import { $ as $$ } from '../../dsl';
import type { UndefinedResolverContext } from '../../resolvers';
import type { PydanticType } from '../../shared/types';
import type { PydanticPlugin } from '../../types';

function baseNode(_ctx: UndefinedResolverContext): PydanticType {
  const type = $$.constrainedType('None');
  return {
    node: { kind: 'rootModel', type },
    type,
  };
}

function undefinedResolver(ctx: UndefinedResolverContext): PydanticType {
  return ctx.nodes.base(ctx);
}

export function undefinedToType({
  path,
  plugin,
  schema,
}: SchemaVisitorContext<PydanticPlugin['Instance']> & {
  schema: SchemaWithType<'undefined'>;
}): PydanticType {
  const ctx: UndefinedResolverContext = {
    $,
    nodes: {
      base: baseNode,
    },
    path,
    plugin,
    schema,
  };

  const resolver = plugin.config.$resolvers?.undefined ?? plugin.config['~resolvers']?.undefined;
  return resolver?.(ctx) ?? undefinedResolver(ctx);
}
