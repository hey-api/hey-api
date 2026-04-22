import { ref, type Symbol } from '@hey-api/codegen-core';
import type { RequestSchemaContext, ResolvedRequestValidatorLayer } from '@hey-api/shared';
import { operationBaseName, requestValidatorLayers, resolveValidatorLayer } from '@hey-api/shared';

import { $ } from '../../../ts-dsl';
import type {
  RequestValidatorResolverContext,
  ResponseValidatorResolverContext,
} from '../resolvers';
import { exportAst } from '../shared/export';
import type { Pipe } from '../shared/pipes';
import { pipes } from '../shared/pipes';
import type { ValidatorArgs } from '../shared/types';
import { getDefaultRequestValidatorLayers } from '../shared/validator';
import type { ValibotPlugin } from '../types';
import { identifiers } from './constants';

type ArrowFunc = Extract<ReturnType<typeof $.func>, { '~mode': 'arrow' }>;

function emptyNode(
  ctx: RequestValidatorResolverContext & {
    layer: ResolvedRequestValidatorLayer;
  },
): Pipe {
  const { v } = ctx.plugin.imports;
  if (ctx.layer.whenEmpty === 'omit') {
    throw new Error(
      `Cannot create empty schema for layer "${ctx.layer.as}" with whenEmpty: 'omit'`,
    );
  }
  if (ctx.layer.whenEmpty === 'strict') {
    return $(v).attr(identifiers.schemas.never).call();
  }
  return $(v).attr(identifiers.schemas.object).call($.object());
}

function optionalNode(
  ctx: RequestValidatorResolverContext & {
    layer: ResolvedRequestValidatorLayer;
    schema: Pipe;
  },
): Pipe {
  if (!ctx.layer.optional) return ctx.schema;
  const { v } = ctx.plugin.imports;
  return $(v).attr(identifiers.schemas.optional).call(ctx.schema);
}

function compositeNode(ctx: RequestValidatorResolverContext): Pipe | undefined {
  const { v } = ctx.plugin.imports;
  const obj = $.object();

  let allOptional = true;
  const defaultValues = getDefaultRequestValidatorLayers(ctx.operation);
  for (const key of requestValidatorLayers) {
    const layer = resolveValidatorLayer(ctx.layers, key, defaultValues);
    // TODO: contract (self)
    const layerSchema = ctx.plugin.querySymbol({
      artifact: 'valibot',
      category: 'schema',
      resource: 'operation',
      resourceId: ctx.operation.id,
      role: `request-${key}`,
    });

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

  let result: Pipe = $(v).attr(identifiers.schemas.object).call(obj);
  if (allOptional && ctx.outerOptional) {
    result = $(v).attr(identifiers.schemas.optional).call(result);
  }
  return result;
}

function requestValidatorResolver(
  ctx: RequestValidatorResolverContext,
): ReturnType<typeof $.return> {
  const { schema } = ctx.symbols;
  const { v } = ctx.plugin.imports;
  return $(v).attr(identifiers.async.parseAsync).call(schema, 'data').await().return();
}

function responseValidatorResolver(
  ctx: ResponseValidatorResolverContext,
): ReturnType<typeof $.return> {
  const { schema } = ctx.symbols;
  const { v } = ctx.plugin.imports;
  return $(v).attr(identifiers.async.parseAsync).call(schema, 'data').await().return();
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
  ctx: RequestSchemaContext<ValibotPlugin['Instance']>,
): RequestValidatorResolverContext {
  const { plugin } = ctx;
  const v = plugin.imports.v;

  return {
    ...ctx,
    $,
    nodes: {
      composite: compositeNode,
      empty: emptyNode,
      optional: optionalNode,
    },
    path: ref([]),
    pipes: {
      ...pipes,
      current: [],
    },
    symbols: {
      schema: $(''),
      v,
    },
  };
}

export function createRequestSchemaV1(
  ctx: RequestSchemaContext<ValibotPlugin['Instance']>,
): Symbol | Pipe | undefined {
  const { operation, plugin } = ctx;
  const baseCtx = createRequestSchemaContext(ctx);

  const schema = baseCtx.nodes.composite(baseCtx);
  if (!schema) return;

  if (!plugin.config.requests.shouldExtract({ operation })) {
    return schema;
  }

  return exportAst({
    final: {
      pipes: [schema],
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

export function createRequestValidatorV1(
  ctx: RequestSchemaContext<ValibotPlugin['Instance']>,
): ArrowFunc | undefined {
  const symbolOrSchema = createRequestSchemaV1(ctx);
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

export function createResponseValidatorV1({
  operation,
  plugin,
}: ValidatorArgs): ArrowFunc | undefined {
  // TODO: contract (self)
  const symbol = plugin.querySymbol({
    artifact: 'valibot',
    category: 'schema',
    resource: 'operation',
    resourceId: operation.id,
    role: 'responses',
  });
  if (!symbol) return;

  const v = plugin.imports.v;
  const resolverCtx: ResponseValidatorResolverContext = {
    $,
    operation,
    path: ref([]),
    pipes: {
      ...pipes,
      current: [],
    },
    plugin,
    symbols: {
      schema: symbol,
      v,
    },
  };
  return runResponseResolver(resolverCtx);
}

export function createResponseTransformerV1(ctx: ValidatorArgs): ArrowFunc | undefined {
  return createResponseValidatorV1(ctx);
}

export function createResponseHandlersV1(ctx: ValidatorArgs): {
  transformer: ArrowFunc | undefined;
  validator: ArrowFunc | undefined;
} {
  return {
    transformer: createResponseTransformerV1(ctx),
    validator: undefined,
  };
}
