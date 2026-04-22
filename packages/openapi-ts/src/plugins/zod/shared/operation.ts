import type { IR } from '@hey-api/shared';
import { operationBaseName, operationResponsesMap } from '@hey-api/shared';

import { buildOperationSchema } from './operation-schema';
import type { ProcessorContext, ProcessorResult } from './processor';

export function irOperationToAst({
  operation,
  path,
  plugin,
  processor,
  tags,
}: Pick<ProcessorContext, 'path' | 'plugin' | 'tags'> & {
  operation: IR.OperationObject;
  processor: ProcessorResult;
}): void {
  if (plugin.config.requests.enabled) {
    const { schema } = buildOperationSchema(operation);

    if (schema.properties?.body && schema.properties.body.type !== 'never') {
      processor.process({
        meta: {
          resource: 'operation',
          resourceId: operation.id,
          role: 'request-body',
        },
        naming: plugin.config.requests.body,
        namingAnchor: operationBaseName(operation),
        path: [...path, 'body'],
        plugin,
        schema: schema.properties.body,
        tags,
      });
    }

    // TODO: add support for cookies

    if (schema.properties?.headers && schema.properties.headers.type === 'object') {
      processor.process({
        meta: {
          resource: 'operation',
          resourceId: operation.id,
          role: 'request-headers',
        },
        naming: plugin.config.requests.headers,
        namingAnchor: operationBaseName(operation),
        path: [...path, 'headers'],
        plugin,
        schema: schema.properties.headers,
        tags,
      });
    }

    if (schema.properties?.path && schema.properties.path.type === 'object') {
      processor.process({
        meta: {
          resource: 'operation',
          resourceId: operation.id,
          role: 'request-path',
        },
        naming: plugin.config.requests.path,
        namingAnchor: operationBaseName(operation),
        path: [...path, 'path'],
        plugin,
        schema: schema.properties.path,
        tags,
      });
    }

    if (schema.properties?.query && schema.properties.query.type === 'object') {
      processor.process({
        meta: {
          resource: 'operation',
          resourceId: operation.id,
          role: 'request-query',
        },
        naming: plugin.config.requests.query,
        namingAnchor: operationBaseName(operation),
        path: [...path, 'query'],
        plugin,
        schema: schema.properties.query,
        tags,
      });
    }
  }

  if (plugin.config.responses.enabled) {
    if (operation.responses) {
      const { response } = operationResponsesMap(operation);

      if (response) {
        processor.process({
          meta: {
            resource: 'operation',
            resourceId: operation.id,
            role: 'responses',
          },
          naming: plugin.config.responses,
          namingAnchor: operationBaseName(operation),
          path: [...path, 'responses'],
          plugin,
          schema: response,
          tags,
        });
      }
    }
  }
}
