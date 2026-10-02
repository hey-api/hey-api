import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-ts';

import { getFilePaths } from '../../../utils';
import { snapshotsDir, tmpDir } from './constants';
import { createConfigFactory } from './utils';

const version = '3.1.x';

const outputDir = path.join(tmpDir, version);

describe(`OpenAPI ${version}`, () => {
  const createConfig = createConfigFactory({
    openApiVersion: version,
    outputDir,
  });

  const scenarios = [
    {
      config: createConfig({
        input: 'internal-name-conflict.json',
        output: 'internal-name-conflict',
        plugins: ['@hey-api/client-fetch', '@tanstack/react-query'],
      }),
      description: 'handles conflict between generated code and internal artifacts',
    },
    {
      config: createConfig({
        input: 'query-options-name-conflict.yaml',
        output: 'query-options-name-conflict',
        plugins: ['@hey-api/client-fetch', '@tanstack/react-query'],
      }),
      description:
        'queryFn calls the SDK alias when operationId collides with a generated queryOptions name',
    },
    {
      config: createConfig({
        input: 'pagination-ref.yaml',
        output: 'pagination-ref',
        plugins: ['@hey-api/client-fetch', '@tanstack/react-query'],
      }),
      description: 'detects pagination fields',
    },
    {
      config: createConfig({
        input: 'sse-post.yaml',
        output: 'sse-react-query',
        plugins: ['@hey-api/client-fetch', '@tanstack/react-query'],
      }),
      description: 'SSE POST endpoint is excluded from TanStack React Query mutations',
    },
    {
      config: createConfig({
        input: 'full.yaml',
        output: 'response-style-data-axios',
        plugins: [
          '@hey-api/client-axios',
          '@tanstack/react-query',
          {
            name: '@hey-api/sdk',
            responseStyle: 'data',
          },
        ],
      }),
      description:
        'query, mutation and infinite query options do not unwrap responseStyle data for a client without responseStyle support',
    },
    {
      config: createConfig({
        input: 'full.yaml',
        output: 'response-style-data-fetch',
        plugins: [
          '@hey-api/client-fetch',
          '@tanstack/react-query',
          {
            name: '@hey-api/sdk',
            responseStyle: 'data',
          },
        ],
      }),
      description:
        'query, mutation and infinite query options unwrap responseStyle data for a client with responseStyle support',
    },
  ];

  it.each(scenarios)('$description', async ({ config }) => {
    await createClient(config);

    const filePaths = getFilePaths(config.output);

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
