import type { Symbol } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { buildSymbolIn } from '@hey-api/shared';

import { $ } from '../../../../ts-dsl';
import { createSchemaComment } from '../../../shared/utils/schema';
import type { HeyApiTypeScriptPlugin } from '../types';
import type { ProcessorResult } from './processor';

export function webhookToType({
  operation,
  path,
  plugin,
  processor,
  tags,
}: {
  operation: IR.OperationObject;
  path: ReadonlyArray<string | number>;
  plugin: HeyApiTypeScriptPlugin['Instance'];
  processor: ProcessorResult;
  tags?: ReadonlyArray<string>;
}): Symbol {
  let symbolWebhookPayload: Symbol | undefined;

  if (operation.body) {
    symbolWebhookPayload = plugin.symbol(
      buildSymbolIn({
        meta: {
          category: 'type',
          path,
          resource: 'webhook',
          resourceId: operation.id,
          role: 'payload',
          tags,
        },
        name: operation.id,
        naming: {
          case: plugin.config.webhooks.case,
          name: plugin.config.webhooks.payload,
        },
        operation,
        path,
        plugin,
      }),
    );

    const payloadResult = processor.process({
      export: false,
      meta: {
        resource: 'webhook',
        resourceId: operation.id,
      },
      naming: plugin.config.definitions,
      path: [...path, operation.id, 'payload'],
      plugin,
      schema: operation.body.schema,
    });

    const payloadNode = $.type
      .alias(symbolWebhookPayload)
      .export()
      .$if(plugin.config.comments && createSchemaComment(operation.body.schema), (t, v) => t.doc(v))
      .type(payloadResult?.type ?? $.type('never'));
    plugin.node(payloadNode);
  }

  const requestType = $.type
    .object()
    .prop('body', (p) =>
      p
        .required(Boolean(symbolWebhookPayload))
        .type(symbolWebhookPayload ? $.type(symbolWebhookPayload) : $.type('never')),
    )
    .prop('key', (p) => p.required(true).type($.type.literal(operation.path)))
    .prop('path', (p) => p.required(false).type($.type('never')))
    .prop('query', (p) => p.required(false).type($.type('never')));

  const symbol = plugin.symbol(
    buildSymbolIn({
      meta: {
        category: 'type',
        path,
        resource: 'webhook',
        resourceId: operation.id,
        role: 'data',
        tags,
      },
      name: operation.id,
      naming: plugin.config.webhooks,
      operation,
      path,
      plugin,
    }),
  );

  const node = $.type.alias(symbol).export().type(requestType);
  plugin.node(node);

  return symbol;
}
