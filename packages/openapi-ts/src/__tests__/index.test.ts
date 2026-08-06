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

  const pingSpec = {
    info: { title: 'ping-test', version: '1.0.0' },
    openapi: '3.1.0',
    paths: {
      '/ping': {
        get: {
          operationId: 'getPing',
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    properties: { pong: { type: 'string' } },
                    type: 'object',
                  },
                },
              },
              description: 'ok',
            },
          },
        },
        post: {
          operationId: 'postPing',
          requestBody: {
            content: {
              'application/json': {
                schema: { type: 'string' },
              },
            },
            required: true,
          },
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    properties: { pong: { type: 'string' } },
                    type: 'object',
                  },
                },
              },
              description: 'ok',
            },
          },
        },
      },
    },
  };

  const renderFile = (results: Awaited<ReturnType<typeof createClient>>, fileName: string) =>
    results[0]!.gen.render().find((file) => file.path.endsWith(fileName))?.content ?? '';

  it('emits method literal in request types when requests.method is enabled', async () => {
    const results = await createClient({
      dryRun: true,
      input: pingSpec,
      logs: { level: 'silent' },
      output: 'out',
      plugins: [{ name: '@hey-api/typescript', requests: { method: true } }],
    });

    const types = renderFile(results, 'types.gen.ts');
    expect(types).toContain("method: 'get';");
    expect(types).toContain("method: 'post';");
  });

  it('omits method from request types by default', async () => {
    const results = await createClient({
      dryRun: true,
      input: pingSpec,
      logs: { level: 'silent' },
      output: 'out',
      plugins: ['@hey-api/typescript'],
    });

    expect(renderFile(results, 'types.gen.ts')).not.toContain('method:');
  });

  it('gates faker mock return types on requests.method', async () => {
    const enabled = await createClient({
      dryRun: true,
      input: pingSpec,
      logs: { level: 'silent' },
      output: 'out',
      plugins: [{ name: '@hey-api/typescript', requests: { method: true } }, '@faker-js/faker'],
    });
    expect(renderFile(enabled, 'faker.gen.ts')).toContain("Omit<PostPingData, 'url' | 'method'>");

    const disabled = await createClient({
      dryRun: true,
      input: pingSpec,
      logs: { level: 'silent' },
      output: 'out',
      plugins: ['@hey-api/typescript', '@faker-js/faker'],
    });
    expect(renderFile(disabled, 'faker.gen.ts')).toContain("Omit<PostPingData, 'url'>");
  });
});
