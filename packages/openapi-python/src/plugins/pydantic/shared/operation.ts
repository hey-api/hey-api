import type { IR } from '@hey-api/shared';
import { operationResponsesMap } from '@hey-api/shared';

import { exportAst } from './export';
import { buildOperationSchema } from './operation-schema';
import type { ProcessorContext, ProcessorResult } from './processor';

/**
 * A union with an untyped ("unknown"/`Any`) member tells a caller nothing,
 * since `Any` absorbs every other member for practical purposes. Rather than
 * emit e.g. `RootModel[Union[Any, str]]`, callers get no symbol at all for
 * that operation's error type.
 */
function collapsesToAny(schema: IR.SchemaObject): boolean {
  if (schema.type === 'unknown') return true;
  return schema.items?.some((item) => item.type === 'unknown') ?? false;
}

/**
 * Processes the deduplicated error union schema for an operation.
 *
 * When the schema is a bare `$ref`, the referenced model is aliased directly
 * instead of being wrapped in a `RootModel` subclass, mirroring how a plain
 * reference is otherwise resolved rather than re-exported under a new name.
 */
function processErrorSchema(ctx: ProcessorContext & { processor: ProcessorResult }): void {
  const { processor, ...rest } = ctx;

  if (rest.schema.$ref) {
    let isResolvable = true;
    try {
      rest.plugin.context.resolveIrRef<IR.SchemaObject>(rest.schema.$ref);
    } catch {
      isResolvable = false;
    }

    if (isResolvable) {
      const node = processor.process({ ...rest, export: false });
      if (node && node.kind !== 'model' && node.kind !== 'enum') {
        exportAst({ ...rest, node: { kind: 'alias', type: node.type }, plugin: rest.plugin });
        return;
      }
    }
  }

  processor.process(rest);
}

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
        namingAnchor: operation.id,
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
        namingAnchor: operation.id,
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
        namingAnchor: operation.id,
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
        namingAnchor: operation.id,
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
          namingAnchor: operation.id,
          path: [...path, 'responses'],
          plugin,
          schema: response,
          tags,
        });
      }
    }
  }

  if (plugin.config.errors.enabled) {
    if (operation.responses) {
      const { error } = operationResponsesMap(operation);

      // The status-code-keyed map TypeScript generates (`{ '404': X; '500':
      // Y }`) has no Python runtime analogue: as a Pydantic model every
      // status would be a required field, but a real response only ever
      // carries one status, so no real payload could ever validate against
      // it. Only the deduplicated union is generated.
      if (error && !collapsesToAny(error)) {
        processErrorSchema({
          meta: {
            resource: 'operation',
            resourceId: operation.id,
            role: 'error',
          },
          naming: {
            case: plugin.config.errors.case,
            name: plugin.config.errors.error,
          },
          namingAnchor: operation.id,
          path: [...path, 'error'],
          plugin,
          processor,
          schema: error,
          tags,
        });
      }
    }
  }
}
