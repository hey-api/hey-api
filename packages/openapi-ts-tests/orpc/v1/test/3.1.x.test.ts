import fs from 'node:fs';
import path from 'node:path';

import { createClient, plugins } from '@hey-api/openapi-ts';

import { getFilePaths } from '../../../utils';
import { snapshotsDir, tmpDir } from './constants';
import { createConfigFactory } from './utils';

const versions = ['3.1.x'] as const;

describe.each(versions)('OpenAPI %s', (version) => {
  const outputDir = path.join(tmpDir, version);

  const createConfig = createConfigFactory({ openApiVersion: version, outputDir });

  const scenarios = [
    {
      config: createConfig({
        input: 'rpc.yaml',
        output: 'default',
        plugins: [plugins.orpc({ compatibilityVersion: '1' }), plugins.zod()],
      }),
      description: 'generate oRPC contracts with Zod schemas',
    },
    {
      config: createConfig({
        input: 'rpc.yaml',
        output: 'custom-names',
        plugins: [
          plugins.valibot(),
          plugins.orpc({
            compatibilityVersion: '1',
            contracts: {
              containerName: 'rpcContract',
              contractName: '{{name}}Rpc',
            },
          }),
        ],
      }),
      description: 'generate oRPC contracts with custom names and Valibot schemas',
    },
    {
      config: createConfig({
        input: 'rpc.yaml',
        output: 'contracts-strategy-by-tags',
        plugins: [
          plugins.zod(),
          plugins.orpc({
            compatibilityVersion: '1',
            contracts: {
              strategy: 'byTags',
            },
          }),
        ],
      }),
      description: 'generate oRPC contracts grouped by tags',
    },
    {
      config: createConfig({
        input: 'rpc.yaml',
        output: 'contracts-strategy-single',
        plugins: [
          plugins.zod(),
          plugins.orpc({
            compatibilityVersion: '1',
            contracts: {
              containerName: 'api',
              strategy: 'single',
            },
          }),
        ],
      }),
      description: 'generate oRPC contracts in a single container',
    },
    {
      config: createConfig({
        input: 'rpc.yaml',
        output: 'contracts-nesting-id',
        plugins: [
          plugins.zod(),
          plugins.orpc({
            compatibilityVersion: '1',
            contracts: {
              nesting: 'id',
              strategy: 'byTags',
            },
          }),
        ],
      }),
      description: 'generate oRPC contracts without operationId nesting',
    },
    {
      config: createConfig({
        input: 'rpc.yaml',
        output: 'contracts-custom-naming',
        plugins: [
          plugins.zod(),
          plugins.orpc({
            compatibilityVersion: '1',
            contracts: {
              containerName: '{{name}}Contracts',
              contractName: { casing: 'PascalCase' },
              segmentName: { casing: 'PascalCase' },
              strategy: 'byTags',
            },
          }),
        ],
      }),
      description: 'generate oRPC contracts with custom naming',
    },
  ];

  it.each(scenarios)('$description', async ({ config }) => {
    await createClient(config);

    const filePaths = getFilePaths(config.output as string);

    await Promise.all(
      filePaths.map(async (filePath) => {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        await expect(fileContent).toMatchFileSnapshot(
          path.join(snapshotsDir, version, filePath.slice(outputDir.length + 1)),
        );
      }),
    );
  });
});
