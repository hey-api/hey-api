import fs from 'node:fs';
import path from 'node:path';

import { createClient, type DefinePlugin, type UserConfig } from '@hey-api/openapi-ts';

import { getFilePaths, getSpecsPath } from '../../utils';

const versions = ['2.0.x', '3.0.x', '3.1.x'];

for (const version of versions) {
  const namespace = 'plugins';

  const outputDir = path.join(import.meta.dirname, 'generated', version, namespace);

  describe(`OpenAPI ${version} ${namespace}`, () => {
    const createConfig = (
      userConfig: Omit<UserConfig, 'input'> &
        Pick<Required<UserConfig>, 'plugins'> &
        Pick<Partial<UserConfig>, 'input'>,
    ) =>
      ({
        ...userConfig,
        input: path.join(
          getSpecsPath(),
          version,
          typeof userConfig.input === 'string' ? userConfig.input : 'full.yaml',
        ),
        logs: {
          level: 'silent',
        },
        output: path.join(
          outputDir,
          typeof userConfig.plugins[0] === 'string'
            ? userConfig.plugins[0]
            : userConfig.plugins[0]!.name,
          typeof userConfig.output === 'string' ? userConfig.output : '',
        ),
        plugins: userConfig.plugins ?? ['@hey-api/client-fetch'],
      }) as const satisfies UserConfig;

    const scenarios = [
      {
        config: createConfig({
          output: 'default',
          plugins: ['@hey-api/schemas'],
        }),
        description: 'generate schemas',
      },
      ...(version === '2.0.x'
        ? [
            {
              config: createConfig({
                input: 'effect-no-content.yaml',
                output: 'no-content',
                plugins: ['@hey-api/effect'],
              }),
              description: 'generate an Effect client for a bodyless Swagger response',
            },
          ]
        : []),
      ...(version === '3.1.x'
        ? [
            {
              config: createConfig({
                input: 'effect-sdk.yaml',
                output: 'sdk',
                plugins: [
                  'effect-schema',
                  '@hey-api/client-effect',
                  {
                    name: '@hey-api/sdk',
                    transformer: true,
                    validator: true,
                  },
                ],
              }),
              description: 'generate Effect SDK with Effect Schema validation',
            },
            {
              config: createConfig({
                input: 'effect-webhooks.yaml',
                output: 'effect-webhooks',
                plugins: ['effect-schema'],
              }),
              description: 'generate Effect webhook schemas',
            },
            {
              config: createConfig({
                input: 'effect-edge-cases.yaml',
                output: 'effect-edge-cases',
                plugins: ['@hey-api/effect'],
              }),
              description: 'generate Effect edge cases',
              warningCount: 9,
              warnings: [
                'objectFilter has parameter serialization that Effect HttpApi cannot represent exactly',
                'then is exposed as "then_" to provide safe client property access',
                'constructor is exposed as "constructor_" to provide safe client property access',
                'fileResponse path parameter "api-version" is exposed as "api_version"',
                'eventStream response 200 uses text/event-stream; server-sent events are not supported',
                '2 operations declare cookie parameters',
                '2 operations declare security',
              ],
            },
            {
              config: createConfig({
                input: 'schema-const.yaml',
                output: 'schema-const',
                plugins: ['effect-schema'],
              }),
              description: 'generate Effect object const schemas',
            },
          ]
        : []),
      {
        config: createConfig({
          output: 'default',
          plugins: ['@hey-api/sdk', '@hey-api/client-fetch'],
        }),
        description: 'generate SDK',
      },
      {
        config: createConfig({
          output: 'throwOnError',
          plugins: [
            '@hey-api/sdk',
            {
              name: '@hey-api/client-fetch',
              throwOnError: true,
            },
          ],
        }),
        description: 'generate SDK that throws on error',
      },
      {
        config: createConfig({
          input: 'sdk-instance.yaml',
          output: 'instance',
          plugins: [
            {
              instance: true,
              name: '@hey-api/sdk',
            },
            '@hey-api/client-fetch',
          ],
        }),
        description: 'generate SDK instance',
      },
      {
        config: createConfig({
          output: 'default',
          plugins: ['fastify'],
        }),
        description: 'generate Fastify types with Fastify plugin',
      },
      {
        config: createConfig({
          input: 'transforms-read-write.yaml',
          output: 'transforms-read-write-ignore',
          parser: {
            transforms: {
              readWrite: false,
            },
          },
          plugins: ['@hey-api/typescript', '@hey-api/client-fetch'],
        }),
        description: 'ignores read-only and write-only handling',
      },
      {
        config: createConfig({
          input: 'transforms-read-write.yaml',
          output: 'transforms-read-write-custom-name',
          parser: {
            transforms: {
              readWrite: {
                requests: 'Writable{{name}}',
                responses: 'Readable{{name}}',
              },
            },
          },
          plugins: ['@hey-api/typescript', '@hey-api/client-fetch'],
        }),
        description: 'custom read-only and write-only naming',
      },
      {
        config: createConfig({
          input: 'sdk-nested-classes.yaml',
          output: 'sdk-nested-classes',
          plugins: [
            '@hey-api/client-fetch',
            {
              asClass: true,
              classStructure: 'auto',
              name: '@hey-api/sdk',
            },
          ],
        }),
        description: 'generate nested classes with auto class structure',
      },
      {
        config: createConfig({
          input: 'sdk-nested-classes.yaml',
          output: 'sdk-nested-classes-instance',
          plugins: [
            '@hey-api/client-fetch',
            {
              asClass: true,
              classStructure: 'auto',
              instance: 'NestedSdkWithInstance',
              name: '@hey-api/sdk',
            },
          ],
        }),
        description: 'generate nested classes with auto class structure',
      },
      {
        config: createConfig({
          output: 'fetch',
          plugins: ['@pinia/colada', '@hey-api/client-fetch'],
        }),
        description: 'generate Fetch API client with Pinia Colada plugin',
      },
      {
        config: createConfig({
          input: 'sdk-instance.yaml',
          output: 'asClass',
          plugins: [
            '@pinia/colada',
            '@hey-api/client-fetch',
            {
              asClass: true,
              classNameBuilder: '{{name}}Service',
              name: '@hey-api/sdk',
            },
          ],
        }),
        description: 'generate Fetch API client with Pinia Colada plugin using class-based SDKs',
      },
      {
        config: createConfig({
          output: 'default',
          plugins: ['@angular/common', '@hey-api/client-angular'],
        }),
        description: 'generate Angular requests and resources',
      },
      {
        config: createConfig({
          output: 'default-class',
          plugins: [
            {
              httpRequests: {
                containerName: '{{name}}ServiceRequests',
                segmentName: '{{name}}Service',
                strategy: 'byTags',
              },
              httpResources: {
                containerName: '{{name}}ServiceResources',
                segmentName: '{{name}}Service',
                strategy: 'byTags',
              },
              name: '@angular/common',
            },
            '@hey-api/client-angular',
          ],
        }),
        description: 'generate Angular requests and resources (class)',
      },
    ];

    it.each(scenarios)('$description', async (scenario) => {
      const { config } = scenario;
      const warnings = 'warnings' in scenario ? scenario.warnings : undefined;
      const consoleWarn = warnings
        ? vi.spyOn(console, 'warn').mockImplementation(() => {})
        : undefined;
      try {
        await createClient(config);

        const filePaths = getFilePaths(config.output);

        await Promise.all(
          filePaths.map(async (filePath) => {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            await expect(fileContent).toMatchFileSnapshot(
              path.join(
                import.meta.dirname,
                '__snapshots__',
                version,
                namespace,
                filePath.slice(outputDir.length + 1),
              ),
            );
          }),
        );
        if (consoleWarn && warnings) {
          for (const warning of warnings) {
            expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining(warning));
          }
          if (scenario.warningCount !== undefined) {
            expect(consoleWarn).toHaveBeenCalledTimes(scenario.warningCount);
          }
        }
      } finally {
        consoleWarn?.mockRestore();
      }
    });

    it('generates Effect output from normalized OpenAPI', async () => {
      const config = createConfig({
        input: 'sdk-instance.yaml',
        output: 'smoke',
        plugins: ['@hey-api/effect'],
      });

      await createClient(config);

      expect(fs.readFileSync(path.join(config.output, 'effect.gen.ts'), 'utf8')).toContain(
        'HttpApi.make',
      );
      expect(fs.readFileSync(path.join(config.output, 'effect-schema.gen.ts'), 'utf8')).toContain(
        'effect/Schema',
      );
    });

    if (version === '3.1.x') {
      it.each([
        { importName: 'v', validator: 'valibot' },
        { importName: 'z', validator: 'zod' },
      ] as const)(
        'generates an Effect SDK with $validator validation',
        async ({ importName, validator }) => {
          const config = createConfig({
            input: 'sdk-instance.yaml',
            output: `effect-client-${validator}`,
            plugins: [
              validator,
              '@hey-api/client-effect',
              {
                name: '@hey-api/sdk',
                transformer: true,
                validator: true,
              },
            ],
          });

          await createClient(config);

          const sdk = fs.readFileSync(path.join(config.output, 'sdk.gen.ts'), 'utf8');
          expect(sdk).toContain(`import * as ${importName} from '${validator}';`);
          expect(sdk).toContain('requestValidator:');
          expect(sdk).toContain('responseTransformer:');
          expect(fs.existsSync(path.join(config.output, 'client', 'client.gen.ts'))).toBe(true);
        },
      );

      it('rejects Promise-only wrappers with the Effect client', async () => {
        await expect(
          createClient(
            createConfig({
              output: 'incompatible-wrapper',
              plugins: ['@hey-api/client-effect', '@tanstack/react-query'],
            }),
          ),
        ).rejects.toMatchObject({
          originalError: {
            error: {
              message:
                '@hey-api/client-effect cannot be combined with @tanstack/react-query: it expects Promise-returning SDK functions',
            },
          },
        });
      });
    }
  });
}

describe('custom plugin', () => {
  it('handles a custom plugin', async () => {
    const myPlugin: DefinePlugin<{
      customOption: boolean;
      name: any;
    }>['Config'] = {
      api: undefined,
      config: {
        customOption: true,
      },
      dependencies: ['@hey-api/typescript'],
      handler: vi.fn(),
      name: 'my-plugin',
    };

    await createClient({
      input: path.join(getSpecsPath(), '3.1.x', 'full.yaml'),
      logs: {
        level: 'silent',
      },
      output: path.join(import.meta.dirname, 'generated', 'my-plugin', 'default'),
      plugins: [myPlugin, '@hey-api/client-fetch'],
    });

    expect(myPlugin.handler).toHaveBeenCalled();
  });

  it.skip('throws on invalid dependency', async () => {
    const myPlugin: DefinePlugin<{
      name: any;
    }>['Config'] = {
      api: undefined,
      config: {},
      dependencies: ['@hey-api/oops'],
      handler: vi.fn(),
      name: 'my-plugin',
    };

    await expect(() =>
      createClient({
        input: path.join(getSpecsPath(), '3.1.x', 'full.yaml'),
        logs: {
          level: 'silent',
        },
        output: path.join(import.meta.dirname, 'generated', 'my-plugin', 'default'),
        plugins: [myPlugin, '@hey-api/client-fetch'],
      }),
    ).rejects.toThrowError(/Found 1 configuration error./g);

    expect(myPlugin.handler).not.toHaveBeenCalled();
  });
});
