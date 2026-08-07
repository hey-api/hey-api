import { childContext } from '@hey-api/shared';

import { $ } from '../../../../ts-dsl';
import { identifiers } from '../../constants';
import type { ObjectResolverContext } from '../../resolvers';
import type { Chain } from '../../shared/chain';
import type { CompositeHandlerResult, ZodResult } from '../../shared/types';

type ObjectToAstOptions = Pick<
  ObjectResolverContext,
  'applyModifiers' | 'path' | 'plugin' | 'schema' | 'walk'
>;

type ExtendedContext = ObjectResolverContext;

function additionalPropertiesNode(ctx: ExtendedContext): Chain | null | undefined {
  const { applyModifiers, path, plugin, schema, walk } = ctx;

  if (
    (schema.additionalProperties === false || schema.additionalProperties?.type === 'never') &&
    schema.properties &&
    Object.keys(schema.properties).length
  ) {
    return null;
  }

  if (
    !schema.additionalProperties ||
    (schema.properties && Object.keys(schema.properties).length)
  ) {
    return;
  }

  const additionalResult = walk(
    schema.additionalProperties,
    childContext({ path, plugin }, 'additionalProperties'),
  );
  ctx._childResults.push(additionalResult);
  const finalExpr = applyModifiers(additionalResult, {});
  return finalExpr.chain;
}

function baseNode(ctx: ExtendedContext): Chain {
  const { nodes } = ctx;
  const { z } = ctx.plugin.imports;

  const additional = nodes.additionalProperties(ctx);
  const shape = nodes.shape(ctx);

  if (additional === null) {
    return $(z).attr(identifiers.strictObject).call(shape);
  }

  if (additional) {
    return $(z).attr(identifiers.record).call(additional);
  }

  return $(z).attr(identifiers.object).call(shape);
}

function objectResolver(ctx: ExtendedContext): Chain {
  return ctx.nodes.base(ctx);
}

function shapeNode(ctx: ExtendedContext): ReturnType<typeof $.object> {
  const { applyModifiers, path, plugin, schema, walk } = ctx;
  const shape = $.object().pretty();

  for (const name in schema.properties) {
    const property = schema.properties[name]!;
    const isOptional = !schema.required?.includes(name);

    const propertyResult = walk(property, childContext({ path, plugin }, 'properties', name));
    ctx._childResults.push(propertyResult);

    const finalExpr = applyModifiers(propertyResult, {
      optional: isOptional,
    });

    shape.prop(name, finalExpr.chain);
  }

  return shape;
}

export function objectToAst(options: ObjectToAstOptions): CompositeHandlerResult {
  const { applyModifiers, path, plugin, schema, walk } = options;
  const childResults: Array<ZodResult> = [];
  const z = plugin.imports.z;
  const ctx: ExtendedContext = {
    $,
    _childResults: childResults,
    applyModifiers,
    chain: {
      current: $(z),
    },
    nodes: {
      additionalProperties: additionalPropertiesNode,
      base: baseNode,
      shape: shapeNode,
    },
    path,
    plugin,
    schema,
    symbols: {
      z,
    },
    walk,
  };
  const resolver = plugin.config.$resolvers?.object ?? plugin.config['~resolvers']?.object;
  const node = resolver?.(ctx) ?? objectResolver(ctx);

  return {
    chain: node,
    childResults,
  };
}
