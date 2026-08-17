import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-ts';

import { getFilePaths } from '../../../utils';
import { snapshotsDir, tmpDir } from './constants';
import { createConfigFactory, zodVersions } from './utils';

const version = '3.0.x';

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
          input: 'array-items-one-of-length-1.yaml',
          output: 'array-items-one-of-length-1',
        }),
        description: 'generates correct array when items are oneOf array with single item',
      },
      {
        config: createConfig({
          input: 'circular.yaml',
          output: 'circular',
        }),
        description: 'generates circular schemas',
      },
      {
        config: createConfig({
          input: 'discriminator-allof-member.yaml',
          output: 'discriminator-allof-member',
        }),
        description:
          'falls back to z.union() when discriminated union members have allOf (intersection)',
      },
      {
        config: createConfig({
          input: 'discriminator-empty-object-member.yaml',
          output: 'discriminator-empty-object-member',
        }),
        description:
          'falls back to z.union() when a discriminated union member is an empty object (z.record cannot be extended)',
      },
      {
        config: createConfig({
          input: 'enum-null.json',
          output: 'enum-null',
        }),
        description: 'handles null enums',
      },
      {
        config: createConfig({
          input: 'validators.json',
          output: 'validators',
        }),
        description: 'generates validator schemas',
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
