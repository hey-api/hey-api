import type { Symbol } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { buildSymbolIn, pathToJsonPointer } from '@hey-api/shared';

import { $ } from '../../../../ts-dsl';
import { createClientOptions } from '../shared/client-options';
import type { OperationSymbols } from '../shared/operation';
import { operationToType } from '../shared/operation';
import { webhookToType } from '../shared/webhook';
import type { HeyApiTypeScriptPlugin } from '../types';
import { createProcessor } from './processor';

export const handlerV1: HeyApiTypeScriptPlugin['Handler'] = ({ plugin }) => {
  const nodeClientIndex = plugin.node(null);
  const nodeWebhooksIndex = plugin.node(null);
  const nodeOperationsIndex = plugin.node(null);

  const operations: Array<{ id: string; symbols: OperationSymbols }> = [];
  const servers: Array<IR.ServerObject> = [];
  const webhooks: Array<Symbol> = [];

  const processor = createProcessor(plugin);

  plugin.forEach(
    'operation',
    'parameter',
    'requestBody',
    'schema',
    'server',
    'webhook',
    (event) => {
      switch (event.type) {
        case 'operation': {
          const symbols = operationToType({
            operation: event.operation,
            path: event._path,
            plugin,
            processor,
            tags: event.tags,
          });
          if (plugin.config.operations.enabled) {
            operations.push({ id: event.operation.id, symbols });
          }
          break;
        }
        case 'parameter':
          processor.process({
            meta: {
              resource: 'definition',
              resourceId: pathToJsonPointer(event._path),
            },
            naming: plugin.config.definitions,
            path: event._path,
            plugin,
            schema: event.parameter.schema,
            tags: event.tags,
          });
          break;
        case 'requestBody':
          processor.process({
            meta: {
              resource: 'definition',
              resourceId: pathToJsonPointer(event._path),
            },
            naming: plugin.config.definitions,
            path: event._path,
            plugin,
            schema: event.requestBody.schema,
            tags: event.tags,
          });
          break;
        case 'schema':
          processor.process({
            meta: {
              resource: 'definition',
              resourceId: pathToJsonPointer(event._path),
            },
            naming: plugin.config.definitions,
            path: event._path,
            plugin,
            schema: event.schema,
            tags: event.tags,
          });
          break;
        case 'server':
          servers.push(event.server);
          break;
        case 'webhook':
          webhooks.push(
            webhookToType({
              operation: event.operation,
              path: event._path,
              plugin,
              processor,
              tags: event.tags,
            }),
          );
          break;
      }
    },
    {
      order: 'declarations',
    },
  );

  createClientOptions({ nodeIndex: nodeClientIndex, plugin, servers });

  if (webhooks.length) {
    const symbol = plugin.symbol(
      buildSymbolIn({
        meta: {
          category: 'type',
          resource: 'webhook',
          variant: 'container',
        },
        name: 'Webhooks',
        naming: {
          case: plugin.config.case,
        },
        plugin,
      }),
    );
    const node = $.type
      .alias(symbol)
      .export()
      .type($.type.or(...webhooks));
    plugin.node(node, nodeWebhooksIndex);
  }

  if (operations.length) {
    const symbol = plugin.symbol(
      buildSymbolIn({
        meta: {
          category: 'type',
          resource: 'operation',
          variant: 'container',
        },
        name: plugin.config.operations.name,
        naming: {
          case: plugin.config.case,
        },
        plugin,
      }),
    );
    const type = $.type.object();
    for (const { id, symbols } of operations) {
      const entry = $.type.object().prop('data', (p) => p.type($.type(symbols.data)));
      if (symbols.errors) {
        const errorsSymbol = symbols.errors;
        entry.prop('errors', (p) => p.type($.type(errorsSymbol)));
      }
      if (symbols.responses) {
        const responsesSymbol = symbols.responses;
        entry.prop('responses', (p) => p.type($.type(responsesSymbol)));
      }
      type.prop(id, (p) => p.type(entry));
    }
    const node = $.type.alias(symbol).export().type(type);
    plugin.node(node, nodeOperationsIndex);
  }
};
