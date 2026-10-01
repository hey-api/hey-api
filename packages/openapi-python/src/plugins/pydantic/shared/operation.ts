import type { IR } from '@hey-api/shared';
import { operationResponsesMap } from '@hey-api/shared';

import { exportAst } from './export';
import { buildOperationSchema } from './operation-schema';
import type { ProcessorContext, ProcessorResult } from './processor';

/**
 * The error schema without its untyped members. An `Any` member absorbs the
 * rest of a union, so a no-content error response would erase the schemas
 * declared alongside it. Nothing is emitted when no typed member is left.
 */
function typedMembersOnly(schema: IR.SchemaObject): IR.SchemaObject | undefined {
  if (schema.type === 'unknown') return undefined;
  if (!schema.items) return schema;

  const items = schema.items.filter((item) => item.type !== 'unknown');
  if (!items.length) return undefined;
  if (items.length === schema.items.length) return schema;
  return items.length === 1 ? items[0] : { ...schema, items };
}

/**
 * Processes an operation's error union. A bare `$ref` is aliased to the
 * referenced model rather than wrapped in a `RootModel` subclass.
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

      // No analogue of TypeScript's status-code-keyed map: as a Pydantic model
      // every status would be a required field, and a response carries one.
      const errorSchema = error ? typedMembersOnly(error) : undefined;

      if (errorSchema) {
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
          schema: errorSchema,
          tags,
        });
      }
    }
  }
}
