import type { Logger } from '@hey-api/codegen-core';

import type { ResourceMetadata } from '../../graph/meta';
import { createFilteredDependencies, type Filters } from '../filter';

const loggerStub = {
  timeEvent: () => ({ timeEnd: () => {} }),
} as unknown as Logger;

function createFilters(): Filters {
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
    const filters = createFilters();
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
    const filters = createFilters();
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
    const filters = createFilters();
    filters.schemas.include.add('schema/Foo');

    const { schemas } = createFilteredDependencies({
      filters,
      logger: loggerStub,
      resourceMetadata: createResourceMetadata(),
    });

    expect(schemas).toEqual(new Set(['schema/Foo', 'schema/Baz']));
  });

  it('keeps explicitly included request bodies and their schema dependencies when dropping orphans', () => {
    const filters = createFilters();
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
    const filters = createFilters();
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
    const filters = createFilters();
    filters.schemas.include.add('schema/Foo');
    filters.schemas.exclude.add('schema/Foo');

    const { schemas } = createFilteredDependencies({
      filters,
      logger: loggerStub,
      resourceMetadata: createResourceMetadata(),
    });

    expect(schemas).toEqual(new Set());
  });

  it('keeps a path-level parameter referenced only through an operation dependency when dropping orphans', () => {
    const filters = createFilters();

    const resourceMetadata = createResourceMetadata();
    // simulates a path-level `parameters` $ref merged into the operation's
    // dependencies by buildResourceMetadata
    resourceMetadata.operations
      .get('operation/GET /v1/foo')!
      .dependencies.add('parameter/SharedParam');
    resourceMetadata.parameters.set('parameter/SharedParam', {
      dependencies: new Set(),
      deprecated: false,
    });

    const { parameters } = createFilteredDependencies({
      filters,
      logger: loggerStub,
      resourceMetadata,
    });

    expect(parameters.has('parameter/SharedParam')).toBe(true);
  });

  it('excludes an operation that depends on an explicitly excluded path-level parameter', () => {
    const filters = createFilters();
    filters.parameters.exclude.add('parameter/SharedParam');

    const resourceMetadata = createResourceMetadata();
    resourceMetadata.operations
      .get('operation/GET /v1/foo')!
      .dependencies.add('parameter/SharedParam');
    resourceMetadata.parameters.set('parameter/SharedParam', {
      dependencies: new Set(),
      deprecated: false,
    });

    const { operations } = createFilteredDependencies({
      filters,
      logger: loggerStub,
      resourceMetadata,
    });

    expect(operations.has('operation/GET /v1/foo')).toBe(false);
  });
});
