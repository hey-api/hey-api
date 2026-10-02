import { Logger } from '@hey-api/codegen-core';
import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import { filterSpec } from '../filter';

const filter = (spec: OpenAPIV3_1.Document) =>
  filterSpec({
    logger: new Logger(),
    operations: new Set(),
    parameters: new Set(),
    preserveOrder: false,
    requestBodies: new Set(),
    responses: new Set(),
    schemas: new Set(),
    spec,
  });

describe('filterSpec', () => {
  it('ignores QUERY operations before OpenAPI 3.2', () => {
    const spec: OpenAPIV3_1.Document = {
      info: { title: 'Test', version: '1' },
      openapi: '3.1.0',
      paths: {
        '/search': {
          query: {
            responses: {},
          },
        },
      },
    };

    filter(spec);

    expect(spec.paths?.['/search']?.query).toBeDefined();
  });

  it('filters QUERY operations in OpenAPI 3.2', () => {
    const spec: OpenAPIV3_1.Document = {
      info: { title: 'Test', version: '1' },
      openapi: '3.2.0',
      paths: {
        '/search': {
          query: {
            responses: {},
          },
        },
      },
    };

    filter(spec);

    expect(spec.paths?.['/search']).toBeUndefined();
  });
});
