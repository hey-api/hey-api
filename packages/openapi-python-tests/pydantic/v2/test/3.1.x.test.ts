import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-python';

import { getFilePaths } from '../../../utils';
import { snapshotsDir, tmpDir } from './constants';
import { createConfigFactory } from './utils';

const version = '3.1.x';

const outputDir = path.join(tmpDir, version);

describe(`OpenAPI ${version}`, () => {
  const createConfig = createConfigFactory({ openApiVersion: version, outputDir });

  const scenarios = [
    {
      config: createConfig({
        input: 'opencode.yaml',
        output: 'opencode',
      }),
      description: 'OpenCode',
    },
    {
      config: createConfig({
        input: 'zoom-video-sdk.json',
        output: 'zoom-video-sdk',
      }),
      description: 'Zoom Video SDK',
    },
    {
      config: createConfig({
        input: 'discriminator-all-of.yaml',
        output: 'discriminator-all-of',
      }),
      description: 'Discriminator All Of',
    },
    {
      config: createConfig({
        input: 'discriminator-allof-inline.json',
        output: 'discriminator-allof-inline',
      }),
      description: 'Discriminator AllOf Inline',
    },
    {
      config: createConfig({
        input: 'discriminator-allof-member.yaml',
        output: 'discriminator-allof-member',
      }),
      description: 'Discriminator AllOf Member',
    },
    {
      config: createConfig({
        input: 'discriminator-allof-nested.json',
        output: 'discriminator-allof-nested',
      }),
      description: 'Discriminator AllOf Nested',
    },
    {
      config: createConfig({
        input: 'discriminator-any-of.yaml',
        output: 'discriminator-any-of',
      }),
      description: 'Discriminator Any Of',
    },
    {
      config: createConfig({
        input: 'discriminator-empty-object-member.yaml',
        output: 'discriminator-empty-object-member',
      }),
      description: 'Discriminator Empty Object Member',
    },
    {
      config: createConfig({
        input: 'discriminator-mapped-many.yaml',
        output: 'discriminator-mapped-many',
      }),
      description: 'Discriminator Mapped Many',
    },
    {
      config: createConfig({
        input: 'discriminator-non-string.yaml',
        output: 'discriminator-non-string',
      }),
      description: 'Discriminator Non String',
    },
    {
      config: createConfig({
        input: 'discriminator-object-self-mapped.json',
        output: 'discriminator-object-self-mapped',
      }),
      description: 'Discriminator Object Self Mapped',
    },
    {
      config: createConfig({
        input: 'discriminator-one-of-read-write.yaml',
        output: 'discriminator-one-of-read-write',
      }),
      description: 'Discriminator One Of Read Write',
    },
    {
      config: createConfig({
        input: 'discriminator-one-of.yaml',
        output: 'discriminator-one-of',
      }),
      description: 'Discriminator One Of',
    },
    {
      config: createConfig({
        input: 'python-response-composition.json',
        output: 'python-response-composition',
      }),
      description: 'Python Response Composition',
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
