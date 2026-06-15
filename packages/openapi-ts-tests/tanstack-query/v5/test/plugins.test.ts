import fs from 'node:fs';
import path from 'node:path';

import type { DefinePlugin } from '@hey-api/openapi-ts';
import { createClient } from '@hey-api/openapi-ts';

import { getFilePaths, getSpecsPath } from '../../../utils';
import { snapshotsDir, tmpDir } from './constants';
import { createConfigFactory } from './utils';

const versions = ['2.0.x', '3.0.x', '3.1.x'];

for (const version of versions) {
  const namespace = 'plugins';

  const outputDir = path.join(tmpDir, version, namespace);

  describe(`OpenAPI ${version} ${namespace}`, () => {
    const createConfig = createConfigFactory({
      openApiVersion: version,
      outputDir,
    });

    const scenarios = [
      {
        config: createConfig({
          input: 'full.yaml',
          output: 'fetch',
          plugins: [
            '@tanstack/angular-query-experimental',
            '@tanstack/preact-query',
            '@tanstack/react-query',
            '@tanstack/solid-query',
            '@tanstack/svelte-query',
            '@tanstack/vue-query',
            '@hey-api/client-fetch',
          ],
        }),
        description: 'generate Fetch API client with TanStack Query plugins',
      },
      {
        config: createConfig({
          input: 'full.yaml',
          output: 'axios',
          plugins: [
            '@tanstack/angular-query-experimental',
            '@tanstack/preact-query',
            '@tanstack/react-query',
            '@tanstack/solid-query',
            '@tanstack/svelte-query',
            '@tanstack/vue-query',
            '@hey-api/client-axios',
          ],
        }),
        description: 'generate Axios client with TanStack Query plugins',
      },
      {
        config: createConfig({
          input: 'sdk-instance.yaml',
          output: 'asClass',
          plugins: [
            '@tanstack/angular-query-experimental',
            '@tanstack/preact-query',
            '@tanstack/react-query',
            '@tanstack/solid-query',
            '@tanstack/svelte-query',
            '@tanstack/vue-query',
            '@hey-api/client-fetch',
            {
              asClass: true,
              classNameBuilder: '{{name}}Service',
              name: '@hey-api/sdk',
            },
          ],
        }),
        description: 'generate Fetch API client with TanStack Query plugins using class-based SDKs',
      },
      {
        config: createConfig({
          input: 'sdk-instance.yaml',
          output: 'name-builder',
          plugins: [
            {
              infiniteQueryKeys: {
                name: '{{name}}A',
              },
              infiniteQueryOptions: {
                name: '{{name}}B',
              },
              mutationOptions: {
                name: '{{name}}C',
              },
              name: '@tanstack/angular-query-experimental',
              queryKeys: {
                name: '{{name}}D',
              },
              queryOptions: {
                name: '{{name}}E',
              },
            },
            {
              infiniteQueryKeys: {
                name: '{{name}}A',
              },
              infiniteQueryOptions: {
                name: '{{name}}B',
              },
              mutationOptions: {
                name: '{{name}}C',
              },
              name: '@tanstack/preact-query',
              queryKeys: {
                name: '{{name}}D',
              },
              queryOptions: {
                name: '{{name}}E',
              },
            },
            {
              infiniteQueryKeys: {
                name: '{{name}}A',
              },
              infiniteQueryOptions: {
                name: '{{name}}B',
              },
              mutationOptions: {
                name: '{{name}}C',
              },
              name: '@tanstack/react-query',
              queryKeys: {
                name: '{{name}}D',
              },
              queryOptions: {
                name: '{{name}}E',
              },
            },
            {
              infiniteQueryKeys: {
                name: '{{name}}A',
              },
              infiniteQueryOptions: {
                name: '{{name}}B',
              },
              mutationOptions: {
                name: '{{name}}C',
              },
              name: '@tanstack/solid-query',
              queryKeys: {
                name: '{{name}}D',
              },
              queryOptions: {
                name: '{{name}}E',
              },
            },
            {
              infiniteQueryKeys: {
                name: '{{name}}A',
              },
              infiniteQueryOptions: {
                name: '{{name}}B',
              },
              mutationOptions: {
                name: '{{name}}C',
              },
              name: '@tanstack/svelte-query',
              queryKeys: {
                name: '{{name}}D',
              },
              queryOptions: {
                name: '{{name}}E',
              },
            },
            {
              infiniteQueryKeys: {
                name: '{{name}}A',
              },
              infiniteQueryOptions: {
                name: '{{name}}B',
              },
              mutationOptions: {
                name: '{{name}}C',
              },
              name: '@tanstack/vue-query',
              queryKeys: {
                name: '{{name}}D',
              },
              queryOptions: {
                name: '{{name}}E',
              },
            },
            '@hey-api/client-fetch',
            '@hey-api/sdk',
          ],
        }),
        description: 'generate Fetch API client with TanStack Query plugins with custom names',
      },
      {
        config: createConfig({
          input: 'full.yaml',
          output: 'full-config',
          plugins: [
            {
              getQueryData: true,
              mutationKeys: true,
              name: '@tanstack/react-query',
              setQueryData: true,
              useGetQueryData: true,
              useMutation: true,
              useQuery: true,
              useSetQueryData: true,
            },
            '@hey-api/client-fetch',
          ],
        }),
        description:
          'generate Fetch API client with TanStack React Query plugin with optional fields',
      },
      {
        config: createConfig({
          input: 'full.yaml',
          output: 'useQuery-enabled',
          plugins: [
            {
              name: '@tanstack/react-query',
              useQuery: true,
            },
            '@hey-api/client-fetch',
          ],
        }),
        description:
          'generate Fetch API client with TanStack React Query plugin with useQuery enabled',
      },
    ];

    it.each(scenarios)('$description', async ({ config }) => {
      await createClient(config);

      const filePaths = getFilePaths(config.output);

      await Promise.all(
        filePaths.map(async (filePath) => {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          await expect(fileContent).toMatchFileSnapshot(
            path.join(snapshotsDir, version, namespace, filePath.slice(outputDir.length + 1)),
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

    const outputDir = path.join(tmpDir, 'my-plugin', 'default');

    await createClient({
      input: path.join(getSpecsPath(), '3.1.x', 'full.yaml'),
      logs: {
        level: 'silent',
      },
      output: outputDir,
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

    const outputDir = path.join(tmpDir, 'my-plugin', 'default');

    await expect(() =>
      createClient({
        input: path.join(getSpecsPath(), '3.1.x', 'full.yaml'),
        logs: {
          level: 'silent',
        },
        output: outputDir,
        plugins: [myPlugin, '@hey-api/client-fetch'],
      }),
    ).rejects.toThrowError(/Found 1 configuration error./g);

    expect(myPlugin.handler).not.toHaveBeenCalled();
  });
});
