import fs from 'node:fs';
import path from 'node:path';

import { createClient, type UserConfig } from '@hey-api/openapi-ts';

import { getFilePaths, getSpecsPath } from '../../utils';

const version = '3.2.x';

const outputDir = path.join(import.meta.dirname, 'generated', version);

describe(`OpenAPI ${version}`, () => {
  const createConfig = (userConfig: UserConfig) =>
    ({
      ...userConfig,
      input: path.join(getSpecsPath(), version, userConfig.input as string),
      logs: {
        level: 'silent',
      },
      output: {
        path: path.join(outputDir, userConfig.output as string),
      },
    }) as const satisfies UserConfig;

  const scenarios = [
    {
      config: createConfig({
        input: 'http-query.yaml',
        output: 'http-query',
        plugins: ['@hey-api/client-fetch', '@hey-api/typescript', '@hey-api/sdk', '@pinia/colada'],
      }),
      description: 'generates HTTP QUERY operations',
    },
  ];

  it.each(scenarios)('$description', async ({ config }) => {
    await createClient(config);

    const filePaths = getFilePaths(config.output.path);

    await Promise.all(
      filePaths.map(async (filePath) => {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        await expect(fileContent).toMatchFileSnapshot(
          path.join(
            import.meta.dirname,
            '__snapshots__',
            version,
            filePath.slice(outputDir.length + 1),
          ),
        );
      }),
    );
  });
});
