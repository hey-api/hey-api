import type { Symbol, SymbolMeta } from '@hey-api/codegen-core';
import type { IR, PluginInstance } from '@hey-api/shared';
import { operationResponsesMap, statusCodeToGroup, toCase } from '@hey-api/shared';

import { getTypedConfig } from '../../../../config/utils';
import { $ } from '../../../../ts-dsl';
import { getClientPlugin } from '../../../@hey-api/client-core/utils';
import { hasOperationSse } from '../../../shared/utils/operation';
import type { ResponseHandlers, ValidatorArgs } from './types';

type ResponseFormat = 'arraybuffer' | 'blob' | 'document' | 'json' | 'stream' | 'text';

export function operationResponseFormat(operation: IR.OperationObject): ResponseFormat | undefined {
  for (const statusCode in operation.responses) {
    if (statusCodeToGroup({ statusCode }) !== '2XX') continue;
    const contentType = operation.responses[statusCode]!.mediaType?.split(';')[0]?.trim();
    if (!contentType) continue;
    if (contentType.startsWith('application/json') || contentType.endsWith('+json')) return 'json';
    if (
      ['application/', 'audio/', 'image/', 'video/'].some((type) => contentType.startsWith(type))
    ) {
      return 'blob';
    }
    if (contentType.startsWith('text/')) return 'text';
  }
}

function responseMeta(operationId: string, role: 'response' | 'responses'): SymbolMeta {
  return {
    artifact: 'sdk',
    category: 'type',
    resource: 'operation',
    resourceId: operationId,
    role: `transformed-${role}`,
  };
}

export function operationResponseType({
  operation,
  plugin,
  role,
}: {
  operation: IR.OperationObject;
  plugin: Pick<PluginInstance, 'querySymbol'>;
  role: 'response' | 'responses';
}): Symbol | undefined {
  return (
    plugin.querySymbol(responseMeta(operation.id, role)) ??
    plugin.querySymbol({
      category: 'type',
      resource: 'operation',
      resourceId: operation.id,
      role,
    })
  );
}

export function registerResponseTransformer(
  { operation, plugin }: ValidatorArgs,
  handlers: ResponseHandlers,
): void {
  // SSE can yield non-JSON data without calling the transformer.
  if (
    plugin.config.transformer.response !== 'zod' ||
    !handlers.transformer ||
    hasOperationSse({ operation })
  )
    return;

  const meta: SymbolMeta = {
    artifact: 'sdk',
    category: 'transform',
    resource: 'operation',
    resourceId: operation.id,
    role: 'response',
  };
  const existing = plugin.querySymbol(meta);
  if (existing) {
    handlers.transformer = $(existing);
    return;
  }

  const transformer = plugin.symbol(toCase(`${operation.id}ResponseTransformer`, 'camelCase'), {
    meta,
  });
  plugin.node($.const(transformer).assign(handlers.transformer));
  handlers.transformer = $(transformer);

  const wireResponses = plugin.querySymbol({
    artifact: 'types',
    category: 'type',
    resource: 'operation',
    resourceId: operation.id,
    role: 'responses',
  });
  if (!wireResponses) return;

  const { responses } = operationResponsesMap(operation);
  const client = getClientPlugin(getTypedConfig(plugin));
  const transformsAll =
    client.name === '@hey-api/client-angular' || client.name === '@hey-api/client-nuxt';
  const axiosResponseFormat = operationResponseFormat(operation);
  const output = $.type('Awaited').generic(
    $.type('ReturnType').generic($(transformer).typeofType()),
  );
  const responseTypes = $.type.object();
  let hasTransformedResponse = false;
  // Transformers receive no HTTP status, so transformed statuses share the output union.
  for (const statusCode in responses?.properties) {
    const response = operation.responses![statusCode]!;
    const mediaType = response.mediaType?.split(';')[0]?.trim();
    const isTransformed =
      transformsAll ||
      (client.name === '@hey-api/client-axios'
        ? axiosResponseFormat === 'json'
        : statusCode !== '204' &&
          Boolean(mediaType?.startsWith('application/json') || mediaType?.endsWith('+json')));
    hasTransformedResponse ||= isTransformed;
    const key = /^\d+$/.test(statusCode) ? Number(statusCode) : statusCode;
    responseTypes.prop(statusCode, (p) =>
      p.type(isTransformed ? output : $.type(wireResponses).idx($.type.literal(key))),
    );
  }
  if (!hasTransformedResponse) return;

  const responsesSymbol = plugin.symbol(
    toCase(`${operation.id}TransformedResponses`, 'PascalCase'),
    { meta: responseMeta(operation.id, 'responses') },
  );
  plugin.node($.type.alias(responsesSymbol).type(responseTypes));
  const responseSymbol = plugin.symbol(toCase(`${operation.id}TransformedResponse`, 'PascalCase'), {
    meta: responseMeta(operation.id, 'response'),
  });
  plugin.node(
    $.type
      .alias(responseSymbol)
      .export()
      .type($.type(responsesSymbol).idx($.type(responsesSymbol).keyof())),
  );
}
