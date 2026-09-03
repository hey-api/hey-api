import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-python';

import { getFilePaths, getSpecsPath } from '../../utils';
import { createSdkConfig, getSnapshotsPath, getTempSnapshotsPath } from './utils';

const namespace = 'opencode';

const outputDir = path.join(getTempSnapshotsPath(), namespace);
const snapshotsDir = path.join(getSnapshotsPath(), namespace);

const specPath = path.join(getSpecsPath(), '3.1.x', 'opencode.yaml');
const parametersSpecPath = path.join(getSpecsPath(), '3.1.x', 'python-parameters.json');
const responsesSpecPath = path.join(getSpecsPath(), '3.1.x', 'python-responses.json');

describe(`Python SDK: ${namespace}`, () => {
  const createConfig = createSdkConfig({
    outputDir,
  });

  const scenarios = [
    {
      config: createConfig({
        input: specPath,
        output: 'default',
        plugins: ['@hey-api/python-sdk'],
      }),
      description: 'default',
    },
    {
      config: createConfig({
        input: parametersSpecPath,
        output: 'flat',
        plugins: ['pydantic', { name: '@hey-api/python-sdk', paramsStructure: 'flat' }],
      }),
      description: 'flat parameters',
    },
    {
      config: createConfig({
        input: responsesSpecPath,
        output: 'responses',
        plugins: ['pydantic', { name: '@hey-api/python-sdk', paramsStructure: 'flat' }],
      }),
      description: 'responses',
    },
  ];

  it.each(scenarios)(
    '$description',
    async ({ config }) => {
      await createClient(config);

      const filePaths = getFilePaths(
        typeof config.output === 'string' ? config.output : config.output.path,
      );

      await Promise.all(
        filePaths.map(async (filePath) => {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          await expect(fileContent).toMatchFileSnapshot(
            path.join(snapshotsDir, filePath.slice(outputDir.length + 1)),
          );
        }),
      );
    },
    15_000,
  );
});
