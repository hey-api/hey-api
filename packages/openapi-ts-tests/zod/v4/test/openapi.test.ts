import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-ts';

import { getFilePaths } from '../../../utils';
import { snapshotsDir, tmpDir } from './constants';
import { createConfigFactory, zodVersions } from './utils';

const versions = ['2.0.x', '3.0.x', '3.1.x'];

for (const version of versions) {
  for (const zodVersion of zodVersions) {
    const outputDir = path.join(tmpDir, version, zodVersion.folder);

    describe(`OpenAPI ${version}`, () => {
      const createConfig = createConfigFactory({
        openApiVersion: version,
        outputDir,
        zodVersion,
      });

      const scenarios = [
        {
          config: createConfig({
            input: 'array-items-all-of.yaml',
            output: 'array-items-all-of',
          }),
          description: 'generates correct array when items use allOf (intersection)',
        },
        {
          config: createConfig({
            input: 'full.yaml',
            output: 'default',
          }),
          description: 'generate Zod schemas with Zod plugin',
        },
        {
          config: createConfig({
            input: 'type-format.yaml',
            output: 'type-format',
            plugins: [
              '@hey-api/transformers',
              '@hey-api/client-fetch',
              {
                compatibilityVersion: zodVersion.compatibilityVersion,
                name: 'zod',
              },
              {
                name: '@hey-api/sdk',
                transformer: true,
                validator: true,
              },
            ],
          }),
          description: 'handles various schema types and formats',
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
                snapshotsDir,
                version,
                zodVersion.folder,
                filePath.slice(outputDir.length + 1),
              ),
            );
          }),
        );
      });
    });
  }
}
