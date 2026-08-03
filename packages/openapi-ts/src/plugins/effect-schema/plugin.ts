import { operationResponsesMap } from '@hey-api/shared';

import { buildOperationSchema } from '../shared/utils/operation-schema';
import { emitDefinitionSchema, emitNamedSchema } from './schema';
import type { EffectSchemaPlugin } from './types';

export const handler: EffectSchemaPlugin['Handler'] = ({ plugin }) => {
  if (plugin.config.definitions.enabled) {
    plugin.forEach('parameter', 'requestBody', 'schema', (event) => {
      switch (event.type) {
        case 'parameter':
          emitDefinitionSchema({
            path: event._path,
            plugin,
            schema: event.parameter.schema,
            tags: event.tags,
          });
          break;
        case 'requestBody':
          emitDefinitionSchema({
            path: event._path,
            plugin,
            schema: event.requestBody.schema,
            tags: event.tags,
          });
          break;
        case 'schema':
          emitDefinitionSchema({
            path: event._path,
            plugin,
            schema: event.schema,
            tags: event.tags,
          });
          break;
      }
    });
  }

  plugin.forEach(
    'operation',
    ({ _path, operation, tags }) => {
      if (plugin.config.requests.enabled) {
        emitNamedSchema({
          fileInput: true,
          meta: {
            resource: 'operation',
            resourceId: operation.id,
            role: 'data',
          },
          name: operation.id,
          naming: plugin.config.requests,
          path: [..._path, 'request'],
          plugin,
          schema: buildOperationSchema(operation).schema,
          tags,
        });
      }

      if (plugin.config.responses.enabled) {
        const { response } = operationResponsesMap(operation);
        if (response) {
          emitNamedSchema({
            meta: {
              resource: 'operation',
              resourceId: operation.id,
              role: 'responses',
            },
            name: operation.id,
            naming: plugin.config.responses,
            path: [..._path, 'responses'],
            plugin,
            schema: response,
            tags,
          });
        }
      }
    },
    {
      order: 'declarations',
    },
  );

  if (plugin.config.webhooks.enabled) {
    plugin.forEach(
      'webhook',
      ({ _path, operation, tags }) => {
        emitNamedSchema({
          fileInput: true,
          meta: {
            resource: 'webhook',
            resourceId: operation.id,
            role: 'data',
          },
          name: operation.id,
          naming: plugin.config.webhooks,
          path: _path,
          plugin,
          schema: buildOperationSchema(operation).schema,
          tags,
        });
      },
      {
        order: 'declarations',
      },
    );
  }
};
