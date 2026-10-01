import type { Logger } from '@hey-api/codegen-core';

import { buildGraph } from '../../utils/graph';
import { buildResourceMetadata } from '../meta';

const loggerStub = {
  timeEvent: () => ({ timeEnd: () => {} }),
} as unknown as Logger;

describe('buildResourceMetadata', () => {
  it('attributes path-level `parameters` $refs to every operation under that path', () => {
    const spec = {
      components: {
        parameters: {
          SharedParam: {
            in: 'query',
            name: 'shared',
            schema: { $ref: '#/components/schemas/SharedSchema' },
          },
        },
        schemas: {
          SharedSchema: { type: 'string' },
        },
      },
      paths: {
        '/v1/foo': {
          get: {
            responses: { '200': { description: 'ok' } },
          },
          parameters: [{ $ref: '#/components/parameters/SharedParam' }],
          post: {
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    };

    const { graph } = buildGraph(spec, loggerStub);
    const { resourceMetadata } = buildResourceMetadata(graph, loggerStub);

    const get = resourceMetadata.operations.get('operation/GET /v1/foo');
    const post = resourceMetadata.operations.get('operation/POST /v1/foo');

    expect(get?.dependencies.has('parameter/SharedParam')).toBe(true);
    expect(get?.dependencies.has('schema/SharedSchema')).toBe(true);
    // path-level parameters apply to every operation under the path
    expect(post?.dependencies.has('parameter/SharedParam')).toBe(true);
  });

  it('does not attribute path-level parameters from one path to operations on another', () => {
    const spec = {
      components: {
        parameters: {
          SharedParam: {
            in: 'query',
            name: 'shared',
            schema: { type: 'string' },
          },
        },
      },
      paths: {
        '/v1/bar': {
          get: {
            responses: { '200': { description: 'ok' } },
          },
        },
        '/v1/foo': {
          get: {
            responses: { '200': { description: 'ok' } },
          },
          parameters: [{ $ref: '#/components/parameters/SharedParam' }],
        },
      },
    };

    const { graph } = buildGraph(spec, loggerStub);
    const { resourceMetadata } = buildResourceMetadata(graph, loggerStub);

    const bar = resourceMetadata.operations.get('operation/GET /v1/bar');

    expect(bar?.dependencies.has('parameter/SharedParam')).toBe(false);
  });

  it('collects webhook operations and attributes webhook-level `parameters` $refs', () => {
    const spec = {
      components: {
        parameters: {
          SharedParam: {
            in: 'query',
            name: 'shared',
            schema: { type: 'string' },
          },
        },
      },
      paths: {},
      webhooks: {
        newPet: {
          parameters: [{ $ref: '#/components/parameters/SharedParam' }],
          post: {
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    };

    const { graph } = buildGraph(spec, loggerStub);
    const { resourceMetadata } = buildResourceMetadata(graph, loggerStub);

    const webhookOperation = resourceMetadata.operations.get('operation/POST newPet');

    expect(webhookOperation).toBeDefined();
    expect(webhookOperation?.dependencies.has('parameter/SharedParam')).toBe(true);
  });
});
