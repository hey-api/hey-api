import type { Logger } from '@hey-api/codegen-core';

import type { Graph } from '../../../graph';
import { createOperationKey } from '../../../ir/operation';
import { jsonPointerToPath } from '../../../utils/ref';
import { addNamespace, stringToNamespace } from '../utils/filter';
import { httpMethods } from '../utils/operation';

export type ResourceMetadata = {
  operations: Map<
    string,
    {
      dependencies: Set<string>;
      deprecated: boolean;
      tags: Set<string>;
    }
  >;
  parameters: Map<
    string,
    {
      dependencies: Set<string>;
      deprecated: boolean;
    }
  >;
  requestBodies: Map<
    string,
    {
      dependencies: Set<string>;
      deprecated: boolean;
    }
  >;
  responses: Map<
    string,
    {
      dependencies: Set<string>;
      deprecated: boolean;
    }
  >;
  schemas: Map<
    string,
    {
      dependencies: Set<string>;
      deprecated: boolean;
    }
  >;
};

/**
 * Builds a resource metadata map from a Graph, matching the old Graph interface
 * for compatibility with filtering code.
 */
export function buildResourceMetadata(
  graph: Graph,
  logger: Logger,
): {
  resourceMetadata: ResourceMetadata;
} {
  const eventBuildResourceMetadata = logger.timeEvent('build-resource-metadata');
  const resourceMetadata: ResourceMetadata = {
    operations: new Map(),
    parameters: new Map(),
    requestBodies: new Map(),
    responses: new Map(),
    schemas: new Map(),
  };

  const getDependencies = (pointer: string): Set<string> => {
    const dependencies = new Set<string>();
    const nodeDependencies = graph.transitiveDependencies.get(pointer);
    if (nodeDependencies?.size) {
      for (const dependency of nodeDependencies) {
        const path = jsonPointerToPath(dependency);
        const type = path[path.length - 2];
        const name = path[path.length - 1];
        if (type && name) {
          const namespace = stringToNamespace(type);
          if (namespace === 'unknown') {
            console.warn(`unsupported type: ${type}`);
          }
          dependencies.add(addNamespace(namespace, name));
        }
      }
    }
    return dependencies;
  };

  // Process each node to find top-level resources
  for (const [pointer, nodeInfo] of graph.nodes) {
    // const node = nodeInfo.node as Record<string, unknown>;
    const path = jsonPointerToPath(pointer);

    // OpenAPI 3.x
    if (path[0] === 'components') {
      if (path.length === 3) {
        if (path[1] === 'schemas') {
          // Schema: #/components/schemas/{name}
          const name = path[path.length - 1]!;
          resourceMetadata.schemas.set(addNamespace('schema', name), {
            dependencies: getDependencies(pointer),
            deprecated: nodeInfo.deprecated ?? false,
          });
        } else if (path[1] === 'parameters') {
          // Parameter: #/components/parameters/{name}
          const name = path[path.length - 1]!;
          resourceMetadata.parameters.set(addNamespace('parameter', name), {
            dependencies: getDependencies(pointer),
            deprecated: nodeInfo.deprecated ?? false,
          });
        } else if (path[1] === 'requestBodies') {
          // RequestBody: #/components/requestBodies/{name}
          const name = path[path.length - 1]!;
          resourceMetadata.requestBodies.set(addNamespace('body', name), {
            dependencies: getDependencies(pointer),
            deprecated: nodeInfo.deprecated ?? false,
          });
        } else if (path[1] === 'responses') {
          // Response: #/components/responses/{name}
          const name = path[path.length - 1]!;
          resourceMetadata.responses.set(addNamespace('response', name), {
            dependencies: getDependencies(pointer),
            deprecated: nodeInfo.deprecated ?? false,
          });
        }
      }
      continue;
    }

    if (path[0] === 'paths') {
      if (path.length === 3 && httpMethods.includes(path[2] as (typeof httpMethods)[number])) {
        // Operation: #/paths/{path}/{method}
        const method = path[path.length - 1]!;
        const operationPath = path.slice(1, -1).join('/');
        const operationKey = createOperationKey({
          method,
          path: operationPath,
        });
        resourceMetadata.operations.set(addNamespace('operation', operationKey), {
          dependencies: getDependencies(pointer),
          deprecated: nodeInfo.deprecated ?? false,
          tags: nodeInfo.tags ?? new Set(),
        });
      }
      continue;
    }

    // OpenAPI 2.0
    if (path[0] === 'definitions') {
      if (path.length === 2) {
        // Schema: #/definitions/{name}
        const name = path[path.length - 1]!;
        resourceMetadata.schemas.set(addNamespace('schema', name), {
          dependencies: getDependencies(pointer),
          deprecated: nodeInfo.deprecated ?? false,
        });
      }
      continue;
    }
  }

  eventBuildResourceMetadata.timeEnd();
  return { resourceMetadata };
}
