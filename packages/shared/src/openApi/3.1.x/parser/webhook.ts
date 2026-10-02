import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import { satisfies } from '../../../config/utils/dependencies';
import type { Context } from '../../../ir/context';
import { mergeParametersObjects } from '../../../openApi/shared/utils/parameter';
import { parseWebhookOperation } from './operation';
import { parametersArrayToObject } from './parameter';

export function parseWebhooks({
  ambiguousSecurityKeys,
  context,
  securitySchemesMap,
}: Pick<
  Parameters<typeof parseWebhookOperation>[0],
  'ambiguousSecurityKeys' | 'securitySchemesMap'
> & {
  context: Context<OpenAPIV3_1.Document>;
}) {
  const state: Parameters<typeof parseWebhookOperation>[0]['state'] = {
    ids: new Map(),
  };

  for (const key in context.spec.webhooks) {
    const webhook = context.spec.webhooks[key]!;

    const finalWebhook =
      '$ref' in webhook
        ? {
            ...context.resolveRef<OpenAPIV3_1.PathItemObject>(webhook.$ref!),
            ...webhook,
          }
        : webhook;

    const operationArgs: Omit<Parameters<typeof parseWebhookOperation>[0], 'method'> = {
      ambiguousSecurityKeys,
      context,
      key,
      operation: {
        description: finalWebhook.description,
        parameters: parametersArrayToObject({
          context,
          parameters: finalWebhook.parameters,
        }),
        security: context.spec.security,
        servers: finalWebhook.servers,
        summary: finalWebhook.summary,
      },
      securitySchemesMap,
      state,
    };

    if (finalWebhook.delete) {
      parseWebhookOperation({
        ...operationArgs,
        method: 'delete',
        operation: {
          ...operationArgs.operation,
          ...finalWebhook.delete,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalWebhook.delete.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalWebhook.get) {
      parseWebhookOperation({
        ...operationArgs,
        method: 'get',
        operation: {
          ...operationArgs.operation,
          ...finalWebhook.get,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalWebhook.get.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalWebhook.head) {
      parseWebhookOperation({
        ...operationArgs,
        method: 'head',
        operation: {
          ...operationArgs.operation,
          ...finalWebhook.head,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalWebhook.head.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalWebhook.options) {
      parseWebhookOperation({
        ...operationArgs,
        method: 'options',
        operation: {
          ...operationArgs.operation,
          ...finalWebhook.options,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalWebhook.options.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalWebhook.patch) {
      parseWebhookOperation({
        ...operationArgs,
        method: 'patch',
        operation: {
          ...operationArgs.operation,
          ...finalWebhook.patch,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalWebhook.patch.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalWebhook.post) {
      parseWebhookOperation({
        ...operationArgs,
        method: 'post',
        operation: {
          ...operationArgs.operation,
          ...finalWebhook.post,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalWebhook.post.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalWebhook.put) {
      parseWebhookOperation({
        ...operationArgs,
        method: 'put',
        operation: {
          ...operationArgs.operation,
          ...finalWebhook.put,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalWebhook.put.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (satisfies(context.spec.openapi, '>=3.2.0') && finalWebhook.query) {
      parseWebhookOperation({
        ...operationArgs,
        method: 'query',
        operation: {
          ...operationArgs.operation,
          ...finalWebhook.query,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalWebhook.query.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalWebhook.trace) {
      parseWebhookOperation({
        ...operationArgs,
        method: 'trace',
        operation: {
          ...operationArgs.operation,
          ...finalWebhook.trace,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalWebhook.trace.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }
  }
}
