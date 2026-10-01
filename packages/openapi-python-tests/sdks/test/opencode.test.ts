import { execFileSync } from 'node:child_process';
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
const multipartSpecPath = path.join(getSpecsPath(), '3.1.x', 'python-multipart.json');

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
        input: multipartSpecPath,
        output: 'multipart',
        plugins: ['pydantic', { name: '@hey-api/python-sdk', paramsStructure: 'flat' }],
      }),
      description: 'multipart',
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

  it('sends binary, scalar, object, and repeated parts as multipart', async () => {
    const config = createConfig({
      input: multipartSpecPath,
      output: 'multipart_runtime',
      plugins: ['pydantic', { name: '@hey-api/python-sdk', paramsStructure: 'flat' }],
    });
    await createClient(config);

    execFileSync(
      'uv',
      [
        'run',
        '--locked',
        'python',
        path.join(import.meta.dirname, 'multipart-runtime.py'),
        outputDir,
      ],
      { cwd: path.resolve(import.meta.dirname, '../../../..') },
    );
  }, 30_000);
});
