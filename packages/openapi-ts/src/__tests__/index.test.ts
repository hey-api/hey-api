import { createClient } from '../index';

type Config = Parameters<typeof createClient>[0];

describe('createClient', () => {
  it('handles deep path $ref without errors', async () => {
    // This test verifies that deep path refs like
    // #/components/schemas/Foo/properties/bar/items are inlined
    // instead of being treated as symbol references (which would fail)
    const config: Config = {
      dryRun: true,
      input: {
        components: {
          schemas: {
            Bar: {
              properties: {
                nested: {
                  // Deep path ref - should be inlined, not treated as symbol
                  $ref: '#/components/schemas/Foo/properties/items/items',
                },
              },
              type: 'object',
            },
            Foo: {
              properties: {
                items: {
                  items: {
                    properties: {
                      name: { type: 'string' },
                    },
                    type: 'object',
                  },
                  type: 'array',
                },
              },
              type: 'object',
            },
          },
        },
        info: { title: 'deep-ref-test', version: '1.0.0' },
        openapi: '3.1.0',
      },
      logs: {
        level: 'silent',
      },
      output: 'output',
      plugins: ['@hey-api/typescript'],
    };

    // Should not throw "Symbol finalName has not been resolved yet" error
    const results = await createClient(config);
    expect(results).toHaveLength(1);
  });

  it('handles deep path $ref in OpenAPI 3.0.x without errors', async () => {
    const config: Config = {
      dryRun: true,
      input: {
        components: {
          schemas: {
            Bar: {
              properties: {
                nested: {
                  $ref: '#/components/schemas/Foo/properties/items/items',
                },
              },
              type: 'object',
            },
            Foo: {
              properties: {
                items: {
                  items: {
                    properties: {
                      name: { type: 'string' },
                    },
                    type: 'object',
                  },
                  type: 'array',
                },
              },
              type: 'object',
            },
          },
        },
        info: { title: 'deep-ref-test', version: '1.0.0' },
        openapi: '3.0.0',
        paths: {},
      },
      logs: {
        level: 'silent',
      },
      output: 'output',
      plugins: ['@hey-api/typescript'],
    };

    const results = await createClient(config);
    expect(results).toHaveLength(1);
  });

  it('handles deep path $ref in OpenAPI 2.0 (Swagger) without errors', async () => {
    const config: Config = {
      dryRun: true,
      input: {
        definitions: {
          Bar: {
            properties: {
              nested: {
                $ref: '#/definitions/Foo/properties/items/items',
              },
            },
            type: 'object',
          },
          Foo: {
            properties: {
              items: {
                items: {
                  properties: {
                    name: { type: 'string' },
                  },
                  type: 'object',
                },
                type: 'array',
              },
            },
            type: 'object',
          },
        },
        info: { title: 'deep-ref-test', version: '1.0.0' },
        paths: {},
        swagger: '2.0',
      },
      logs: {
        level: 'silent',
      },
      output: 'output',
      plugins: ['@hey-api/typescript'],
    };

    const results = await createClient(config);
    expect(results).toHaveLength(1);
  });

  it('1 config, 1 input, 1 output', async () => {
    const config: Config = {
      dryRun: true,
      input: {
        info: { title: 'foo', version: '1.0.0' },
        openapi: '3.0.0',
      },
      logs: {
        level: 'silent',
      },
      output: 'output',
      plugins: ['@hey-api/typescript'],
    };

    const results = await createClient(config);
    expect(results).toHaveLength(1);
  });

  it('1 config, 2 inputs, 1 output', async () => {
    const config: Config = {
      dryRun: true,
      input: [
        {
          info: { title: 'foo', version: '1.0.0' },
          openapi: '3.0.0',
        },
        {
          info: { title: 'bar', version: '1.0.0' },
          openapi: '3.0.0',
          paths: {},
        },
      ],
      logs: {
        level: 'silent',
      },
      output: 'output',
      plugins: ['@hey-api/typescript'],
    };

    const results = await createClient(config);
    expect(results).toHaveLength(1);
  });

  it('1 config, 2 inputs, 2 outputs', async () => {
    const config: Config = {
      dryRun: true,
      input: [
        {
          info: { title: 'foo', version: '1.0.0' },
          openapi: '3.0.0',
        },
        {
          info: { title: 'bar', version: '1.0.0' },
          openapi: '3.0.0',
          paths: {},
        },
      ],
      logs: {
        level: 'silent',
      },
      output: ['output', 'output2'],
      plugins: ['@hey-api/typescript'],
    };

    const results = await createClient(config);
    expect(results).toHaveLength(2);
  });

  it('2 configs, 1 input, 1 output', async () => {
    const config: Config = [
      {
        dryRun: true,
        input: {
          info: { title: 'foo', version: '1.0.0' },
          openapi: '3.0.0',
        },
        logs: {
          level: 'silent',
        },
        output: 'output',
        plugins: ['@hey-api/typescript'],
      },
      {
        dryRun: true,
        input: {
          info: { title: 'bar', version: '1.0.0' },
          openapi: '3.0.0',
        },
        logs: {
          level: 'silent',
        },
        output: 'output2',
        plugins: ['@hey-api/typescript'],
      },
    ];

    const results = await createClient(config);
    expect(results).toHaveLength(2);
  });

  it('2 configs, 2 inputs, 2 outputs', async () => {
    const config: Config = [
      {
        dryRun: true,
        input: [
          {
            info: { title: 'foo', version: '1.0.0' },
            openapi: '3.0.0',
          },
          {
            info: { title: 'bar', version: '1.0.0' },
            openapi: '3.0.0',
            paths: {},
          },
        ],
        logs: {
          level: 'silent',
        },
        output: ['output', 'output2'],
        plugins: ['@hey-api/typescript'],
      },
      {
        dryRun: true,
        input: [
          {
            info: { title: 'baz', version: '1.0.0' },
            openapi: '3.0.0',
          },
          {
            info: { title: 'qux', version: '1.0.0' },
            openapi: '3.0.0',
            paths: {},
          },
        ],
        logs: {
          level: 'silent',
        },
        output: ['output3', 'output4'],
        plugins: ['@hey-api/typescript'],
      },
    ];

    const results = await createClient(config);
    expect(results).toHaveLength(4);
  });

  it('executes @angular/common HttpRequest builder path', async () => {
    const results = await createClient({
      dryRun: true,
      input: {
        info: { title: 'angular-common-test', version: '1.0.0' },
        openapi: '3.1.0',
        paths: {
          '/pets': {
            get: {
              operationId: 'listPets',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        items: { type: 'string' },
                        type: 'array',
                      },
                    },
                  },
                  description: 'ok',
                },
              },
            },
          },
        },
      },
      logs: { level: 'silent' },
      output: 'out',
      plugins: [
        '@hey-api/typescript',
        '@hey-api/sdk',
        '@angular/common',
        '@hey-api/client-angular',
      ],
    });

    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('excludes SSE POST operations from TanStack Query mutations', async () => {
    const [context] = await createClient({
      dryRun: true,
      input: {
        info: { title: 'sse-post-test', version: '1.0.0' },
        openapi: '3.1.0',
        paths: {
          '/events': {
            get: {
              operationId: 'listEvents',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: { items: { type: 'string' }, type: 'array' },
                    },
                  },
                  description: 'Events',
                },
              },
            },
          },
          '/events/subscribe': {
            post: {
              operationId: 'subscribeToEventStream',
              responses: {
                200: {
                  content: {
                    'text/event-stream': {
                      schema: { type: 'object' },
                    },
                  },
                  description: 'Event stream',
                },
              },
            },
          },
        },
      },
      logs: { level: 'silent' },
      output: 'output',
      plugins: [
        '@hey-api/typescript',
        '@hey-api/sdk',
        '@hey-api/client-fetch',
        {
          name: '@tanstack/react-query',
          useMutation: true,
        },
      ],
    });

    const queryFile = context?.gen
      .render()
      .find((file) => file.path.endsWith('@tanstack/react-query.gen.ts'));

    expect(queryFile).toBeDefined();
    expect(queryFile!.content).not.toContain('useSubscribeToEventStreamMutation');
  });
});
