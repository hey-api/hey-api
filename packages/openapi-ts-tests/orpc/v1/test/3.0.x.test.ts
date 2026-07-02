import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-ts';

import { getFilePaths } from '../../../utils';
import { snapshotsDir, tmpDir } from './constants';
import { createConfigFactory } from './utils';

const version = '3.0.x';

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
  ];

  it.each(scenarios)('$description', async ({ config }) => {
    await createClient(config);

    const outputString = config.output as string;
    const filePaths = getFilePaths(outputString);

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
