import { Logger } from '@hey-api/codegen-core';
import type { OpenAPIV2 } from '@hey-api/spec-types';

import { filterSpec } from '../filter';

function createSpec(paths: OpenAPIV2.Document['paths']): OpenAPIV2.Document {
  return {
    info: { title: 'Test', version: '1' },
    paths,
    swagger: '2.0',
  };
}

describe('filterSpec', () => {
  it('does not throw on a spec-extension key under paths with a primitive value', () => {
    const spec = createSpec({
      '/v1/foo': {
        get: { responses: { '200': { description: 'ok' } } },
      },
      'x-foo': 'bar',
    });

    expect(() =>
      filterSpec({
        logger: new Logger(),
        operations: new Set(['operation/GET /v1/foo']),
        parameters: new Set(),
        preserveOrder: false,
        requestBodies: new Set(),
        responses: new Set(),
        schemas: new Set(),
        spec,
      }),
    ).not.toThrow();
  });

  it('does not remove a $ref-only path item even when it has no direct operations', () => {
    const spec = createSpec({
      '/v1/foo': {
        $ref: '#/x-shared-path-items/Foo',
      },
    });

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

    expect(spec.paths?.['/v1/foo']).toEqual({ $ref: '#/x-shared-path-items/Foo' });
  });
});
