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

    it.each(scenarios)('$description', async ({ config }) => {
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
    });
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

describe('resolvers', () => {
  it('@hey-api/typescript receives a path', async () => {
    const assertPath = (ctx: { path: { '~ref': ReadonlyArray<string | number> } }): undefined => {
      expect(ctx.path['~ref'].length).toBeGreaterThan(0);
    };
    await createClient({
      input: path.join(getSpecsPath(), '3.1.x', 'full.yaml'),
      logs: {
        level: 'silent',
      },
      output: path.join(import.meta.dirname, 'generated', 'my-plugin', 'default'),
      plugins: [
        {
          $resolvers: {
            array: assertPath,
            boolean: assertPath,
            enum: assertPath,
            intersection: assertPath,
            never: assertPath,
            null: assertPath,
            number: assertPath,
            object: assertPath,
            string: assertPath,
            tuple: assertPath,
            undefined: assertPath,
            union: assertPath,
            unknown: assertPath,
            void: assertPath,
          },
          name: '@hey-api/typescript',
        },
      ],
    });
  });
});
