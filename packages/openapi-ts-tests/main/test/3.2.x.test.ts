import fs from 'node:fs';
import path from 'node:path';

import { createClient, type UserConfig } from '@hey-api/openapi-ts';

import { getFilePaths, getSpecsPath } from '../../utils';

const version = '3.2.x';

const outputDir = path.join(import.meta.dirname, 'generated', version);

describe(`OpenAPI ${version}`, () => {
  const createConfig = (userConfig: UserConfig) => {
    const input = userConfig.input instanceof Array ? userConfig.input[0] : userConfig.input;
    const inputPath = path.join(
      getSpecsPath(),
      version,
      typeof input === 'string' ? input : ((input?.path as string) ?? ''),
    );
    const output = userConfig.output instanceof Array ? userConfig.output[0] : userConfig.output;
    const outputPath = path.join(
      outputDir,
      typeof output === 'string' ? output : ((output?.path as string) ?? ''),
    );
    const nameConflictResolver =
      typeof output === 'string' ? undefined : output?.nameConflictResolver;
    return {
      plugins: ['@hey-api/typescript'],
      ...userConfig,
      input:
        typeof userConfig.input === 'string'
          ? inputPath
          : {
              ...userConfig.input,
              path: inputPath,
            },
      logs: {
        level: 'silent',
      },
      output: {
        nameConflictResolver,
        path: outputPath,
      },
    } as const satisfies UserConfig;
  };

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
