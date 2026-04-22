import type { IR } from '@hey-api/shared';
import { operationBaseName } from '@hey-api/shared';

import { buildOperationSchema } from './operation-schema';
import type { ProcessorContext, ProcessorResult } from './processor';

export function irWebhookToAst({
  operation,
  path,
  plugin,
  processor,
  tags,
}: Pick<ProcessorContext, 'path' | 'plugin' | 'tags'> & {
  operation: IR.OperationObject;
  processor: ProcessorResult;
}): void {
  if (plugin.config.webhooks.enabled) {
    const { schema } = buildOperationSchema(operation);

    processor.process({
      meta: {
        resource: 'webhook',
        resourceId: operation.id,
        role: 'data',
      },
      naming: plugin.config.webhooks,
      namingAnchor: operationBaseName(operation),
      path,
      plugin,
      schema,
      tags,
    });
  }
}
