import type { Logger } from '@hey-api/codegen-core';
import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import type { Parser } from '../../../config/parser/types';
import { createOperationKey } from '../../../ir/operation';
import type { OpenApi } from '../../../openApi/types';
import type { ResourceMetadata } from '../graph/meta';
import { getHttpMethods, legacyHttpMethods } from './operation';

type FilterNamespace = 'body' | 'operation' | 'parameter' | 'response' | 'schema' | 'unknown';

const namespaceNeedle = '/';

export function addNamespace(namespace: FilterNamespace, value: string = ''): string {
  return `${namespace}${namespaceNeedle}${value}`;
}

export function removeNamespace(key: string): {
  name: string;
  namespace: FilterNamespace;
} {
  const index = key.indexOf(namespaceNeedle);
  const name = key.slice(index + 1);
  return {
    name,
    namespace: key.slice(0, index)! as FilterNamespace,
  };
}

/**
 * Converts reference strings from OpenAPI $ref keywords into namespaces.
 *
 * @example '#/components/schemas/Foo' -> 'schema'
 */
export function stringToNamespace(value: string): FilterNamespace {
  switch (value) {
    case 'parameters':
      return 'parameter';
    case 'requestBodies':
      return 'body';
    case 'responses':
      return 'response';
    case 'definitions':
    case 'schemas':
      return 'schema';
    default:
      return 'unknown';
  }
}

function getResourceDependencies(
  key: string,
  resourceMetadata: ResourceMetadata,
): Set<string> | undefined {
  const { namespace } = removeNamespace(key);
  if (namespace === 'body') {
    return resourceMetadata.requestBodies.get(key)?.dependencies;
  }
  if (namespace === 'operation') {
    return resourceMetadata.operations.get(key)?.dependencies;
  }
  if (namespace === 'parameter') {
    return resourceMetadata.parameters.get(key)?.dependencies;
  }
  if (namespace === 'response') {
    return resourceMetadata.responses.get(key)?.dependencies;
  }
  if (namespace === 'schema') {
    return resourceMetadata.schemas.get(key)?.dependencies;
  }
}

type FiltersConfigToState<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends ReadonlyArray<infer U>
    ? Set<U>
    : NonNullable<T[K]> extends object
      ? FiltersConfigToState<NonNullable<T[K]>>
      : T[K];
};

export type Filters = FiltersConfigToState<NonNullable<Parser['filters']>>;

interface SetAndRegExps {
  regexps: Array<RegExp>;
  set: Set<string>;
}

function createFiltersSetAndRegExps(
  type: FilterNamespace,
  filters: ReadonlyArray<string> | undefined,
): SetAndRegExps {
  const keys: Array<string> = [];
  const regexps: Array<RegExp> = [];
  if (filters) {
    for (const value of filters) {
      if (value.startsWith('/') && value.endsWith('/')) {
        regexps.push(new RegExp(value.slice(1, value.length - 1)));
      } else {
        keys.push(addNamespace(type, value));
      }
    }
  }
  return {
    regexps,
    set: new Set(keys),
  };
}

interface CollectFiltersSetFromRegExps {
  excludeOperations: SetAndRegExps;
  excludeParameters: SetAndRegExps;
  excludeRequestBodies: SetAndRegExps;
  excludeResponses: SetAndRegExps;
  excludeSchemas: SetAndRegExps;
  includeOperations: SetAndRegExps;
  includeParameters: SetAndRegExps;
  includeRequestBodies: SetAndRegExps;
  includeResponses: SetAndRegExps;
  includeSchemas: SetAndRegExps;
}

function collectFiltersSetFromRegExpsOpenApiV2({
  excludeOperations,
  excludeSchemas,
  includeOperations,
  includeSchemas,
  spec,
}: CollectFiltersSetFromRegExps & {
  spec: OpenApi.V2_0_X;
}): void {
  if ((excludeOperations.regexps.length || includeOperations.regexps.length) && spec.paths) {
    for (const entry of Object.entries(spec.paths)) {
      const path = entry[0] as keyof OpenAPIV3_1.PathsObject;
      const pathItem = entry[1] as OpenAPIV3_1.PathItemObject;
      for (const method of legacyHttpMethods) {
        const operation = pathItem[method];
        if (!operation) {
          continue;
        }

        const key = createOperationKey({ method, path });
        if (excludeOperations.regexps.some((regexp) => regexp.test(key))) {
          excludeOperations.set.add(addNamespace('operation', key));
        }
        if (includeOperations.regexps.some((regexp) => regexp.test(key))) {
          includeOperations.set.add(addNamespace('operation', key));
        }
      }
    }
  }

  if (spec.definitions) {
    // TODO: add parameters

    if (excludeSchemas.regexps.length || includeSchemas.regexps.length) {
      for (const key of Object.keys(spec.definitions)) {
        if (excludeSchemas.regexps.some((regexp) => regexp.test(key))) {
          excludeSchemas.set.add(addNamespace('schema', key));
        }
        if (includeSchemas.regexps.some((regexp) => regexp.test(key))) {
          includeSchemas.set.add(addNamespace('schema', key));
        }
      }
    }
  }
}

function collectFiltersSetFromRegExpsOpenApiV3({
  excludeOperations,
  excludeParameters,
  excludeRequestBodies,
  excludeResponses,
  excludeSchemas,
  includeOperations,
  includeParameters,
  includeRequestBodies,
  includeResponses,
  includeSchemas,
  spec,
}: CollectFiltersSetFromRegExps & {
  spec: OpenApi.V3_0_X | OpenApi.V3_1_X;
}): void {
  if ((excludeOperations.regexps.length || includeOperations.regexps.length) && spec.paths) {
    for (const entry of Object.entries(spec.paths)) {
      const path = entry[0] as keyof OpenAPIV3_1.PathsObject;
      const pathItem = entry[1] as OpenAPIV3_1.PathItemObject;
      for (const method of getHttpMethods(spec.openapi)) {
        const operation = pathItem[method];
        if (!operation) {
          continue;
        }

        const key = createOperationKey({ method, path });
        if (excludeOperations.regexps.some((regexp) => regexp.test(key))) {
          excludeOperations.set.add(addNamespace('operation', key));
        }
        if (includeOperations.regexps.some((regexp) => regexp.test(key))) {
          includeOperations.set.add(addNamespace('operation', key));
        }
      }
    }
  }

  if (spec.components) {
    if (
      (excludeParameters.regexps.length || includeParameters.regexps.length) &&
      spec.components.parameters
    ) {
      for (const key of Object.keys(spec.components.parameters)) {
        if (excludeParameters.regexps.some((regexp) => regexp.test(key))) {
          excludeParameters.set.add(addNamespace('parameter', key));
        }
        if (includeParameters.regexps.some((regexp) => regexp.test(key))) {
          includeParameters.set.add(addNamespace('parameter', key));
        }
      }
    }

    if (
      (excludeRequestBodies.regexps.length || includeRequestBodies.regexps.length) &&
      spec.components.requestBodies
    ) {
      for (const key of Object.keys(spec.components.requestBodies)) {
        if (excludeRequestBodies.regexps.some((regexp) => regexp.test(key))) {
          excludeRequestBodies.set.add(addNamespace('body', key));
        }
        if (includeRequestBodies.regexps.some((regexp) => regexp.test(key))) {
          includeRequestBodies.set.add(addNamespace('body', key));
        }
      }
    }

    if (
      (excludeResponses.regexps.length || includeResponses.regexps.length) &&
      spec.components.responses
    ) {
      for (const key of Object.keys(spec.components.responses)) {
        if (excludeResponses.regexps.some((regexp) => regexp.test(key))) {
          excludeResponses.set.add(addNamespace('response', key));
        }
        if (includeResponses.regexps.some((regexp) => regexp.test(key))) {
          includeResponses.set.add(addNamespace('response', key));
        }
      }
    }

    if (
      (excludeSchemas.regexps.length || includeSchemas.regexps.length) &&
      spec.components.schemas
    ) {
      for (const key of Object.keys(spec.components.schemas)) {
        if (excludeSchemas.regexps.some((regexp) => regexp.test(key))) {
          excludeSchemas.set.add(addNamespace('schema', key));
        }
        if (includeSchemas.regexps.some((regexp) => regexp.test(key))) {
          includeSchemas.set.add(addNamespace('schema', key));
        }
      }
    }
  }
}

function collectFiltersSetFromRegExps({
  spec,
  ...filters
}: CollectFiltersSetFromRegExps & {
  spec: OpenApi.V2_0_X | OpenApi.V3_0_X | OpenApi.V3_1_X;
}): void {
  if ('swagger' in spec) {
    collectFiltersSetFromRegExpsOpenApiV2({ ...filters, spec });
  } else {
    collectFiltersSetFromRegExpsOpenApiV3({ ...filters, spec });
  }
}

export function createFilters(
  config: Parser['filters'],
  spec: OpenApi.V2_0_X | OpenApi.V3_0_X | OpenApi.V3_1_X,
  logger: Logger,
): Filters {
  const eventCreateFilters = logger.timeEvent('create-filters');
  const excludeOperations = createFiltersSetAndRegExps('operation', config?.operations?.exclude);
  const includeOperations = createFiltersSetAndRegExps('operation', config?.operations?.include);
  const excludeParameters = createFiltersSetAndRegExps('parameter', config?.parameters?.exclude);
  const includeParameters = createFiltersSetAndRegExps('parameter', config?.parameters?.include);
  const excludeRequestBodies = createFiltersSetAndRegExps('body', config?.requestBodies?.exclude);
  const includeRequestBodies = createFiltersSetAndRegExps('body', config?.requestBodies?.include);
  const excludeResponses = createFiltersSetAndRegExps('response', config?.responses?.exclude);
  const includeResponses = createFiltersSetAndRegExps('response', config?.responses?.include);
  const excludeSchemas = createFiltersSetAndRegExps('schema', config?.schemas?.exclude);
  const includeSchemas = createFiltersSetAndRegExps('schema', config?.schemas?.include);

  collectFiltersSetFromRegExps({
    excludeOperations,
    excludeParameters,
    excludeRequestBodies,
    excludeResponses,
    excludeSchemas,
    includeOperations,
    includeParameters,
    includeRequestBodies,
    includeResponses,
    includeSchemas,
    spec,
  });

  const filters: Filters = {
    deprecated: config?.deprecated ?? true,
    operations: {
      exclude: excludeOperations.set,
      include: includeOperations.set,
    },
    orphans: config?.orphans ?? false,
    parameters: {
      exclude: excludeParameters.set,
      include: includeParameters.set,
    },
    preserveOrder: config?.preserveOrder ?? false,
    requestBodies: {
      exclude: excludeRequestBodies.set,
      include: includeRequestBodies.set,
    },
    responses: {
      exclude: excludeResponses.set,
      include: includeResponses.set,
    },
    schemas: {
      exclude: excludeSchemas.set,
      include: includeSchemas.set,
    },
    tags: {
      exclude: new Set(config?.tags?.exclude),
      include: new Set(config?.tags?.include),
    },
  };
  eventCreateFilters.timeEnd();
  return filters;
}

export function hasFilters(config: Parser['filters']): boolean {
  if (!config) {
    return false;
  }

  // we explicitly want to strip orphans or deprecated
  if (config.orphans === false || config.deprecated === false) {
    return true;
  }

  return Boolean(
    config.operations?.exclude?.length ||
    config.operations?.include?.length ||
    config.parameters?.exclude?.length ||
    config.parameters?.include?.length ||
    config.requestBodies?.exclude?.length ||
    config.requestBodies?.include?.length ||
    config.responses?.exclude?.length ||
    config.responses?.include?.length ||
    config.schemas?.exclude?.length ||
    config.schemas?.include?.length ||
    config.tags?.exclude?.length ||
    config.tags?.include?.length,
  );
}

/**
 * Collect operations that satisfy the include/exclude filters and schema dependencies.
 *
 * Must be called after dropping components.
 */
function collectOperations({
  filters,
  parameters,
  requestBodies,
  resourceMetadata,
  responses,
  schemas,
}: {
  filters: Filters;
  parameters: Set<string>;
  requestBodies: Set<string>;
  resourceMetadata: ResourceMetadata;
  responses: Set<string>;
  schemas: Set<string>;
}): {
  operations: Set<string>;
} {
  const finalSet = new Set<string>();
  const initialSet = filters.operations.include.size
    ? filters.operations.include
    : new Set(resourceMetadata.operations.keys());
  const stack = [...initialSet];
  let index = 0;
  while (index < stack.length) {
    const key = stack[index++]!;

    if (filters.operations.exclude.has(key) || finalSet.has(key)) {
      continue;
    }

    const node = resourceMetadata.operations.get(key);

    if (!node) {
      continue;
    }

    if (!filters.deprecated && node.deprecated) {
      continue;
    }

    if (
      filters.tags.exclude.size &&
      node.tags.size &&
      [...filters.tags.exclude].some((tag) => node.tags.has(tag))
    ) {
      continue;
    }

    if (
      filters.tags.include.size &&
      !new Set([...filters.tags.include].filter((tag) => node.tags.has(tag))).size
    ) {
      continue;
    }

    // skip operation if it references any component not included
    if (
      [...node.dependencies].some((dependency) => {
        const { namespace } = removeNamespace(dependency);
        switch (namespace) {
          case 'body':
            return !requestBodies.has(dependency);
          case 'parameter':
            return !parameters.has(dependency);
          case 'response':
            return !responses.has(dependency);
          case 'schema': {
            if (schemas.has(dependency)) {
              return false;
            }
            if (filters.schemas.exclude.has(dependency)) {
              return true;
            }
            schemas.add(dependency);
            return false;
          }
          default:
            return false;
        }
      })
    ) {
      continue;
    }

    finalSet.add(key);
  }
  return { operations: finalSet };
}

/**
 * Collect parameters that satisfy the include/exclude filters and schema dependencies.
 */
function collectParameters({
  filters,
  resourceMetadata,
  schemas,
}: {
  filters: Filters;
  resourceMetadata: ResourceMetadata;
  schemas: Set<string>;
}): {
  parameters: Set<string>;
} {
  const finalSet = new Set<string>();
  const initialSet = filters.parameters.include.size
    ? filters.parameters.include
    : new Set(resourceMetadata.parameters.keys());
  const stack = [...initialSet];
  let index = 0;
  while (index < stack.length) {
    const key = stack[index++]!;

    if (filters.parameters.exclude.has(key) || finalSet.has(key)) {
      continue;
    }

    const node = resourceMetadata.parameters.get(key);

    if (!node) {
      continue;
    }

    if (!filters.deprecated && node.deprecated) {
      continue;
    }

    finalSet.add(key);

    if (!node.dependencies.size) {
      continue;
    }

    for (const dependency of node.dependencies) {
      const { namespace } = removeNamespace(dependency);
      switch (namespace) {
        case 'body': {
          if (filters.requestBodies.exclude.has(dependency)) {
            finalSet.delete(key);
          } else if (!finalSet.has(dependency)) {
            stack.push(dependency);
          }
          break;
        }
        case 'schema': {
          if (filters.schemas.exclude.has(dependency)) {
            finalSet.delete(key);
          } else if (!schemas.has(dependency)) {
            schemas.add(dependency);
          }
          break;
        }
      }
    }
  }
  return { parameters: finalSet };
}

/**
 * Collect request bodies that satisfy the include/exclude filters and schema dependencies.
 */
function collectRequestBodies({
  filters,
  resourceMetadata,
  schemas,
}: {
  filters: Filters;
  resourceMetadata: ResourceMetadata;
  schemas: Set<string>;
}): {
  requestBodies: Set<string>;
} {
  const finalSet = new Set<string>();
  const initialSet = filters.requestBodies.include.size
    ? filters.requestBodies.include
    : new Set(resourceMetadata.requestBodies.keys());
  const stack = [...initialSet];
  let index = 0;
  while (index < stack.length) {
    const key = stack[index++]!;

    if (filters.requestBodies.exclude.has(key) || finalSet.has(key)) {
      continue;
    }

    const node = resourceMetadata.requestBodies.get(key);

    if (!node) {
      continue;
    }

    if (!filters.deprecated && node.deprecated) {
      continue;
    }

    finalSet.add(key);

    if (!node.dependencies.size) {
      continue;
    }

    for (const dependency of node.dependencies) {
      const { namespace } = removeNamespace(dependency);
      switch (namespace) {
        case 'body': {
          if (filters.requestBodies.exclude.has(dependency)) {
            finalSet.delete(key);
          } else if (!finalSet.has(dependency)) {
            stack.push(dependency);
          }
          break;
        }
        case 'schema': {
          if (filters.schemas.exclude.has(dependency)) {
            finalSet.delete(key);
          } else if (!schemas.has(dependency)) {
            schemas.add(dependency);
          }
          break;
        }
      }
    }
  }
  return { requestBodies: finalSet };
}

/**
 * Collect responses that satisfy the include/exclude filters and schema dependencies.
 */
function collectResponses({
  filters,
  resourceMetadata,
  schemas,
}: {
  filters: Filters;
  resourceMetadata: ResourceMetadata;
  schemas: Set<string>;
}): {
  responses: Set<string>;
} {
  const finalSet = new Set<string>();
  const initialSet = filters.responses.include.size
    ? filters.responses.include
    : new Set(resourceMetadata.responses.keys());
  const stack = [...initialSet];
  let index = 0;
  while (index < stack.length) {
    const key = stack[index++]!;

    if (filters.responses.exclude.has(key) || finalSet.has(key)) {
      continue;
    }

    const node = resourceMetadata.responses.get(key);

    if (!node) {
      continue;
    }

    if (!filters.deprecated && node.deprecated) {
      continue;
    }

    finalSet.add(key);

    if (!node.dependencies.size) {
      continue;
    }

    for (const dependency of node.dependencies) {
      const { namespace } = removeNamespace(dependency);
      switch (namespace) {
        case 'body': {
          if (filters.requestBodies.exclude.has(dependency)) {
            finalSet.delete(key);
          } else if (!finalSet.has(dependency)) {
            stack.push(dependency);
          }
          break;
        }
        case 'schema': {
          if (filters.schemas.exclude.has(dependency)) {
            finalSet.delete(key);
          } else if (!schemas.has(dependency)) {
            schemas.add(dependency);
          }
          break;
        }
      }
    }
  }
  return { responses: finalSet };
}

/**
 * Collect schemas that satisfy the include/exclude filters.
 */
function collectSchemas({
  filters,
  resourceMetadata,
}: {
  filters: Filters;
  resourceMetadata: ResourceMetadata;
}): {
  schemas: Set<string>;
} {
  const finalSet = new Set<string>();
  const initialSet = filters.schemas.include.size
    ? filters.schemas.include
    : new Set(resourceMetadata.schemas.keys());
  const stack = [...initialSet];
  let index = 0;
  while (index < stack.length) {
    const key = stack[index++]!;

    if (filters.schemas.exclude.has(key) || finalSet.has(key)) {
      continue;
    }

    const node = resourceMetadata.schemas.get(key);

    if (!node) {
      continue;
    }

    if (!filters.deprecated && node.deprecated) {
      continue;
    }

    finalSet.add(key);

    if (!node.dependencies.size) {
      continue;
    }

    for (const dependency of node.dependencies) {
      const { namespace } = removeNamespace(dependency);
      switch (namespace) {
        case 'schema': {
          if (!finalSet.has(dependency) && !filters.schemas.exclude.has(dependency)) {
            stack.push(dependency);
          }
          break;
        }
      }
    }
  }
  return { schemas: finalSet };
}

/**
 * Drop parameters that depend on already excluded parameters.
 */
function dropExcludedParameters({
  filters,
  parameters,
  resourceMetadata,
}: {
  filters: Filters;
  parameters: Set<string>;
  resourceMetadata: ResourceMetadata;
}): void {
  if (!filters.parameters.exclude.size) {
    return;
  }

  for (const key of parameters) {
    const node = resourceMetadata.parameters.get(key);

    if (!node?.dependencies.size) {
      continue;
    }

    for (const excludedKey of filters.parameters.exclude) {
      if (node.dependencies.has(excludedKey)) {
        parameters.delete(key);
        break;
      }
    }
  }
}

/**
 * Drop request bodies that depend on already excluded request bodies.
 */
function dropExcludedRequestBodies({
  filters,
  requestBodies,
  resourceMetadata,
}: {
  filters: Filters;
  requestBodies: Set<string>;
  resourceMetadata: ResourceMetadata;
}): void {
  if (!filters.requestBodies.exclude.size) {
    return;
  }

  for (const key of requestBodies) {
    const node = resourceMetadata.requestBodies.get(key);

    if (!node?.dependencies.size) {
      continue;
    }

    for (const excludedKey of filters.requestBodies.exclude) {
      if (node.dependencies.has(excludedKey)) {
        requestBodies.delete(key);
        break;
      }
    }
  }
}

/**
 * Drop responses that depend on already excluded responses.
 */
function dropExcludedResponses({
  filters,
  resourceMetadata,
  responses,
}: {
  filters: Filters;
  resourceMetadata: ResourceMetadata;
  responses: Set<string>;
}): void {
  if (!filters.responses.exclude.size) {
    return;
  }

  for (const key of responses) {
    const node = resourceMetadata.responses.get(key);

    if (!node?.dependencies.size) {
      continue;
    }

    for (const excludedKey of filters.responses.exclude) {
      if (node.dependencies.has(excludedKey)) {
        responses.delete(key);
        break;
      }
    }
  }
}

/**
 * Drop schemas that depend on already excluded schemas.
 */
function dropExcludedSchemas({
  filters,
  resourceMetadata,
  schemas,
}: {
  filters: Filters;
  resourceMetadata: ResourceMetadata;
  schemas: Set<string>;
}): void {
  if (!filters.schemas.exclude.size) {
    return;
  }

  for (const key of schemas) {
    const node = resourceMetadata.schemas.get(key);

    if (!node?.dependencies.size) {
      continue;
    }

    for (const excludedKey of filters.schemas.exclude) {
      if (node.dependencies.has(excludedKey)) {
        schemas.delete(key);
        break;
      }
    }
  }
}

function dropOrphans({
  includedDependencies,
  operationDependencies,
  parameters,
  requestBodies,
  responses,
  schemas,
}: {
  includedDependencies: Set<string>;
  operationDependencies: Set<string>;
  parameters: Set<string>;
  requestBodies: Set<string>;
  responses: Set<string>;
  schemas: Set<string>;
}): void {
  for (const key of schemas) {
    if (!operationDependencies.has(key) && !includedDependencies.has(key)) {
      schemas.delete(key);
    }
  }
  for (const key of parameters) {
    if (!operationDependencies.has(key) && !includedDependencies.has(key)) {
      parameters.delete(key);
    }
  }
  for (const key of requestBodies) {
    if (!operationDependencies.has(key) && !includedDependencies.has(key)) {
      requestBodies.delete(key);
    }
  }
  for (const key of responses) {
    if (!operationDependencies.has(key) && !includedDependencies.has(key)) {
      responses.delete(key);
    }
  }
}

function collectDependencies({
  resourceMetadata,
  seeds,
}: {
  resourceMetadata: ResourceMetadata;
  seeds: Set<string>;
}): {
  dependencies: Set<string>;
} {
  const finalSet = new Set<string>();
  const stack = [...seeds];
  while (stack.length) {
    const key = stack.pop()!;

    if (finalSet.has(key)) {
      continue;
    }

    finalSet.add(key);
    const dependencies = getResourceDependencies(key, resourceMetadata);

    if (!dependencies?.size) {
      continue;
    }

    for (const dependency of dependencies) {
      if (!finalSet.has(dependency)) {
        stack.push(dependency);
      }
    }
  }
  return { dependencies: finalSet };
}

function collectExplicitDependencies({
  filters,
  resourceMetadata,
}: {
  filters: Filters;
  resourceMetadata: ResourceMetadata;
}): {
  explicitDependencies: Set<string>;
} {
  // Exclude wins over include. Start from non-excluded include seeds.
  const seeds = new Set<string>();

  for (const key of filters.parameters.include) {
    if (!filters.parameters.exclude.has(key)) {
      seeds.add(key);
    }
  }
  for (const key of filters.requestBodies.include) {
    if (!filters.requestBodies.exclude.has(key)) {
      seeds.add(key);
    }
  }
  for (const key of filters.responses.include) {
    if (!filters.responses.exclude.has(key)) {
      seeds.add(key);
    }
  }
  for (const key of filters.schemas.include) {
    if (!filters.schemas.exclude.has(key)) {
      seeds.add(key);
    }
  }

  const { dependencies } = collectDependencies({ resourceMetadata, seeds });

  // Exclude wins for transitive dependencies as well.
  for (const key of dependencies) {
    const { namespace } = removeNamespace(key);
    if (
      (namespace === 'body' && filters.requestBodies.exclude.has(key)) ||
      (namespace === 'parameter' && filters.parameters.exclude.has(key)) ||
      (namespace === 'response' && filters.responses.exclude.has(key)) ||
      (namespace === 'schema' && filters.schemas.exclude.has(key))
    ) {
      dependencies.delete(key);
    }
  }

  return { explicitDependencies: dependencies };
}

function collectOperationDependencies({
  operations,
  resourceMetadata,
}: {
  operations: Set<string>;
  resourceMetadata: ResourceMetadata;
}): {
  operationDependencies: Set<string>;
} {
  const finalSet = new Set<string>();
  const initialSet = new Set(
    [...operations].flatMap((key) => [
      ...(resourceMetadata.operations.get(key)?.dependencies ?? []),
    ]),
  );
  const stack = [...initialSet];
  let index = 0;
  while (index < stack.length) {
    const key = stack[index++]!;

    if (finalSet.has(key)) {
      continue;
    }

    finalSet.add(key);
    const dependencies = getResourceDependencies(key, resourceMetadata);

    if (!dependencies?.size) {
      continue;
    }

    for (const dependency of dependencies) {
      if (!finalSet.has(dependency)) {
        stack.push(dependency);
      }
    }
  }
  return { operationDependencies: finalSet };
}

export function createFilteredDependencies({
  filters,
  logger,
  resourceMetadata,
}: {
  filters: Filters;
  logger: Logger;
  resourceMetadata: ResourceMetadata;
}): {
  operations: Set<string>;
  parameters: Set<string>;
  requestBodies: Set<string>;
  responses: Set<string>;
  schemas: Set<string>;
} {
  const eventCreateFilteredDependencies = logger.timeEvent('create-filtered-dependencies');
  const { schemas } = collectSchemas({ filters, resourceMetadata });
  const { parameters } = collectParameters({
    filters,
    resourceMetadata,
    schemas,
  });
  const { requestBodies } = collectRequestBodies({
    filters,
    resourceMetadata,
    schemas,
  });
  const { responses } = collectResponses({
    filters,
    resourceMetadata,
    schemas,
  });

  dropExcludedSchemas({ filters, resourceMetadata, schemas });
  dropExcludedParameters({ filters, parameters, resourceMetadata });
  dropExcludedRequestBodies({ filters, requestBodies, resourceMetadata });
  dropExcludedResponses({ filters, resourceMetadata, responses });

  // collect operations after dropping components
  const { operations } = collectOperations({
    filters,
    parameters,
    requestBodies,
    resourceMetadata,
    responses,
    schemas,
  });

  if (!filters.orphans && operations.size) {
    const { operationDependencies } = collectOperationDependencies({
      operations,
      resourceMetadata,
    });
    const { explicitDependencies } = collectExplicitDependencies({
      filters,
      resourceMetadata,
    });
    dropOrphans({
      includedDependencies: explicitDependencies,
      operationDependencies,
      parameters,
      requestBodies,
      responses,
      schemas,
    });
  }

  eventCreateFilteredDependencies.timeEnd();
  return {
    operations,
    parameters,
    requestBodies,
    responses,
    schemas,
  };
}
