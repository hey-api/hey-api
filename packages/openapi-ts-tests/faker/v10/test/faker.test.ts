import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-ts';

import { getFilePaths } from '../../../utils';
import { snapshotsDir, tmpDir } from './constants';
import { createConfigFactory } from './utils';

const versions = ['2.0.x', '3.0.x', '3.1.x'] as const;

describe.each(versions)('OpenAPI %s', (version) => {
  const outputDir = path.join(tmpDir, version);

  const createConfig = createConfigFactory({ openApiVersion: version, outputDir });

  const scenarios = [
    {
      config: createConfig({
        input: 'faker.yaml',
        output: 'faker',
      }),
      description: 'generates faker factories without type annotations',
    },
    {
      config: createConfig({
        input: 'faker.yaml',
        output: 'faker-locale',
        plugins: [{ locale: 'de', name: '@faker-js/faker' }],
      }),
      description: 'generates faker factories with locale-specific import',
    },
    {
      config: createConfig({
        input: 'faker.yaml',
        output: 'faker-typed',
        plugins: ['@hey-api/typescript', '@faker-js/faker'],
      }),
      description: 'generates typed faker factories when typescript plugin is active',
    },
    {
      config: createConfig({
        input: 'faker.yaml',
        output: 'faker-typed-method',
        plugins: [
          {
            name: '@hey-api/typescript',
            requests: {
              method: true,
            },
          },
          '@faker-js/faker',
        ],
      }),
      description: 'omits method from typed faker factories when request types include it',
    },
    {
      config: createConfig({
        input: 'circular.yaml',
        output: 'faker-circular',
        plugins: ['@hey-api/typescript', '@faker-js/faker'],
      }),
      description: 'generates faker factories with schemas with circular references',
    },
    {
      config: createConfig({
        input: 'faker.yaml',
        output: 'faker-name-rules',
        plugins: [
          '@hey-api/typescript',
          {
            name: '@faker-js/faker',
            nameRules: {
              string: {
                'error.message': {
                  defaultArgs: { count: 4 },
                  fakerPath: ['word', 'words'],
                },
                id: {
                  fakerPath: ['database', 'mongodbObjectId'],
                  suffixMatch: true,
                },
              },
            },
          },
        ],
      }),
      description: 'generates faker factories with name rules',
    },
    {
      config: createConfig({
        input: 'full.yaml',
        output: 'faker-full',
        plugins: ['@hey-api/typescript', { compatibilityVersion: 9, name: '@faker-js/faker' }],
      }),
      description: 'generates faker factories',
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
