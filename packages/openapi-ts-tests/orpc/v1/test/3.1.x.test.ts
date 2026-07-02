import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-ts';

import { getFilePaths } from '../../../utils';
import { snapshotsDir, tmpDir } from './constants';
import { createConfigFactory } from './utils';

const version = '3.1.x';

const outputDir = path.join(tmpDir, version);

describe(`OpenAPI ${version}`, () => {
  const createConfig = createConfigFactory({ openApiVersion: version, outputDir });

  const scenarios = [
    {
      config: createConfig({
        input: 'rpc.yaml',
        output: 'default',
        plugins: [{ compatibilityVersion: 1, name: 'orpc' }, 'zod'],
      }),
      description: 'generate oRPC contracts with Zod schemas',
    },
    {
      config: createConfig({
        input: 'rpc.yaml',
        output: 'custom-names',
        plugins: [
          'valibot',
          {
            compatibilityVersion: 1,
            contracts: {
              containerName: 'rpcContract',
              contractName: '{{name}}Rpc',
            },
            name: 'orpc',
          },
        ],
      }),
      description: 'generate oRPC contracts with custom names and Valibot schemas',
    },
    {
      config: createConfig({
        input: 'rpc.yaml',
        output: 'contracts-strategy-by-tags',
        plugins: [
          'zod',
          {
            compatibilityVersion: 1,
            contracts: {
              strategy: 'byTags',
            },
            name: 'orpc',
          },
        ],
      }),
      description: 'generate oRPC contracts grouped by tags',
    },
    {
      config: createConfig({
        input: 'rpc.yaml',
        output: 'contracts-strategy-single',
        plugins: [
          'zod',
          {
            compatibilityVersion: 1,
            contracts: {
              containerName: 'api',
              strategy: 'single',
            },
            name: 'orpc',
          },
        ],
      }),
      description: 'generate oRPC contracts in a single container',
    },
    {
      config: createConfig({
        input: 'rpc.yaml',
        output: 'contracts-nesting-id',
        plugins: [
          'zod',
          {
            compatibilityVersion: 1,
            contracts: {
              nesting: 'id',
              strategy: 'byTags',
            },
            name: 'orpc',
          },
        ],
      }),
      description: 'generate oRPC contracts without operationId nesting',
    },
    {
      config: createConfig({
        input: 'rpc.yaml',
        output: 'contracts-custom-naming',
        plugins: [
          'zod',
          {
            compatibilityVersion: 1,
            contracts: {
              containerName: '{{name}}Contracts',
              contractName: { casing: 'PascalCase' },
              segmentName: { casing: 'PascalCase' },
              strategy: 'byTags',
            },
            name: 'orpc',
          },
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
