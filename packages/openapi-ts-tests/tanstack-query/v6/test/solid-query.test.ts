import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-ts';

import { getFilePaths } from '../../../utils';
import { snapshotsDir, tmpDir } from './constants';

describe('Solid Query v6', () => {
  it.each(['fetch', 'axios'] as const)('generates options for the %s client', async (client) => {
    const output = path.join(tmpDir, client);

    await createClient({
      input: path.join(import.meta.dirname, 'fixtures', 'solid-query.yaml'),
      logs: { level: 'silent' },
      output,
      plugins: [
        `@hey-api/client-${client}`,
        {
          getQueryData: true,
          infiniteQueryKeys: { tags: true },
          infiniteQueryOptions: { meta: (operation) => ({ operationId: operation.id }) },
          mutationKeys: { tags: true },
          mutationOptions: { meta: (operation) => ({ operationId: operation.id }) },
          name: '@tanstack/solid-query',
          queryKeys: { tags: true },
          queryOptions: { meta: (operation) => ({ operationId: operation.id }) },
          setQueryData: true,
        },
      ],
    });

    await Promise.all(
      getFilePaths(output).map(async (filePath) => {
        await expect(fs.readFileSync(filePath, 'utf-8')).toMatchFileSnapshot(
          path.join(snapshotsDir, client, path.relative(output, filePath)),
        );
      }),
    );
  });
});
