import { fromRef } from '@hey-api/codegen-core';
import type { SchemaVisitorContext, SchemaWithType } from '@hey-api/shared';
import { pathToJsonPointer, toCase } from '@hey-api/shared';

import type { EnumMember } from '../../../../py-dsl';
import { $ } from '../../../../py-dsl';
import { safeRuntimeName } from '../../../../py-dsl/utils/name';
import { $ as $$ } from '../../dsl';
import type { EnumResolverContext } from '../../resolvers';
import type { PydanticType } from '../../shared/types';
import type { PydanticPlugin } from '../../types';

export interface EnumToTypeResult extends PydanticType {
  enumMembers: Array<EnumMember>;
  isNullable: boolean;
}

// TODO: move to Pydantic enum (member?) DSL, replace with casing utils
function toEnumMemberName(value: boolean | number | string): string {
  if (typeof value === 'boolean') {
    return toCase(String(value), 'SCREAMING_SNAKE_CASE');
  }
  if (typeof value === 'number') {
    return safeRuntimeName(`VALUE_${value}`.replace(/-/g, '_NEG_').replace(/\./g, '_DOT_'));
  }
  const name = toCase(value, 'SCREAMING_SNAKE_CASE');
  return safeRuntimeName(/^[A-Z_]/.test(name) ? name : `VALUE_${name || 'EMPTY'}`);
}

function itemsNode(ctx: EnumResolverContext): {
  enumMembers: Array<EnumMember>;
  isNullable: boolean;
} {
  const { plugin, schema } = ctx;
  const enumMembers: Array<EnumMember> = [];
  let isNullable = false;

  for (const item of schema.items ?? []) {
    if (item.type === 'null' || item.const === null) {
      isNullable = true;
      continue;
    }

    if (
      (item.type === 'string' && typeof item.const === 'string') ||
      ((item.type === 'integer' || item.type === 'number') && typeof item.const === 'number') ||
      (item.type === 'boolean' && typeof item.const === 'boolean')
    ) {
      enumMembers.push({
        name: plugin.symbol(toEnumMemberName(item.const)),
        value: item.const,
      });
    }
  }

  return { enumMembers, isNullable };
}

function baseNode(ctx: EnumResolverContext): PydanticType {
  const { plugin } = ctx;
  const { enumMembers } = ctx.nodes.items(ctx);

  if (!enumMembers.length) {
    return {
      type: $$.constrainedType(plugin.imports.typing.Any),
    };
  }

  const mode = plugin.config.enums ?? 'enum';

  if (mode === 'literal') {
    const literal = plugin.imports.typing.Literal;
    const values = enumMembers.map((m) =>
      // TODO: replace
      typeof m.value === 'string' ? `"<<<<${m.value}"` : `<<<${m.value}`,
    );

    return {
      type: $$.constrainedType($(literal).slice(...values)),
    };
  }
  // TODO: contract (self)
  const refSymbol = plugin.referenceSymbol({
    artifact: 'pydantic',
    category: 'schema',
    resource: 'definition',
    resourceId: pathToJsonPointer(fromRef(ctx.path)),
  });

  return {
    type: $$.constrainedType(refSymbol),
  };
}

function enumResolver(ctx: EnumResolverContext): PydanticType {
  return ctx.nodes.base(ctx);
}

export function enumToType({
  path,
  plugin,
  schema,
}: SchemaVisitorContext<PydanticPlugin['Instance']> & {
  schema: SchemaWithType<'enum'>;
}): EnumToTypeResult {
  const ctx: EnumResolverContext = {
    $,
    nodes: {
      base: baseNode,
      items: itemsNode,
    },
    path,
    plugin,
    schema,
  };

  const resolver = plugin.config.$resolvers?.enum ?? plugin.config['~resolvers']?.enum;
  const resolved = resolver?.(ctx) ?? enumResolver(ctx);

  const { enumMembers, isNullable } = ctx.nodes.items(ctx);

  return {
    ...resolved,
    enumMembers,
    isNullable,
  };
}
