import type { OpenAPIV3 } from '@hey-api/spec-types';

import type { Context } from '../../../ir/context';
import type { IR } from '../../../ir/types';
import type { State } from '../../../openApi/shared/types/state';
import { operationToId } from '../../../openApi/shared/utils/operation';
import { contentToSchema, mediaTypeObjects } from './mediaType';
import { paginationField } from './pagination';
import { parseExtensions, schemaToIrSchema } from './schema';

interface Operation
  extends Omit<OpenAPIV3.OperationObject, 'parameters'>, Pick<IR.OperationObject, 'parameters'> {}

function parseOperationJsDoc({
  irOperation,
  operation,
}: {
  irOperation: IR.OperationObject;
  operation: Operation;
}) {
  if (operation.deprecated !== undefined) {
    irOperation.deprecated = operation.deprecated;
  }

  if (operation.description) {
    irOperation.description = operation.description;
  }

  if (operation.summary) {
    irOperation.summary = operation.summary;
  }

  if (operation.tags?.length) {
    irOperation.tags = operation.tags;
  }
}

function initIrOperation({
  context,
  method,
  operation,
  path,
  state,
}: Pick<IR.OperationObject, 'method' | 'path'> & {
  context: Context;
  operation: Operation;
  state: State;
}): IR.OperationObject {
  const irOperation: IR.OperationObject = {
    id: operationToId({
      context,
      id: operation.operationId,
      method,
      path,
      state,
    }),
    method,
    path,
  };

  if (operation.operationId) {
    irOperation.operationId = operation.operationId;
  }

  parseOperationJsDoc({
    irOperation,
    operation,
  });

  parseExtensions({
    source: operation,
    target: irOperation,
  });

  return irOperation;
}

function operationToIrOperation({
  ambiguousSecurityKeys,
  context,
  method,
  operation,
  path,
  securitySchemesMap,
  state,
}: Pick<IR.OperationObject, 'method' | 'path'> & {
  ambiguousSecurityKeys: ReadonlySet<string>;
  context: Context;
  operation: Operation;
  securitySchemesMap: Map<string, OpenAPIV3.SecuritySchemeObject>;
  state: State;
}): IR.OperationObject {
  const irOperation = initIrOperation({
    context,
    method,
    operation,
    path,
    state,
  });

  if (operation.parameters) {
    irOperation.parameters = operation.parameters;
  }

  if (operation.requestBody) {
    const requestBody =
      '$ref' in operation.requestBody
        ? context.resolveRef<OpenAPIV3.RequestBodyObject>(operation.requestBody.$ref)
        : operation.requestBody;
    const contents = mediaTypeObjects({ content: requestBody.content });
    // TODO: add support for multiple content types, for now prefer JSON
    const content = contents.find((content) => content.type === 'json') || contents[0];

    if (content) {
      const pagination = paginationField({
        context,
        name: '',
        schema:
          content.schema && '$ref' in content.schema
            ? {
                allOf: [{ ...content.schema }],
                description: requestBody.description,
              }
            : {
                description: requestBody.description,
                ...content.schema,
              },
      });

      irOperation.body = {
        mediaType: content.mediaType,
        schema: schemaToIrSchema({
          context,
          schema:
            '$ref' in operation.requestBody
              ? {
                  allOf: [{ ...operation.requestBody }],
                  description: requestBody.description,
                }
              : content.schema && '$ref' in content.schema
                ? {
                    allOf: [{ ...content.schema }],
                    description: requestBody.description,
                  }
                : {
                    description: requestBody.description,
                    ...content.schema,
                  },
          state: undefined,
        }),
      };

      if (pagination) {
        irOperation.body.pagination = pagination;
      }

      if (requestBody.required) {
        irOperation.body.required = requestBody.required;
      }

      if (content.type) {
        irOperation.body.type = content.type;
      }
    }
  }

  for (const name in operation.responses) {
    if (name.startsWith('x-')) continue;

    if (!irOperation.responses) {
      irOperation.responses = {};
    }

    const response = operation.responses[name]! as
      | OpenAPIV3.ResponseObject
      | OpenAPIV3.ReferenceObject;
    const responseObject =
      '$ref' in response ? context.resolveRef<OpenAPIV3.ResponseObject>(response.$ref) : response;
    const contents = mediaTypeObjects({ content: responseObject.content });
    // TODO: add support for multiple content types, for now prefer JSON
    const content = contents.find((content) => content.type === 'json') || contents[0];

    if (content) {
      irOperation.responses[name] = {
        mediaType: content.mediaType,
        schema: schemaToIrSchema({
          context,
          schema: {
            description: responseObject.description,
            ...contentToSchema({ content }),
          },
          state: undefined,
        }),
      };
    } else {
      irOperation.responses[name] = {
        schema: {
          description: responseObject.description,
          // TODO: parser - cover all statues with empty response bodies
          // 1xx, 204, 205, 304
          type: name === '204' ? 'void' : 'unknown',
        },
      };
    }
  }

  if (operation.security) {
    const securitySchemeObjects: Map<string, IR.SecurityObject> = new Map();

    for (const securityRequirementObject of operation.security) {
      const names = Object.keys(securityRequirementObject);
      if (!names.length) {
        securitySchemeObjects.clear();
        break;
      }

      for (const name of names) {
        const securitySchemeObject = securitySchemesMap.get(name);

        if (!securitySchemeObject) {
          continue;
        }

        if (ambiguousSecurityKeys.has(name)) {
          (securitySchemeObject as IR.SecurityObject).key = name;
        }
        securitySchemeObjects.set(name, securitySchemeObject);
      }
    }

    if (securitySchemeObjects.size) {
      irOperation.security = Array.from(securitySchemeObjects.values());
    }
  }

  // TODO: parser - handle servers
  // qux: operation.servers

  return irOperation;
}

export function parsePathOperation({
  ambiguousSecurityKeys,
  context,
  method,
  operation,
  path,
  securitySchemesMap,
  state,
}: {
  ambiguousSecurityKeys: ReadonlySet<string>;
  context: Context;
  method: Extract<
    keyof OpenAPIV3.PathItemObject,
    'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace'
  >;
  operation: Operation;
  path: keyof IR.PathsObject;
  securitySchemesMap: Map<string, OpenAPIV3.SecuritySchemeObject>;
  state: State;
}) {
  if (!context.ir.paths) {
    context.ir.paths = {};
  }

  if (!context.ir.paths[path]) {
    context.ir.paths[path] = {};
  }

  if (operation.servers) {
    context.ir.servers = [...(context.ir.servers ?? []), ...operation.servers];
  }

  context.ir.paths[path][method] = operationToIrOperation({
    ambiguousSecurityKeys,
    context,
    method,
    operation,
    path,
    securitySchemesMap,
    state,
  });
}
