import fs from 'node:fs';
import path from 'node:path';

import { createClient, type UserConfig } from '@hey-api/openapi-ts';

import { getFilePaths, getSpecsPath } from '../../utils';

const version = '2.0.x';

const outputDir = path.join(import.meta.dirname, 'generated', version);

describe(`OpenAPI ${version}`, () => {
  const createConfig = (userConfig: UserConfig) => {
    const input = userConfig.input instanceof Array ? userConfig.input[0] : userConfig.input;
    const inputPath = path.join(
      getSpecsPath(),
      version,
      typeof input === 'string' ? input : ((input?.path as string) ?? ''),
    );
    return {
      plugins: ['@hey-api/typescript'],
      ...userConfig,
      input:
        typeof userConfig.input === 'string'
          ? inputPath
          : {
              ...userConfig.input,
              path: inputPath,
            },
      logs: {
        level: 'silent',
      },
      output: path.join(outputDir, typeof userConfig.output === 'string' ? userConfig.output : ''),
    } as const satisfies UserConfig;
  };

  const scenarios = [
    {
      config: createConfig({
        input: 'external.yaml',
        output: 'external',
      }),
      description: 'handles external references',
    },
    {
      config: createConfig({
        input: 'additional-properties-false.json',
        output: 'additional-properties-false',
      }),
      description: 'forbids arbitrary properties on objects',
    },
    {
      config: createConfig({
        input: 'additional-properties-true.json',
        output: 'additional-properties-true',
      }),
      description: 'allows arbitrary properties on objects',
    },
    {
      config: createConfig({
        input: 'body-response-text-plain.yaml',
        output: 'body-response-text-plain',
        plugins: ['@hey-api/client-fetch', '@hey-api/typescript', '@hey-api/sdk'],
      }),
      description: 'handle text/plain content type',
    },
    {
      config: createConfig({
        input: 'enum-names-values.json',
        output: 'enum-names-values',
      }),
      description: 'handles various enum names and values',
    },
    {
      config: createConfig({
        input: 'multiple-media-types.yaml',
        output: 'multiple-media-types',
        plugins: ['@hey-api/client-fetch', '@hey-api/typescript', '@hey-api/sdk'],
      }),
      description: 'handles multiple media types with default selection',
    },
    {
      config: createConfig({
        input: 'multiple-media-types.yaml',
        output: 'multiple-media-types-preferred-text',
        parser: {
          content: {
            preferred: ['text/plain'],
          },
        },
        plugins: ['@hey-api/client-fetch', '@hey-api/typescript', '@hey-api/sdk'],
      }),
      description: 'prefers text/plain via content.preferred shorthand',
    },
    {
      config: createConfig({
        input: 'enum-names-values.json',
        output: 'enum-names-values-javascript-SCREAMING_SNAKE_CASE',
        plugins: [
          {
            enums: {
              case: 'SCREAMING_SNAKE_CASE',
              mode: 'javascript',
            },
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles various enum names and values (JavaScript, SCREAMING_SNAKE_CASE)',
    },
    {
      config: createConfig({
        input: 'enum-names-values.json',
        output: 'enum-names-values-javascript-PascalCase',
        plugins: [
          {
            enums: {
              case: 'PascalCase',
              mode: 'javascript',
            },
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles various enum names and values (JavaScript, PascalCase)',
    },
    {
      config: createConfig({
        input: 'enum-names-values.json',
        output: 'enum-names-values-javascript-camelCase',
        plugins: [
          {
            enums: {
              case: 'camelCase',
              mode: 'javascript',
            },
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles various enum names and values (JavaScript, camelCase)',
    },
    {
      config: createConfig({
        input: 'enum-names-values.json',
        output: 'enum-names-values-javascript-snake_case',
        plugins: [
          {
            enums: {
              case: 'snake_case',
              mode: 'javascript',
            },
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles various enum names and values (JavaScript, snake_case)',
    },
    {
      config: createConfig({
        input: 'enum-names-values.json',
        output: 'enum-names-values-javascript-preserve',
        plugins: [
          {
            enums: {
              case: 'preserve',
              mode: 'javascript',
            },
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles various enum names and values (JavaScript, preserve)',
    },
    {
      config: createConfig({
        input: 'enum-names-values.json',
        output: 'enum-names-values-typescript-SCREAMING_SNAKE_CASE',
        plugins: [
          {
            enums: {
              case: 'SCREAMING_SNAKE_CASE',
              mode: 'typescript',
            },
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles various enum names and values (TypeScript, SCREAMING_SNAKE_CASE)',
    },
    {
      config: createConfig({
        input: 'enum-names-values.json',
        output: 'enum-names-values-typescript-PascalCase',
        plugins: [
          {
            enums: {
              case: 'PascalCase',
              mode: 'typescript',
            },
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles various enum names and values (TypeScript, PascalCase)',
    },
    {
      config: createConfig({
        input: 'enum-names-values.json',
        output: 'enum-names-values-typescript-camelCase',
        plugins: [
          {
            enums: {
              case: 'camelCase',
              mode: 'typescript',
            },
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles various enum names and values (TypeScript, camelCase)',
    },
    {
      config: createConfig({
        input: 'enum-names-values.json',
        output: 'enum-names-values-typescript-snake_case',
        plugins: [
          {
            enums: {
              case: 'snake_case',
              mode: 'typescript',
            },
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles various enum names and values (TypeScript, snake_case)',
    },
    {
      config: createConfig({
        input: 'enum-names-values.json',
        output: 'enum-names-values-typescript-preserve',
        plugins: [
          {
            enums: {
              case: 'preserve',
              mode: 'typescript',
            },
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles various enum names and values (TypeScript, preserve)',
    },
    {
      config: createConfig({
        input: 'enum-names-values.json',
        output: 'enum-names-values-typescript-const',
        plugins: [
          {
            enums: {
              case: 'camelCase',
              mode: 'typescript-const',
            },
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles TypeScript const enum modifier',
    },
    {
      config: createConfig({
        input: 'exclude-deprecated.yaml',
        output: 'exclude-deprecated',
        parser: {
          filters: {
            deprecated: false,
          },
        },
      }),
      description: 'excludes deprecated fields',
    },
    {
      config: createConfig({
        input: 'form-data.json',
        output: 'form-data',
        plugins: ['@hey-api/client-fetch', '@hey-api/sdk'],
      }),
      description: 'handles form data',
    },
    {
      config: createConfig({
        input: 'ref-deep.yaml',
        output: 'ref-deep',
        plugins: ['@hey-api/typescript'],
      }),
      description: 'handles deep references',
    },
    {
      config: createConfig({
        input: 'transforms-read-write.yaml',
        output: 'transforms-read-write',
        plugins: ['@hey-api/client-fetch', '@hey-api/typescript'],
      }),
      description: 'handles read-only and write-only types',
    },
    {
      config: createConfig({
        input: 'transforms-schemas-name.yaml',
        output: 'transforms-schemas-name',
        parser: {
          transforms: {
            schemaName: (name: string) => {
              // Strip version markers: User_v1_0_0_User → User
              let clean = name.replace(/([A-Za-z\d]+)_v\d+_\d+_\d+_([A-Za-z\d]*)/g, (_, p1, p2) =>
                p2.startsWith(p1) ? p2 : p1 + p2,
              );
              // Deduplicate prefixes: Foo_Foo → Foo
              const m = clean.match(/^([A-Za-z\d]+)_\1([A-Za-z\d]*)$/);
              if (m) clean = m[1]! + m[2]!;
              return clean;
            },
          },
        },
        plugins: ['@hey-api/typescript'],
      }),
      description: 'handles schema name transforms',
    },
    {
      config: createConfig({
        input: 'schema-unknown.yaml',
        output: 'schema-unknown',
        plugins: ['@hey-api/client-fetch', '@hey-api/sdk'],
      }),
      description: 'generates correct schemas instead of unknown',
    },
    {
      config: createConfig({
        input: 'security-api-key.yaml',
        output: 'security-api-key',
        plugins: [
          '@hey-api/client-fetch',
          {
            auth: true,
            name: '@hey-api/sdk',
          },
        ],
      }),
      description: 'generates SDK functions with auth (api key)',
    },
    {
      config: createConfig({
        input: 'security-basic.json',
        output: 'security-basic',
        plugins: [
          '@hey-api/client-fetch',
          {
            auth: true,
            name: '@hey-api/sdk',
          },
        ],
      }),
      description: 'generates SDK functions with auth (basic)',
    },
    {
      config: createConfig({
        input: 'security-oauth2.yaml',
        output: 'security-oauth2',
        plugins: [
          '@hey-api/client-fetch',
          {
            auth: true,
            name: '@hey-api/sdk',
          },
        ],
      }),
      description: 'generates SDK functions with auth (oauth2)',
    },
    {
      config: createConfig({
        input: 'security-oauth2.yaml',
        output: 'security-false',
        plugins: [
          '@hey-api/client-fetch',
          {
            auth: false,
            name: '@hey-api/sdk',
          },
        ],
      }),
      description: 'generates SDK functions without auth',
    },
    {
      config: createConfig({
        input: 'servers.yaml',
        output: 'servers',
        plugins: ['@hey-api/client-fetch', '@hey-api/typescript'],
      }),
      description: 'generates baseUrl',
    },
    {
      config: createConfig({
        input: 'servers-base-path.yaml',
        output: 'servers-base-path',
        plugins: ['@hey-api/client-fetch', '@hey-api/typescript'],
      }),
      description: 'generates baseUrl from basePath',
    },
    {
      config: createConfig({
        input: 'servers-host.yaml',
        output: 'servers-host',
        plugins: ['@hey-api/client-fetch', '@hey-api/typescript'],
      }),
      description: 'generates baseUrl from host',
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
            import.meta.dirname,
            '__snapshots__',
            version,
            filePath.slice(outputDir.length + 1),
          ),
        );
      }),
    );
  });
});
