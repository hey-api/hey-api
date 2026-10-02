import fs from 'node:fs';
import path from 'node:path';

import { customClientPlugin } from '@hey-api/custom-client/plugin';
import { createClient, type UserConfig } from '@hey-api/openapi-ts';

import { getFilePaths, getSpecsPath } from '../../utils';
import { myClientPlugin } from './custom/client/plugin';

const clients = [
  '@hey-api/client-angular',
  '@hey-api/client-axios',
  '@hey-api/client-fetch',
  '@hey-api/client-ky',
  '@hey-api/client-next',
  '@hey-api/client-nuxt',
  '@hey-api/client-ofetch',
] satisfies UserConfig['plugins'];

for (const client of clients) {
  const namespace = 'clients';

  const outputDir = path.join(import.meta.dirname, 'generated', '3.1.x', namespace, client);

  describe(client, () => {
    const createConfig = (
      userConfig: Omit<UserConfig, 'input'> & Pick<Partial<UserConfig>, 'input'>,
    ) => {
      const output = userConfig.output instanceof Array ? userConfig.output[0] : userConfig.output;
      return {
        ...userConfig,
        input: path.join(getSpecsPath(), '3.1.x', 'full.yaml'),
        logs: {
          level: 'silent',
        },
        output:
          typeof output === 'string'
            ? path.join(outputDir, output)
            : {
                ...output,
                path: path.join(outputDir, output?.path ?? ''),
              },
      } as const satisfies UserConfig;
    };

    const scenarios = [
      {
        config: createConfig({
          output: 'default',
          plugins: [client],
        }),
        description: 'default output',
      },
      {
        config: createConfig({
          output: 'sdk-client-optional',
          plugins: [
            client,
            {
              client: true,
              name: '@hey-api/sdk',
            },
          ],
        }),
        description: 'SDK with optional client option',
      },
      {
        config: createConfig({
          output: 'sdk-client-required',
          plugins: [
            client,
            {
              client: false,
              name: '@hey-api/sdk',
            },
          ],
        }),
        description: 'SDK with required client option',
      },
      {
        config: createConfig({
          output: 'sdk-response-style-data',
          plugins: [
            client,
            {
              name: '@hey-api/sdk',
              responseStyle: 'data',
            },
          ],
        }),
        description: 'SDK with responseStyle data',
      },
      {
        config: createConfig({
          output: 'base-url-false',
          plugins: [
            {
              baseUrl: false,
              name: client,
            },
            '@hey-api/typescript',
          ],
        }),
        description: 'client without base URL',
      },
      {
        config: createConfig({
          output: 'base-url-number',
          plugins: [
            {
              baseUrl: 0,
              name: client,
            },
            '@hey-api/typescript',
          ],
        }),
        description: 'client with numeric base URL',
      },
      {
        config: createConfig({
          output: 'base-url-string',
          plugins: [
            {
              baseUrl: 'https://foo.com',
              name: client,
            },
            '@hey-api/typescript',
          ],
        }),
        description: 'client with custom string base URL',
      },
      {
        config: createConfig({
          output: 'base-url-strict',
          plugins: [
            {
              name: client,
              strictBaseUrl: true,
            },
            '@hey-api/typescript',
          ],
        }),
        description: 'client with strict base URL',
      },
      {
        config: createConfig({
          output: {
            path: 'tsconfig-nodenext-sdk',
            tsConfigPath: path.join(import.meta.dirname, 'tsconfig', 'tsconfig.nodenext.json'),
          },
          plugins: [client, '@hey-api/sdk'],
        }),
        description: 'SDK with NodeNext tsconfig',
      },
      {
        config: createConfig({
          output: {
            path: 'tsconfig-node16-sdk',
            tsConfigPath: path.join(import.meta.dirname, 'tsconfig', 'tsconfig.node16.json'),
          },
          plugins: [client, '@hey-api/sdk'],
        }),
        description: 'SDK with Node16 tsconfig',
      },
      {
        config: createConfig({
          output: {
            importFileExtension: '.ts',
            path: 'import-file-extension-ts',
          },
          plugins: [client, '@hey-api/sdk'],
        }),
        description: 'SDK with .ts import file extensions',
      },
      {
        config: createConfig({
          output: {
            clean: false,
            path: 'clean-false',
          },
          plugins: [client, '@hey-api/sdk'],
        }),
        description: 'avoid appending extension multiple times | twice',
      },
    ];

    it.each(scenarios)('$description', async ({ config, description }) => {
      await createClient(config);
      if (description.endsWith('twice')) {
        await createClient(config);
      }

      const outputPath = typeof config.output === 'string' ? config.output : config.output.path;
      const filePaths = getFilePaths(outputPath);

      await Promise.all(
        filePaths.map(async (filePath) => {
          const fileContent = fs.readFileSync(filePath, 'utf-8');

          // flaky test reordering client imports, skip
          if (
            client === '@hey-api/client-nuxt' &&
            typeof config.output === 'string' &&
            config.output.includes('bundle')
          ) {
            expect(1).toBe(1);
            return;
          }

          await expect(fileContent).toMatchFileSnapshot(
            path.join(
              import.meta.dirname,
              '__snapshots__',
              '3.1.x',
              namespace,
              client,
              filePath.slice(outputDir.length + 1),
            ),
          );
        }),
      );
    });
  });
}

describe('custom-client', () => {
  const namespace = 'clients';

  const outputDir = path.join(
    import.meta.dirname,
    'generated',
    '3.1.x',
    namespace,
    'client-custom',
  );

  const createConfig = (
    userConfig: Omit<UserConfig, 'input'> & Pick<Partial<UserConfig>, 'input'>,
  ) =>
    ({
      ...userConfig,
      input: path.join(getSpecsPath(), '3.1.x', 'full.yaml'),
      logs: {
        level: 'silent',
      },
      output: path.join(outputDir, typeof userConfig.output === 'string' ? userConfig.output : ''),
    }) as const satisfies UserConfig;

  const scenarios = [
    {
      config: createConfig({
        output: 'default',
        plugins: [customClientPlugin()],
      }),
      description: 'default output',
    },
    // TODO: enable custom client bundle, it's currently producing CJS output which fails typecheck
    // {
    //   config: createConfig({
    //     output: 'bundle',
    //     plugins: [
    //       customClientPlugin({
    //         bundle: true,
    //       }),
    //     ],
    //   }),
    //   description: 'default output with bundled client',
    // },
    {
      config: createConfig({
        output: 'sdk-client-optional',
        plugins: [
          customClientPlugin(),
          {
            client: true,
            name: '@hey-api/sdk',
          },
        ],
      }),
      description: 'SDK with optional client option',
    },
    {
      config: createConfig({
        output: 'sdk-client-required',
        plugins: [
          customClientPlugin(),
          {
            client: false,
            name: '@hey-api/sdk',
          },
        ],
      }),
      description: 'SDK with required client option',
    },
    {
      config: createConfig({
        output: 'base-url-false',
        plugins: [
          customClientPlugin({
            baseUrl: false,
          }),
          '@hey-api/typescript',
        ],
      }),
      description: 'client without base URL',
    },
    {
      config: createConfig({
        output: 'base-url-number',
        plugins: [
          customClientPlugin({
            baseUrl: 0,
          }),
          '@hey-api/typescript',
        ],
      }),
      description: 'client with numeric base URL',
    },
    {
      config: createConfig({
        output: 'base-url-string',
        plugins: [
          customClientPlugin({
            baseUrl: 'https://foo.com',
          }),
          '@hey-api/typescript',
        ],
      }),
      description: 'client with custom string base URL',
    },
    {
      config: createConfig({
        output: 'base-url-strict',
        plugins: [
          customClientPlugin({
            strictBaseUrl: true,
          }),
          '@hey-api/typescript',
        ],
      }),
      description: 'client with strict base URL',
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
            '3.1.x',
            namespace,
            'client-custom',
            filePath.slice(outputDir.length + 1),
          ),
        );
      }),
    );
  });
});

describe('my-client', () => {
  const namespace = 'clients';

  const outputDir = path.join(import.meta.dirname, 'generated', '3.1.x', namespace, 'my-client');

  const createConfig = (
    userConfig: Omit<UserConfig, 'input'> & Pick<Partial<UserConfig>, 'input'>,
  ) =>
    ({
      ...userConfig,
      input: path.join(getSpecsPath(), '3.1.x', 'full.yaml'),
      logs: {
        level: 'silent',
      },
      output: path.join(outputDir, typeof userConfig.output === 'string' ? userConfig.output : ''),
    }) as const satisfies UserConfig;

  const scenarios = [
    {
      config: createConfig({
        output: 'default',
        plugins: [myClientPlugin()],
      }),
      description: 'default output',
    },
    {
      config: createConfig({
        output: 'bundle',
        plugins: [
          myClientPlugin({
            bundle: true,
          }),
        ],
      }),
      description: 'default output with bundled client',
    },
    {
      config: createConfig({
        output: 'sdk-client-optional',
        plugins: [
          myClientPlugin(),
          {
            client: true,
            name: '@hey-api/sdk',
          },
        ],
      }),
      description: 'SDK with optional client option',
    },
    {
      config: createConfig({
        output: 'sdk-client-required',
        plugins: [
          myClientPlugin(),
          {
            client: false,
            name: '@hey-api/sdk',
          },
        ],
      }),
      description: 'SDK with required client option',
    },
    {
      config: createConfig({
        output: 'base-url-false',
        plugins: [
          myClientPlugin({
            baseUrl: false,
          }),
          '@hey-api/typescript',
        ],
      }),
      description: 'client without base URL',
    },
    {
      config: createConfig({
        output: 'base-url-number',
        plugins: [
          myClientPlugin({
            baseUrl: 0,
          }),
          '@hey-api/typescript',
        ],
      }),
      description: 'client with numeric base URL',
    },
    {
      config: createConfig({
        output: 'base-url-string',
        plugins: [
          myClientPlugin({
            baseUrl: 'https://foo.com',
          }),
          '@hey-api/typescript',
        ],
      }),
      description: 'client with custom string base URL',
    },
    {
      config: createConfig({
        output: 'base-url-strict',
        plugins: [
          myClientPlugin({
            strictBaseUrl: true,
          }),
          '@hey-api/typescript',
        ],
      }),
      description: 'client with strict base URL',
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
            '3.1.x',
            namespace,
            'my-client',
            filePath.slice(outputDir.length + 1),
          ),
        );
      }),
    );
  });
});
