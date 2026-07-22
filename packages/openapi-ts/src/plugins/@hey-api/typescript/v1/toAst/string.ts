import type { SymbolMeta } from '@hey-api/codegen-core';
import type { SchemaVisitorContext, SchemaWithType } from '@hey-api/shared';
import { toCase } from '@hey-api/shared';

import { TEMPORAL } from '../../../../../symbols';
import { $ } from '../../../../../ts-dsl';
import { resolveDates } from '../../../transformers/dates';
import type { StringResolverContext } from '../../resolvers';
import type { Type } from '../../shared/types';
import type { HeyApiTypeScriptPlugin } from '../../types';

function constNode(ctx: StringResolverContext): Type | undefined {
  const { schema } = ctx;
  if (schema.const !== undefined) {
    return $.type.fromValue(schema.const);
  }
}

function formatNode(ctx: StringResolverContext): Type | undefined {
  const { plugin, schema } = ctx;
  const { format } = schema;

  if (!format) return;

  if (format === 'binary') {
    return $.type.or($.type('Blob'), $.type('File'));
  }

  if (format === 'date-time' || format === 'date') {
    const dates = resolveDates(plugin.getPlugin('@hey-api/transformers')?.config.dates);
    if (dates.enabled) {
      if (dates.type === 'temporal') {
        const temporal = TEMPORAL(plugin.symbolFactory, { polyfill: dates.polyfill }).Temporal;
        return $.type(temporal).attr(format === 'date' ? 'PlainDate' : 'Instant');
      }
      return $.type('Date');
    }
  }

  if (format === 'typeid' && typeof schema.example === 'string') {
    const parts = String(schema.example).split('_');
    parts.pop();
    const typeidBase = parts.join('_');

    const typeidQuery: SymbolMeta = {
      artifact: 'types',
      category: 'type',
      resource: 'type-id',
      resourceId: typeidBase,
    };
    // TODO: contract (self)
    if (!plugin.querySymbol(typeidQuery)) {
      const containerQuery: SymbolMeta = {
        artifact: 'types',
        category: 'type',
        resource: 'type-id',
        variant: 'container',
      };
      // TODO: contract (self)
      if (!plugin.querySymbol(containerQuery)) {
        const symbolTypeId = plugin.symbol('TypeID', {
          meta: containerQuery,
        });
        const nodeTypeId = $.type
          .alias(symbolTypeId)
          .export()
          .generic('T', (g) => g.extends('string'))
          .type($.type.template().add($.type('T')).add('_').add($.type('string')));
        plugin.node(nodeTypeId);
      }
      // TODO: contract (self)
      const refSymbol = plugin.referenceSymbol(containerQuery);
      const symbolTypeName = plugin.symbol(toCase(`${typeidBase}_id`, plugin.config.case), {
        meta: typeidQuery,
      });
      const node = $.type
        .alias(symbolTypeName)
        .export()
        .type($.type(refSymbol).generic($.type.literal(typeidBase)));
      plugin.node(node);
    }
    // TODO: contract (self)
    return $.type(plugin.referenceSymbol(typeidQuery));
  }
}

function baseNode(_ctx: StringResolverContext): Type {
  return $.type('string');
}

function stringResolver(ctx: StringResolverContext): Type {
  if (ctx.schema.const !== undefined) {
    const constResult = ctx.nodes.const(ctx);
    if (constResult) return constResult;
  }

  const formatResult = ctx.nodes.format(ctx);
  if (formatResult) return formatResult;

  return ctx.nodes.base(ctx);
}

export function stringToAst({
  path,
  plugin,
  schema,
}: SchemaVisitorContext<HeyApiTypeScriptPlugin['Instance']> & {
  schema: SchemaWithType<'string'>;
}): Type {
  const ctx: StringResolverContext = {
    $,
    nodes: {
      base: baseNode,
      const: constNode,
      format: formatNode,
    },
    path,
    plugin,
    schema,
  };

  const resolver = plugin.config.$resolvers?.string ?? plugin.config['~resolvers']?.string;
  return resolver?.(ctx) ?? stringResolver(ctx);
}
