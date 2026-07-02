import type { OpenAPIV2 } from '@hey-api/spec-types';

import type { Context } from '../../../ir/context';
import type { IR } from '../../../ir/types';
import type { State } from '../../../openApi/shared/types/state';
import { operationToId } from '../../../openApi/shared/utils/operation';
import { contentToSchema, mediaTypeObjects } from './mediaType';
import { paginationField } from './pagination';
import { parseExtensions, schemaToIrSchema } from './schema';

interface Operation
  extends Omit<OpenAPIV2.OperationObject, 'parameters'>, Pick<IR.OperationObject, 'parameters'> {
  requestBody?: OpenAPIV2.OperationObject['parameters'];
}

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
  securitySchemesMap: Map<string, OpenAPIV2.SecuritySchemeObject>;
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

  let isRequestBodyRequired = false;
  const requestBodyObject: IR.BodyObject = {
    mediaType: '',
    schema: {
      properties: {},
      required: [],
      type: 'object',
    },
  };
  const requestBodyObjectRequired: Array<string> = [];

  // Check if there are any body parameters (not formData) to determine default media type
  const hasBodyParameter = operation.requestBody?.some((param) => {
    const resolvedParam =
      '$ref' in param ? context.resolveRef<OpenAPIV2.ParameterObject>(param.$ref) : param;
    return resolvedParam.in === 'body';
  });

  for (const requestBodyParameter of operation.requestBody ?? []) {
    const requestBody =
      '$ref' in requestBodyParameter
        ? context.resolveRef<OpenAPIV2.ParameterObject>(requestBodyParameter.$ref)
        : requestBodyParameter;
    const schema: OpenAPIV2.SchemaObject =
      requestBody.in === 'body'
        ? requestBody.schema
        : {
            ...requestBody,
            format: requestBody.type === 'file' ? 'binary' : requestBody.format,
            required: undefined,
            type: requestBody.type === 'file' ? 'string' : requestBody.type,
          };

    // Only default to JSON if we have body parameters and no consumes specified
    // FormData parameters without consumes should not get a default media type
    let mimeTypes = operation.consumes;
    if (!mimeTypes && hasBodyParameter && requestBody.in === 'body') {
      mimeTypes = ['application/json'];
    }

    const contents = mediaTypeObjects({
      mimeTypes,
      response: { schema },
    });
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

      const irSchema = schemaToIrSchema({
        context,
        schema:
          '$ref' in requestBody
            ? {
                allOf: [
                  {
                    ...requestBody,
                    $ref: requestBody.$ref as string,
                    required: [],
                    type: 'string',
                  },
                ],
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
      });

      requestBodyObject.mediaType = content.mediaType;

      if (requestBody.in === 'body') {
        requestBodyObject.schema = irSchema;
      } else {
        requestBodyObject.schema.properties![requestBody.name] = irSchema;

        if (requestBody.required) {
          requestBodyObjectRequired.push(requestBody.name);
        }
      }

      if (pagination) {
        requestBodyObject.pagination = pagination;
      }

      if (content.type) {
        requestBodyObject.type = content.type;
      }
    }

    if (requestBody.required) {
      isRequestBodyRequired = true;
    }
  }

  if (requestBodyObject.mediaType) {
    if (requestBodyObjectRequired.length) {
      requestBodyObject.schema.required = requestBodyObjectRequired;
    }

    irOperation.body = requestBodyObject;

    if (isRequestBodyRequired) {
      irOperation.body.required = isRequestBodyRequired;
    }
  }

  for (const name in operation.responses) {
    if (!irOperation.responses) {
      irOperation.responses = {};
    }

    const response = operation.responses[name]!;
    const responseObject =
      '$ref' in response ? context.resolveRef<OpenAPIV2.ResponseObject>(response.$ref) : response;
    const contents = mediaTypeObjects({
      // assume JSON by default
      mimeTypes: operation.produces ? operation.produces : ['application/json'],
      response: responseObject,
    });
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

        let irSecuritySchemeObject: IR.SecurityObject | undefined;

        if (securitySchemeObject.type === 'apiKey') {
          irSecuritySchemeObject = securitySchemeObject;
        }

        if (securitySchemeObject.type === 'basic') {
          irSecuritySchemeObject = {
            description: securitySchemeObject.description,
            scheme: 'basic',
            type: 'http',
          };
        }

        if (securitySchemeObject.type === 'oauth2') {
          irSecuritySchemeObject = {
            description: securitySchemeObject.description,
            flows: {},
            type: 'oauth2',
          };

          switch (securitySchemeObject.flow) {
            case 'accessCode':
              irSecuritySchemeObject.flows.authorizationCode = {
                authorizationUrl: securitySchemeObject.authorizationUrl!,
                scopes: securitySchemeObject.scopes,
                tokenUrl: securitySchemeObject.tokenUrl!,
              };
              break;
            case 'application':
              irSecuritySchemeObject.flows.clientCredentials = {
                scopes: securitySchemeObject.scopes,
                tokenUrl: securitySchemeObject.tokenUrl!,
              };
              break;
            case 'implicit':
              irSecuritySchemeObject.flows.implicit = {
                authorizationUrl: securitySchemeObject.authorizationUrl!,
                scopes: securitySchemeObject.scopes,
              };
              break;
            case 'password':
              irSecuritySchemeObject.flows.password = {
                scopes: securitySchemeObject.scopes,
                tokenUrl: securitySchemeObject.tokenUrl!,
              };
              break;
          }
        }

        if (!irSecuritySchemeObject) {
          continue;
        }

        if (ambiguousSecurityKeys.has(name)) {
          irSecuritySchemeObject.key = name;
        }

        securitySchemeObjects.set(name, irSecuritySchemeObject);
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
    keyof OpenAPIV2.PathItemObject,
    'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace'
  >;
  operation: Operation;
  path: keyof IR.PathsObject;
  securitySchemesMap: Map<string, OpenAPIV2.SecuritySchemeObject>;
  state: State;
}) {
  if (!context.ir.paths) {
    context.ir.paths = {};
  }

  if (!context.ir.paths[path]) {
    context.ir.paths[path] = {};
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
