import { Logger } from '@hey-api/codegen-core';
import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import { filterSpec } from '../filter';

function createSpec(paths: OpenAPIV3_1.Document['paths']): OpenAPIV3_1.Document {
  return {
    info: { title: 'Test', version: '1' },
    openapi: '3.1.0',
    paths,
  };
}

describe('filterSpec', () => {
  it('does not throw on a spec-extension key under paths with a null value', () => {
    // `null` is explicitly a legal extension value per the OpenAPI spec, and
    // unlike a string/number/boolean it throws on property access too (not
    // just on `in`), so it exercises the `x-` skip rather than relying on
    // bracket access happening to tolerate the value.
    const spec = createSpec({
      '/v1/foo': {
        get: { responses: { '200': { description: 'ok' } } },
      },
      'x-foo': null,
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
        $ref: '#/components/pathItems/Foo',
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

    expect(spec.paths?.['/v1/foo']).toEqual({ $ref: '#/components/pathItems/Foo' });
  });

  it('removes an unselected webhook operation and drops the webhook once empty', () => {
    const spec = createSpec({});
    spec.webhooks = {
      newPet: {
        post: { responses: { '200': { description: 'ok' } } },
      },
    };

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

    expect(spec.webhooks?.newPet).toBeUndefined();
  });

  it('keeps a selected webhook operation', () => {
    const spec = createSpec({});
    spec.webhooks = {
      newPet: {
        post: { responses: { '200': { description: 'ok' } } },
      },
    };

    filterSpec({
      logger: new Logger(),
      operations: new Set(['operation/POST newPet']),
      parameters: new Set(),
      preserveOrder: false,
      requestBodies: new Set(),
      responses: new Set(),
      schemas: new Set(),
      spec,
    });

    expect(spec.webhooks?.newPet).toBeDefined();
  });

  it('does not remove a $ref-only webhook even when it has no direct operations', () => {
    const spec = createSpec({});
    spec.webhooks = {
      newPet: { $ref: '#/components/pathItems/NewPet' },
    };

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

    expect(spec.webhooks?.newPet).toEqual({ $ref: '#/components/pathItems/NewPet' });
  });

  it('does not throw on a spec-extension key under webhooks with a null value', () => {
    // see the equivalent paths test above for why `null` (not a string) is
    // the meaningful case to cover here.
    const spec = createSpec({});
    spec.webhooks = {
      newPet: {
        post: { responses: { '200': { description: 'ok' } } },
      },
      'x-foo': null,
    } as unknown as OpenAPIV3_1.Document['webhooks'];

    expect(() =>
      filterSpec({
        logger: new Logger(),
        operations: new Set(['operation/POST newPet']),
        parameters: new Set(),
        preserveOrder: false,
        requestBodies: new Set(),
        responses: new Set(),
        schemas: new Set(),
        spec,
      }),
    ).not.toThrow();
    expect(spec.webhooks?.['x-foo']).toBe(null);
  });
});
