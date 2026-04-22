import type { Symbol } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';
import type { RequestSchemaContext, ResolvedRequestValidatorLayer } from '@hey-api/shared';
import { operationBaseName, requestValidatorLayers, resolveValidatorLayer } from '@hey-api/shared';

import { $ } from '../../../ts-dsl';
import { identifiers } from '../constants';
import { ZodContracts } from '../contracts';
import type {
  RequestValidatorResolverContext,
  ResponseValidatorResolverContext,
} from '../resolvers';
import type { Chain } from '../shared/chain';
import { exportAst } from '../shared/export';
import type { ValidatorArgs } from '../shared/types';
import { getDefaultRequestValidatorLayers } from '../shared/validator';
import type { ZodPlugin } from '../types';

type ArrowFunc = Extract<ReturnType<typeof $.func>, { '~mode': 'arrow' }>;

function emptyNode(
  ctx: RequestValidatorResolverContext & {
    layer: ResolvedRequestValidatorLayer;
  },
): Chain {
  const { z } = ctx.plugin.imports;
  if (ctx.layer.whenEmpty === 'omit') {
    throw new Error(
      `Cannot create empty schema for layer "${ctx.layer.as}" with whenEmpty: 'omit'`,
    );
  }
  if (ctx.layer.whenEmpty === 'strict') {
    return $(z).attr(identifiers.never).call();
  }
  return $(z).attr(identifiers.object).call($.object());
}

function optionalNode(
  ctx: RequestValidatorResolverContext & {
    layer: ResolvedRequestValidatorLayer;
    schema: Chain;
  },
): Chain {
  if (!ctx.layer.optional) return ctx.schema;
  return $(ctx.schema).attr(identifiers.optional).call();
}

function compositeNode(ctx: RequestValidatorResolverContext): Chain | undefined {
  const { z } = ctx.plugin.imports;
  const obj = $.object();

  let allOptional = true;
  const defaultValues = getDefaultRequestValidatorLayers(ctx.operation);
  for (const key of requestValidatorLayers) {
    const layer = resolveValidatorLayer(ctx.layers, key, defaultValues);

    const layerSchema = ctx.plugin.querySymbol(
      ZodContracts.operationRequest(ctx.operation.id, key),
    );
    if (layerSchema) {
      obj.prop(layer.as, ctx.nodes.optional({ ...ctx, layer, schema: $(layerSchema) }));
      if (!layer.optional) {
        allOptional = false;
      }
      continue;
    }

    if (layer.whenEmpty === 'omit') {
      continue;
    }

    const empty = ctx.nodes.empty({ ...ctx, layer });
    obj.prop(layer.as, ctx.nodes.optional({ ...ctx, layer, schema: empty }));
    if (!layer.optional) {
      allOptional = false;
    }
  }

  if (obj.isEmpty) {
    return;
  }

  let result: Chain = $(z).attr(identifiers.object).call(obj);
  if (allOptional && ctx.outerOptional) {
    result = $(result).attr(identifiers.optional).call();
  }
  return result;
}

function requestValidatorResolver(
  ctx: RequestValidatorResolverContext,
): ReturnType<typeof $.return> {
  const { schema } = ctx.symbols;
  return $(schema).attr(identifiers.parseAsync).call('data').await().return();
}

function responseValidatorResolver(
  ctx: ResponseValidatorResolverContext,
): ReturnType<typeof $.return> {
  const { schema } = ctx.symbols;
  return $(schema).attr(identifiers.parseAsync).call('data').await().return();
}

function runRequestResolver(ctx: RequestValidatorResolverContext): ArrowFunc | undefined {
  const validator =
    ctx.plugin.config.$resolvers?.validator ?? ctx.plugin.config['~resolvers']?.validator;
  const resolver = typeof validator === 'function' ? validator : validator?.request;
  const candidates = [resolver, requestValidatorResolver];
  for (const candidate of candidates) {
    const statements = candidate?.(ctx);
    if (statements === null) return;
    if (statements !== undefined) {
      return $.func()
        .async()
        .param('data')
        .do(...(statements instanceof Array ? statements : [statements]));
    }
  }
}

function runResponseResolver(ctx: ResponseValidatorResolverContext): ArrowFunc | undefined {
  const validator =
    ctx.plugin.config.$resolvers?.validator ?? ctx.plugin.config['~resolvers']?.validator;
  const resolver = typeof validator === 'function' ? validator : validator?.response;
  const candidates = [resolver, responseValidatorResolver];
  for (const candidate of candidates) {
    const statements = candidate?.(ctx);
    if (statements === null) return;
    if (statements !== undefined) {
      return $.func()
        .async()
        .param('data')
        .do(...(statements instanceof Array ? statements : [statements]));
    }
  }
}

function createRequestSchemaContext(
  ctx: RequestSchemaContext<ZodPlugin['Instance']>,
): RequestValidatorResolverContext {
  const { plugin } = ctx;
  const z = plugin.imports.z;

  return {
    ...ctx,
    $,
    chain: {
      current: $(z),
    },
    nodes: {
      composite: compositeNode,
      empty: emptyNode,
      optional: optionalNode,
    },
    path: ref([]),
    symbols: {
      schema: $(''),
      z,
    },
  };
}

export function createRequestSchemaV3(
  ctx: RequestSchemaContext<ZodPlugin['Instance']>,
): Symbol | Chain | undefined {
  const { operation, plugin } = ctx;
  const baseCtx = createRequestSchemaContext(ctx);

  const schema = baseCtx.nodes.composite(baseCtx);
  if (!schema) return;

  if (!plugin.config.requests.shouldExtract({ operation })) {
    return schema;
  }

  return exportAst({
    final: {
      chain: schema,
    },
    meta: {
      resource: 'operation',
      resourceId: operation.id,
      role: 'data',
    },
    naming: plugin.config.requests,
    namingAnchor: operationBaseName(operation),
    path: [],
    plugin,
    schema: {},
  });
}

export function createRequestValidatorV3(
  ctx: RequestSchemaContext<ZodPlugin['Instance']>,
): ArrowFunc | undefined {
  const symbolOrSchema = createRequestSchemaV3(ctx);
  if (!symbolOrSchema) return;

  const baseCtx = createRequestSchemaContext(ctx);
  const resolverCtx: RequestValidatorResolverContext = {
    ...baseCtx,
    symbols: {
      ...baseCtx.symbols,
      schema: symbolOrSchema,
    },
  };
  return runRequestResolver(resolverCtx);
}

export function createResponseValidatorV3({
  operation,
  plugin,
}: ValidatorArgs): ArrowFunc | undefined {
  const symbol = plugin.querySymbol(ZodContracts.operationResponses(operation.id));
  if (!symbol) return;

  const z = plugin.imports.z;
  const resolverCtx: ResponseValidatorResolverContext = {
    $,
    chain: {
      current: $(z),
    },
    operation,
    path: ref([]),
    plugin,
    symbols: {
      schema: symbol,
      z,
    },
  };
  return runResponseResolver(resolverCtx);
}

export function createResponseTransformerV3(ctx: ValidatorArgs): ArrowFunc | undefined {
  return createResponseValidatorV3(ctx);
}

export function createResponseHandlersV3(ctx: ValidatorArgs): {
  transformer: ArrowFunc | undefined;
  validator: ArrowFunc | undefined;
} {
  return {
    transformer: createResponseTransformerV3(ctx),
    validator: undefined,
  };
}
