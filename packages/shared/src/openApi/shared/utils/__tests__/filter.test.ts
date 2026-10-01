import type { Logger } from '@hey-api/codegen-core';
import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import type { ResourceMetadata } from '../../graph/meta';
import { createFilteredDependencies, createFilters, type Filters } from '../filter';

const loggerStub = {
  timeEvent: () => ({ timeEnd: () => {} }),
} as unknown as Logger;

function createFiltersState(): Filters {
  return {
    deprecated: true,
    operations: {
      exclude: new Set(),
      include: new Set(),
    },
    orphans: false,
    parameters: {
      exclude: new Set(),
      include: new Set(),
    },
    preserveOrder: false,
    requestBodies: {
      exclude: new Set(),
      include: new Set(),
    },
    responses: {
      exclude: new Set(),
      include: new Set(),
    },
    schemas: {
      exclude: new Set(),
      include: new Set(),
    },
    tags: {
      exclude: new Set(),
      include: new Set(),
    },
  };
}

function createResourceMetadata(): ResourceMetadata {
  return {
    operations: new Map([
      [
        'operation/GET /v1/foo',
        {
          dependencies: new Set(['response/UsedResponse']),
          deprecated: false,
          tags: new Set(),
        },
      ],
    ]),
    parameters: new Map(),
    requestBodies: new Map([
      [
        'body/IncludedBody',
        {
          dependencies: new Set(['schema/Baz']),
          deprecated: false,
        },
      ],
    ]),
    responses: new Map([
      [
        'response/UsedResponse',
        {
          dependencies: new Set(),
          deprecated: false,
        },
      ],
    ]),
    schemas: new Map([
      [
        'schema/Foo',
        {
          dependencies: new Set(['schema/Baz']),
          deprecated: false,
        },
      ],
      [
        'schema/Baz',
        {
          dependencies: new Set(),
          deprecated: false,
        },
      ],
    ]),
  };
}

describe('createFilteredDependencies', () => {
  it('preserves schema order from resourceMetadata when no filters are applied', () => {
    const filters = createFiltersState();
    filters.orphans = true;

    const resourceMetadata = createResourceMetadata();
    // schemas are inserted as Foo, Baz; add Bar in between
    resourceMetadata.schemas.set('schema/Bar', {
      dependencies: new Set(),
      deprecated: false,
    });

    const { schemas } = createFilteredDependencies({
      filters,
      logger: loggerStub,
      resourceMetadata,
    });

    expect([...schemas]).toEqual(['schema/Foo', 'schema/Baz', 'schema/Bar']);
  });

  it('preserves operation order when tags.exclude filters out some operations', () => {
    const filters = createFiltersState();
    filters.tags.exclude.add('exclude-me');

    const resourceMetadata = createResourceMetadata();
    resourceMetadata.operations.set('operation/GET /v1/bar', {
      dependencies: new Set(),
      deprecated: false,
      tags: new Set(['exclude-me']),
    });
    resourceMetadata.operations.set('operation/GET /v1/baz', {
      dependencies: new Set(),
      deprecated: false,
      tags: new Set(),
    });

    const { operations } = createFilteredDependencies({
      filters,
      logger: loggerStub,
      resourceMetadata,
    });

    expect([...operations]).toEqual(['operation/GET /v1/foo', 'operation/GET /v1/baz']);
  });

  it('keeps explicitly included schemas and their dependencies when dropping orphans', () => {
    const filters = createFiltersState();
    filters.schemas.include.add('schema/Foo');

    const { schemas } = createFilteredDependencies({
      filters,
      logger: loggerStub,
      resourceMetadata: createResourceMetadata(),
    });

    expect(schemas).toEqual(new Set(['schema/Foo', 'schema/Baz']));
  });

  it('keeps explicitly included request bodies and their schema dependencies when dropping orphans', () => {
    const filters = createFiltersState();
    filters.requestBodies.include.add('body/IncludedBody');

    const { requestBodies, schemas } = createFilteredDependencies({
      filters,
      logger: loggerStub,
      resourceMetadata: createResourceMetadata(),
    });

    expect(requestBodies).toEqual(new Set(['body/IncludedBody']));
    expect(schemas).toEqual(new Set(['schema/Baz']));
  });

  it('keeps non-deprecated operations that transitively reference deprecated schemas', () => {
    const filters = createFiltersState();
    filters.deprecated = false;

    const resourceMetadata = createResourceMetadata();
    // Add a deprecated schema referenced via a oneOf in the response
    resourceMetadata.schemas.set('schema/DeprecatedWidget', {
      dependencies: new Set(),
      deprecated: true,
    });
    // Operation transitively depends on the deprecated schema
    resourceMetadata.operations.set('operation/GET /v1/widgets', {
      dependencies: new Set(['response/UsedResponse', 'schema/Foo', 'schema/DeprecatedWidget']),
      deprecated: false,
      tags: new Set(),
    });

    const { operations, schemas } = createFilteredDependencies({
      filters,
      logger: loggerStub,
      resourceMetadata,
    });

    expect(operations.has('operation/GET /v1/widgets')).toBe(true);
    // The deprecated schema should be re-added since the operation needs it
    expect(schemas.has('schema/DeprecatedWidget')).toBe(true);
  });

  it('prioritizes excludes when the same schema is explicitly included and excluded', () => {
    const filters = createFiltersState();
    filters.schemas.include.add('schema/Foo');
    filters.schemas.exclude.add('schema/Foo');

    const { schemas } = createFilteredDependencies({
      filters,
      logger: loggerStub,
      resourceMetadata: createResourceMetadata(),
    });

    expect(schemas).toEqual(new Set());
  });
});

describe('createFilters', () => {
  const createSpec = (openapi: OpenAPIV3_1.Document['openapi']): OpenAPIV3_1.Document => ({
    info: { title: 'Test', version: '1' },
    openapi,
    paths: {
      '/search': {
        query: {
          responses: {},
        },
      },
    },
  });

  it('ignores QUERY operations before OpenAPI 3.2', () => {
    const filters = createFilters(
      { operations: { include: ['/QUERY/'] } },
      createSpec('3.1.0'),
      loggerStub,
    );

    expect(filters.operations.include).toEqual(new Set());
  });

  it('collects QUERY operations in OpenAPI 3.2', () => {
    const filters = createFilters(
      { operations: { include: ['/QUERY/'] } },
      createSpec('3.2.0'),
      loggerStub,
    );

    expect(filters.operations.include).toEqual(new Set(['operation/QUERY /search']));
  });
});
