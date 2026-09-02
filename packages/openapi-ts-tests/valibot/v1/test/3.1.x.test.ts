import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-ts';

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
        input: 'array-items-one-of-length-1.yaml',
        output: 'array-items-one-of-length-1',
      }),
      description: 'generates correct array when items are oneOf array with single item',
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
        input: 'schema-const.yaml',
        output: 'schema-const',
      }),
      description: 'handles various constants',
    },
    {
      config: createConfig({
        input: 'validators.yaml',
        output: 'validators',
      }),
      description: 'generates validator schemas',
    },
    {
      config: createConfig({
        input: 'validators.yaml',
        output: 'validators-metadata',
        plugins: [
          {
            metadata: true,
            name: 'valibot',
          },
        ],
      }),
      description: 'generates validator schemas with metadata',
    },
    {
      config: createConfig({
        input: 'validators.yaml',
        output: 'validators-metadata-fn',
        plugins: [
          {
            metadata: ({ $, node, schema }) => {
              node
                .prop('custom', $.literal('value'))
                .prop('title', $.literal(schema.description ?? schema.type ?? ''));
            },
            name: 'valibot',
          },
        ],
      }),
      description: 'generates validator schemas with metadata function',
    },
    {
      config: createConfig({
        input: 'validators.yaml',
        output: 'validators-types',
      }),
      description: 'generates validator schemas with types',
    },
    {
      config: createConfig({
        input: 'validators-bigint-min-max.json',
        output: 'validators-bigint-min-max',
      }),
      description: 'validator schemas with BigInt and min/max constraints',
    },
    {
      config: createConfig({
        input: 'validators-circular-ref.json',
        output: 'validators-circular-ref',
      }),
      description: 'validator schemas with circular reference',
    },
    {
      config: createConfig({
        input: 'validators-circular-ref-2.yaml',
        output: 'validators-circular-ref-2',
      }),
      description: 'validator schemas with circular reference 2',
    },
    {
      config: createConfig({
        input: 'validators-union-merge.json',
        output: 'validators-union-merge',
      }),
      description: "validator schemas with merged unions (can't use .merge())",
    },
    {
      config: createConfig({
        input: 'integer-formats.yaml',
        output: 'integer-formats',
      }),
      description:
        'generates validator schemas for all integer format combinations (number/integer/string types with int8, int16, int32, int64, uint8, uint16, uint32, uint64 formats)',
    },
    {
      config: createConfig({
        input: 'zoom-video-sdk.json',
        output: 'webhooks',
      }),
      description: 'webhook schemas',
    },
    {
      config: createConfig({
        input: 'string-with-format.yaml',
        output: 'string-with-format',
      }),
      description: 'anyOf string and binary string',
    },
    {
      config: createConfig({
        input: 'discriminator-all-of.yaml',
        output: 'discriminator-all-of',
      }),
      description: 'generates discriminated union for oneOf with discriminator mapping',
    },
    {
      config: createConfig({
        input: 'discriminator-any-of.yaml',
        output: 'discriminator-any-of',
      }),
      description: 'generates discriminated union for anyOf with discriminator mapping',
    },
    {
      config: createConfig({
        input: 'discriminator-one-of.yaml',
        output: 'discriminator-one-of',
      }),
      description: 'generates discriminated union for oneOf discriminator mapping',
    },
    {
      config: createConfig({
        input: 'discriminator-one-of-pydantic-default.yaml',
        output: 'discriminator-one-of-pydantic-default',
      }),
      description:
        'extends discriminated union members when discriminator has const+default (Pydantic/FastAPI)',
    },
    {
      config: createConfig({
        input: 'time-format.yaml',
        output: 'time-format',
      }),
      description: 'generates correct valibot schema for time format',
    },
    {
      config: createConfig({
        input: 'type-format.yaml',
        output: 'type-format',
        plugins: [
          'valibot',
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
