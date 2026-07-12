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
        input: 'rpc-query-styles.yaml',
        output: 'default',
        plugins: [plugins.zod(), plugins.orpc({ compatibilityVersion: '2' })],
      }),
      description: 'generate oRPC v2 contracts with query styles',
    },
    {
      config: createConfig({
        input: 'rpc-query-styles.yaml',
        output: 'query-styles-disabled',
        plugins: [
          plugins.zod(),
          plugins.orpc({
            compatibilityVersion: '2',
            inferQueryStyles: false,
          }),
        ],
      }),
      description: 'generate oRPC v2 contracts without query styles',
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
