import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-ts';

import { getFilePaths } from '../../../utils';
import { snapshotsDir, tmpDir } from './constants';
import { createConfigFactory, zodVersions } from './utils';

const version = '3.1.x';

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
          input: 'defaults-with-ref-and-anyof.json',
          output: 'defaults-with-ref-and-anyof',
        }),
        description: 'preserves defaults with $ref and anyOf',
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
          output: 'validators-dates',
          plugins: [
            {
              compatibilityVersion: zodVersion.compatibilityVersion,
              dates: {
                offset: true,
              },
              name: 'zod',
            },
          ],
        }),
        description: 'generates validator schemas with any offset',
      },
      {
        config: createConfig({
          input: 'validators.yaml',
          output: 'validators-metadata',
          plugins: [
            {
              compatibilityVersion: zodVersion.compatibilityVersion,
              metadata: true,
              name: 'zod',
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
              compatibilityVersion: zodVersion.compatibilityVersion,
              metadata: ({ $, node, schema }) => {
                node
                  .prop('custom', $.literal('value'))
                  .prop('title', $.literal(schema.description ?? schema.type ?? ''));
              },
              name: 'zod',
            },
          ],
        }),
        description: 'generates validator schemas with metadata function',
      },
      {
        config: createConfig({
          input: 'validators.yaml',
          output: 'validators-types',
          plugins: [
            {
              compatibilityVersion: zodVersion.compatibilityVersion,
              name: 'zod',
              types: {
                infer: true,
                input: true,
                output: true,
              },
            },
          ],
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
          input: 'validators-string-constraints-union.json',
          output: 'validators-string-constraints-union',
        }),
        description: 'validator schemas with string constraints union',
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
        description: 'handles oneOf discriminator (falls back to z.union when needed)',
      },
      {
        config: createConfig({
          input: 'enum-null.json',
          output: 'enum-resolver-permissive',
          plugins: [
            {
              $resolvers: {
                enum(ctx) {
                  const { $, symbols } = ctx;
                  const { z } = symbols;
                  const { enumMembers, literalSchemas } = ctx.nodes.items(ctx);

                  if (!enumMembers.length || enumMembers.length !== literalSchemas.length) {
                    return;
                  }

                  const enumSchema = $(z)
                    .attr('enum')
                    .call($.array(...enumMembers));
                  return $(z)
                    .attr('union')
                    .call($.array(enumSchema, $(z).attr('string').call()));
                },
              },
              compatibilityVersion: zodVersion.compatibilityVersion,
              name: 'zod',
            },
          ],
        }),
        description: 'generates permissive enums with enum resolver',
      },
      {
        config: createConfig({
          input: 'type-format.yaml',
          output: 'transformer',
          plugins: [
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
