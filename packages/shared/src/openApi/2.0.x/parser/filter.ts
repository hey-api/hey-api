import type { Logger } from '@hey-api/codegen-core';
import type { OpenAPIV2 } from '@hey-api/spec-types';

import { createOperationKey } from '../../../ir/operation';
import { addNamespace, removeNamespace } from '../../../openApi/shared/utils/filter';
import { httpMethods } from '../../../openApi/shared/utils/operation';

/**
 * Replace source spec with filtered version.
 */
export function filterSpec({
  logger,
  operations,
  preserveOrder,
  schemas,
  spec,
}: {
  logger: Logger;
  operations: Set<string>;
  parameters: Set<string>;
  preserveOrder: boolean;
  requestBodies: Set<string>;
  responses: Set<string>;
  schemas: Set<string>;
  spec: OpenAPIV2.Document;
}) {
  const eventFilterSpec = logger.timeEvent('filter-spec');
  if (spec.definitions) {
    const filtered: typeof spec.definitions = {};

    if (preserveOrder) {
      for (const [name, source] of Object.entries(spec.definitions)) {
        if (schemas.has(addNamespace('schema', name))) {
          filtered[name] = source;
        }
      }
    } else {
      for (const key of schemas) {
        const { name } = removeNamespace(key);
        const source = spec.definitions[name];
        if (source) {
          filtered[name] = source;
        }
      }
    }

    spec.definitions = filtered;
  }

  if (spec.paths) {
    for (const entry of Object.entries(spec.paths)) {
      const path = entry[0] as keyof OpenAPIV2.PathsObject;
      const pathItem = entry[1] as OpenAPIV2.PathItemObject;

      for (const method of httpMethods) {
        // @ts-expect-error
        const operation = pathItem[method] as OpenAPIV2.OperationObject;
        if (!operation) {
          continue;
        }

        const key = addNamespace('operation', createOperationKey({ method, path }));
        if (!operations.has(key)) {
          // @ts-expect-error
          delete pathItem[method];
        }
      }

      // remove paths that have no operations left
      if (!Object.keys(pathItem).length) {
        delete spec.paths[path];
      }
    }
  }
  eventFilterSpec.timeEnd();
}
