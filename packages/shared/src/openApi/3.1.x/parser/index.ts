import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import type { Context } from '../../../ir/context';
import { buildResourceMetadata } from '../../../openApi/shared/graph/meta';
import { transformOpenApiSpec } from '../../../openApi/shared/transforms';
import type { State } from '../../../openApi/shared/types/state';
import {
  createFilteredDependencies,
  createFilters,
  hasFilters,
} from '../../../openApi/shared/utils/filter';
import { buildGraph } from '../../../openApi/shared/utils/graph';
import { mergeParametersObjects } from '../../../openApi/shared/utils/parameter';
import { computeAmbiguousSecurityKeys } from '../../../openApi/shared/utils/security';
import { handleValidatorResult } from '../../../openApi/shared/utils/validator';
import { pathToJsonPointer } from '../../../utils/ref';
import { filterSpec } from './filter';
import { parsePathOperation } from './operation';
import { parametersArrayToObject, parseParameter } from './parameter';
import { parseRequestBody } from './requestBody';
import { parseSchema } from './schema';
import { parseServers } from './server';
import { validateOpenApiSpec } from './validate';
import { parseWebhooks } from './webhook';

export function parseV3_1_X(context: Context<OpenAPIV3_1.Document>): void {
  if (context.config.parser.validate_EXPERIMENTAL) {
    const result = validateOpenApiSpec(context.spec, context.logger);
    handleValidatorResult({ context, result });
  }

  const shouldFilterSpec = hasFilters(context.config.parser.filters);
  if (shouldFilterSpec) {
    const filters = createFilters(context.config.parser.filters, context.spec, context.logger);
    const { graph } = buildGraph(context.spec, context.logger);
    const { resourceMetadata } = buildResourceMetadata(graph, context.logger);
    const sets = createFilteredDependencies({
      filters,
      logger: context.logger,
      resourceMetadata,
    });
    filterSpec({
      ...sets,
      logger: context.logger,
      preserveOrder: filters.preserveOrder,
      spec: context.spec,
    });
  }

  transformOpenApiSpec({ context });

  const state: State = {
    ids: new Map(),
  };
  const securitySchemesMap = new Map<string, OpenAPIV3_1.SecuritySchemeObject>();

  // TODO: parser - handle more component types, old parser handles only parameters and schemas
  if (context.spec.components) {
    for (const name in context.spec.components.securitySchemes) {
      const securityOrReference = context.spec.components.securitySchemes[name]!;
      const securitySchemeObject =
        '$ref' in securityOrReference
          ? context.resolveRef<OpenAPIV3_1.SecuritySchemeObject>(securityOrReference.$ref)
          : securityOrReference;
      securitySchemesMap.set(name, securitySchemeObject);
    }

    for (const name in context.spec.components.parameters) {
      const $ref = pathToJsonPointer(['components', 'parameters', name]);
      const parameterOrReference = context.spec.components.parameters[name]!;
      const parameter =
        '$ref' in parameterOrReference
          ? context.resolveRef<OpenAPIV3_1.ParameterObject>(parameterOrReference.$ref)
          : parameterOrReference;

      parseParameter({
        $ref,
        context,
        parameter,
      });
    }

    for (const name in context.spec.components.requestBodies) {
      const $ref = pathToJsonPointer(['components', 'requestBodies', name]);
      const requestBodyOrReference = context.spec.components.requestBodies[name]!;
      const requestBody =
        '$ref' in requestBodyOrReference
          ? context.resolveRef<OpenAPIV3_1.RequestBodyObject>(requestBodyOrReference.$ref)
          : requestBodyOrReference;

      parseRequestBody({
        $ref,
        context,
        requestBody,
      });
    }

    for (const name in context.spec.components.schemas) {
      const $ref = pathToJsonPointer(['components', 'schemas', name]);
      const schema = context.spec.components.schemas[name]!;

      parseSchema({
        $ref,
        context,
        schema,
      });
    }
  }

  const ambiguousSecurityKeys = computeAmbiguousSecurityKeys(securitySchemesMap);

  parseServers({ context });

  for (const path in context.spec.paths) {
    if (path.startsWith('x-')) continue;
    const pathItem = context.spec.paths[
      path as keyof OpenAPIV3_1.PathsObject
    ]! as OpenAPIV3_1.PathItemObject;

    const finalPathItem = pathItem.$ref
      ? {
          ...context.resolveRef<OpenAPIV3_1.PathItemObject>(pathItem.$ref),
          ...pathItem,
        }
      : pathItem;

    const operationArgs: Omit<Parameters<typeof parsePathOperation>[0], 'method'> = {
      ambiguousSecurityKeys,
      context,
      operation: {
        description: finalPathItem.description,
        parameters: parametersArrayToObject({
          context,
          parameters: finalPathItem.parameters,
        }),
        security: context.spec.security,
        servers: finalPathItem.servers,
        summary: finalPathItem.summary,
      },
      path: path as `/${string}`,
      securitySchemesMap,
      state,
    };

    if (finalPathItem.delete) {
      parsePathOperation({
        ...operationArgs,
        method: 'delete',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.delete,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalPathItem.delete.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalPathItem.get) {
      parsePathOperation({
        ...operationArgs,
        method: 'get',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.get,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalPathItem.get.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalPathItem.head) {
      parsePathOperation({
        ...operationArgs,
        method: 'head',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.head,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalPathItem.head.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalPathItem.options) {
      parsePathOperation({
        ...operationArgs,
        method: 'options',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.options,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalPathItem.options.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalPathItem.patch) {
      parsePathOperation({
        ...operationArgs,
        method: 'patch',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.patch,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalPathItem.patch.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalPathItem.post) {
      parsePathOperation({
        ...operationArgs,
        method: 'post',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.post,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalPathItem.post.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalPathItem.put) {
      parsePathOperation({
        ...operationArgs,
        method: 'put',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.put,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalPathItem.put.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }

    if (finalPathItem.trace) {
      parsePathOperation({
        ...operationArgs,
        method: 'trace',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.trace,
          parameters: mergeParametersObjects({
            source: parametersArrayToObject({
              context,
              parameters: finalPathItem.trace.parameters,
            }),
            target: operationArgs.operation.parameters,
          }),
        },
      });
    }
  }

  parseWebhooks({ ambiguousSecurityKeys, context, securitySchemesMap });
}
