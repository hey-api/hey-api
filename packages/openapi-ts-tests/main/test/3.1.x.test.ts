import fs from 'node:fs';
import path from 'node:path';

import { createClient, type UserConfig } from '@hey-api/openapi-ts';

import { getFilePaths, getSpecsPath } from '../../utils';

const version = '3.1.x';

const outputDir = path.join(import.meta.dirname, 'generated', version);

describe(`OpenAPI ${version}`, () => {
  const createConfig = (userConfig: UserConfig) => {
    const input = userConfig.input instanceof Array ? userConfig.input[0] : userConfig.input;
    const inputPath = path.join(
      getSpecsPath(),
      version,
      typeof input === 'string' ? input : ((input?.path as string) ?? ''),
    );
    const output = userConfig.output instanceof Array ? userConfig.output[0] : userConfig.output;
    const outputPath = path.join(
      outputDir,
      typeof output === 'string' ? output : ((output?.path as string) ?? ''),
    );
    const nameConflictResolver =
      typeof output === 'string' ? undefined : output?.nameConflictResolver;
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
      output: {
        nameConflictResolver,
        path: outputPath,
      },
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
        input: 'pattern-properties.json',
        output: 'pattern-properties',
      }),
      description: 'handles pattern properties',
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
      description: 'allows arbitrary properties on objects (unknown top type)',
    },
    {
      config: createConfig({
        input: 'additional-properties-true.json',
        output: 'additional-properties-true-any',
        plugins: [
          {
            name: '@hey-api/typescript',
            topType: 'any',
          },
        ],
      }),
      description: 'allows arbitrary properties on objects (any top type)',
    },
    {
      config: createConfig({
        input: 'additional-properties-undefined.json',
        output: 'additional-properties-undefined',
      }),
      description: 'allows arbitrary properties on objects',
    },
    {
      config: createConfig({
        input: 'array-items-one-of-length-1.yaml',
        output: 'array-items-one-of-length-1',
      }),
      description: 'generates correct array when items are oneOf array with single item',
    },
    {
      config: createConfig({
        input: 'array-nested-one-of.yaml',
        output: 'array-nested-one-of',
      }),
      description: 'generates union of arrays when items use nested oneOf',
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
        input: 'case.yaml',
        output: 'case-preserve',
        plugins: [
          {
            case: 'preserve',
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles preserved identifier casing',
    },
    {
      config: createConfig({
        input: 'case.yaml',
        output: 'case-PascalCase',
        plugins: [
          {
            case: 'PascalCase',
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles PascalCase identifier casing',
    },
    {
      config: createConfig({
        input: 'case.yaml',
        output: 'case-camelCase',
        plugins: [
          {
            case: 'camelCase',
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles camelCase identifier casing',
    },
    {
      config: createConfig({
        input: 'case.yaml',
        output: 'case-snake_case',
        plugins: [
          {
            case: 'snake_case',
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles snake_case identifier casing',
    },
    {
      config: createConfig({
        input: 'components-request-bodies.json',
        output: 'components-request-bodies',
      }),
      description: 'handles reusable request bodies',
    },
    {
      config: createConfig({
        input: 'const.json',
        output: 'const',
      }),
      description: 'handles const keyword',
    },
    {
      config: createConfig({
        input: 'content-binary.json',
        output: 'content-binary',
      }),
      description: 'handles binary content',
    },
    {
      config: createConfig({
        input: 'content-media-type.yaml',
        output: 'content-media-type',
      }),
      description: 'handles contentMediaType schema property for file uploads',
    },
    {
      config: createConfig({
        input: 'content-types.yaml',
        output: 'content-types',
        plugins: ['@hey-api/client-axios', '@hey-api/typescript', '@hey-api/sdk'],
      }),
      description: 'handles content types',
    },
    {
      config: createConfig({
        input: 'discriminator-all-of.yaml',
        output: 'discriminator-all-of',
      }),
      description: 'handles discriminator with and without mapping',
    },
    {
      config: createConfig({
        input: 'discriminator-any-of.yaml',
        output: 'discriminator-any-of',
      }),
      description: 'handles discriminator with and without mapping',
    },
    {
      config: createConfig({
        input: 'discriminator-mapped-many.yaml',
        output: 'discriminator-mapped-many',
      }),
      description: 'handles discriminator with multiple mappings',
    },
    {
      config: createConfig({
        input: 'discriminator-one-of.yaml',
        output: 'discriminator-one-of',
      }),
      description: 'handles discriminator with and without mapping',
    },
    {
      config: createConfig({
        input: 'discriminator-allof-nested.json',
        output: 'discriminator-allof-nested',
      }),
      description: 'handles nested allOf with discriminators',
    },
    {
      config: createConfig({
        input: 'discriminator-allof-inline.json',
        output: 'discriminator-allof-inline',
      }),
      description:
        'handles allOf where inline schema discriminator mapping should take priority over $ref discriminator fallback',
    },
    {
      config: createConfig({
        input: 'discriminator-object-self-mapped.json',
        output: 'discriminator-object-self-mapped',
      }),
      description: 'handles object discriminator mappings that include the schema itself',
    },
    {
      config: createConfig({
        input: 'discriminator-non-string.yaml',
        output: 'discriminator-non-string',
      }),
      description: 'handles non-string discriminator property types',
    },
    {
      config: createConfig({
        input: 'discriminator-one-of-read-write.yaml',
        output: 'discriminator-one-of-read-write',
      }),
      description: 'handles discriminator with oneOf and read/write transforms',
    },
    {
      config: createConfig({
        input: 'duplicate-null.json',
        output: 'duplicate-null',
      }),
      description: 'does not generate duplicate null',
    },
    {
      config: createConfig({
        input: 'enum-escape.json',
        output: 'enum-escape',
      }),
      description: 'escapes enum values',
    },
    {
      config: createConfig({
        input: 'enum-inline.yaml',
        output: 'enum-inline',
        parser: {
          transforms: {
            enums: 'root',
          },
        },
      }),
      description: 'exports inline enums',
    },
    {
      config: createConfig({
        input: 'enum-inline.yaml',
        output: 'enum-inline-javascript',
        parser: {
          transforms: {
            enums: 'root',
          },
        },
        plugins: [
          {
            enums: 'javascript',
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'exports inline enums (JavaScript)',
    },
    {
      config: createConfig({
        input: 'enum-inline.yaml',
        output: 'enum-inline-typescript',
        parser: {
          transforms: {
            enums: 'root',
          },
        },
        plugins: [
          {
            enums: 'typescript',
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'exports inline enums (TypeScript)',
    },
    {
      config: createConfig({
        input: 'enum-inline.yaml',
        output: {
          nameConflictResolver: ({ attempt, baseName }) =>
            attempt === 0 ? baseName : `${baseName}_N${attempt + 1}`,
          path: 'enum-inline-name-resolver',
        },
        parser: {
          transforms: {
            enums: 'root',
          },
        },
        plugins: [
          {
            enums: 'javascript',
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'exports inline enums with name conflict resolver',
    },
    {
      config: createConfig({
        input: 'enum-inline.yaml',
        output: {
          nameConflictResolver: () => null,
          path: 'enum-inline-name-resolver-null',
        },
        parser: {
          transforms: {
            enums: 'root',
          },
        },
        plugins: [
          {
            enums: 'javascript',
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'exports inline enums with name conflict resolver returning null',
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
        output: 'enum-names-values-javascript-ignore-null',
        plugins: [
          {
            enums: {
              case: 'preserve',
              constantsIgnoreNull: true,
              mode: 'javascript',
            },
            name: '@hey-api/typescript',
          },
        ],
      }),
      description: 'handles various enum names and values (JavaScript, preserve, ignore null)',
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
        input: 'union-types.json',
        output: 'union-types',
      }),
      description: 'handles union of primitive types',
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
        input: 'headers.yaml',
        output: 'headers',
        plugins: ['@hey-api/client-fetch', '@hey-api/typescript', '@hey-api/sdk'],
      }),
      description: 'handles various headers',
    },
    {
      config: createConfig({
        input: 'negative-property-names.json',
        output: 'negative-property-names',
      }),
      description: 'handles negative property names correctly',
    },
    {
      config: createConfig({
        input: 'object-properties-all-of.json',
        output: 'object-properties-all-of',
      }),
      description:
        'sets correct logical operator and brackets on object with properties and allOf composition',
    },
    {
      config: createConfig({
        input: 'object-properties-any-of.json',
        output: 'object-properties-any-of',
      }),
      description:
        'sets correct logical operator and brackets on object with properties and anyOf composition',
    },
    {
      config: createConfig({
        input: 'object-properties-one-of.json',
        output: 'object-properties-one-of',
      }),
      description:
        'sets correct logical operator and brackets on object with properties and oneOf composition',
    },
    {
      config: createConfig({
        input: 'object-property-names.yaml',
        output: 'object-property-names',
      }),
      description: 'sets correct index signature type on object with property names',
    },
    {
      config: createConfig({
        input: 'operation-204.json',
        output: 'operation-204',
      }),
      description: 'handles empty response status codes',
    },
    {
      config: createConfig({
        input: 'parameter-explode-false.json',
        output: 'parameter-explode-false',
        plugins: ['@hey-api/client-fetch', '@hey-api/sdk'],
      }),
      description: 'handles non-exploded array query parameters',
    },
    {
      config: createConfig({
        input: 'parameter-explode-false.json',
        output: 'parameter-explode-false-axios',
        plugins: ['@hey-api/client-axios', '@hey-api/sdk'],
      }),
      description: 'handles non-exploded array query parameters (Axios)',
    },
    {
      config: createConfig({
        input: 'parameter-tuple.json',
        output: 'parameter-tuple',
      }),
      description: 'handles tuple query parameters',
    },
    {
      config: createConfig({
        input: 'ref-deep.yaml',
        output: 'ref-deep',
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
      }),
      description: 'handles schema name transforms',
    },
    {
      config: createConfig({
        input: 'transforms-read-write-nested.yaml',
        output: 'transforms-read-write-nested',
      }),
      description: 'handles write-only types in nested schemas',
    },
    {
      config: createConfig({
        input: 'transforms-read-write-response.yaml',
        output: 'transforms-read-write-response',
      }),
      description: 'handles read-only types in nested response schemas',
    },
    {
      config: createConfig({
        input: 'transforms-read-write-unevaluated.yaml',
        output: 'transforms-read-write-unevaluated',
      }),
      description: 'preserves unevaluatedProperties in schemas with readOnly fields',
    },
    {
      config: createConfig({
        input: 'ref-type.json',
        output: 'ref-type',
      }),
      description: 'handles extended $ref with type keyword',
    },
    {
      config: createConfig({
        input: 'required-all-of-ref.json',
        output: 'required-all-of-ref',
      }),
      description: 'sets allOf composition ref model properties as required',
    },
    {
      config: createConfig({
        input: 'required-any-of-ref.json',
        output: 'required-any-of-ref',
      }),
      description: 'does not set anyOf composition ref model properties as required',
    },
    {
      config: createConfig({
        input: 'required-one-of-ref.json',
        output: 'required-one-of-ref',
      }),
      description: 'does not set oneOf composition ref model properties as required',
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
        input: 'security-http-bearer.json',
        output: 'security-http-bearer',
        plugins: [
          '@hey-api/client-fetch',
          {
            auth: true,
            name: '@hey-api/sdk',
          },
        ],
      }),
      description: 'generates SDK functions with auth (Bearer token)',
    },
    {
      config: createConfig({
        input: 'security-http-bearer-duplicate.json',
        output: 'security-http-bearer-duplicate',
        plugins: [
          '@hey-api/client-fetch',
          {
            auth: true,
            name: '@hey-api/sdk',
          },
        ],
      }),
      description: 'exposes securitySchemes key on Auth when http schemes collide',
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
        input: 'security-open-id-connect.yaml',
        output: 'security-open-id-connect',
        plugins: [
          '@hey-api/client-fetch',
          {
            auth: true,
            name: '@hey-api/sdk',
          },
        ],
      }),
      description: 'generates SDK functions with auth (OpenID Connect)',
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
        input: 'transformers-all-of.yaml',
        output: 'transformers-all-of',
        plugins: ['@hey-api/client-fetch', '@hey-api/transformers'],
      }),
      description: 'transforms nested date in all of composition',
    },
    {
      config: createConfig({
        input: 'transformers-allof-response-wrapper.json',
        output: 'transformers-allof-response-wrapper',
        plugins: ['@hey-api/client-fetch', '@hey-api/transformers'],
      }),
      description: 'transforms dates in allOf response wrapper (paginated response)',
    },
    {
      config: createConfig({
        input: 'transformers-any-of-null.json',
        output: 'transformers-any-of-null',
        plugins: ['@hey-api/client-fetch', '@hey-api/transformers'],
      }),
      description: 'transforms nullable date property',
    },
    {
      config: createConfig({
        input: 'transformers-array.json',
        output: 'transformers-array',
        plugins: ['@hey-api/client-fetch', '@hey-api/transformers'],
      }),
      description: 'transforms an array',
    },
    {
      config: createConfig({
        input: 'transformers-additional-properties.yaml',
        output: 'transformers-additional-properties',
        plugins: ['@hey-api/client-fetch', '@hey-api/transformers'],
      }),
      description: 'transforms additionalProperties map values',
    },
    {
      config: createConfig({
        input: 'transformers-recursive.json',
        output: 'transformers-recursive',
        plugins: ['@hey-api/client-fetch', '@hey-api/transformers'],
      }),
      description: 'transforms recursive/self-referential schemas',
    },
    {
      config: createConfig({
        input: 'transformers-one-of-discriminated.yaml',
        output: 'transformers-one-of-discriminated',
        plugins: ['@hey-api/client-fetch', '@hey-api/transformers'],
      }),
      description: 'transforms discriminated oneOf without warning',
    },
    {
      config: createConfig({
        input: 'transformers-temporal.json',
        output: 'transformers-temporal-polyfill',
        plugins: [
          '@hey-api/client-fetch',
          {
            dates: 'temporal',
            name: '@hey-api/transformers',
          },
        ],
      }),
      description: 'transforms dates using the Temporal API with polyfill',
    },
    {
      config: createConfig({
        input: 'transformers-temporal.json',
        output: 'transformers-temporal-global',
        plugins: [
          '@hey-api/client-fetch',
          {
            dates: { polyfill: false, type: 'temporal' },
            name: '@hey-api/transformers',
          },
        ],
      }),
      description: 'transforms dates using the Temporal API without polyfill',
    },
    {
      config: createConfig({
        input: 'type-invalid.json',
        output: 'type-invalid',
      }),
      description: 'gracefully handles invalid type',
    },
    {
      config: createConfig({
        input: 'opencode.yaml',
        output: 'sse-angular',
        parser: {
          filters: {
            operations: {
              include: ['GET /event'],
            },
          },
        },
        plugins: ['@hey-api/client-angular', '@hey-api/sdk'],
      }),
      description: 'client with SSE (Angular)',
    },
    {
      config: createConfig({
        input: 'opencode.yaml',
        output: 'sse-axios',
        parser: {
          filters: {
            operations: {
              include: ['GET /event'],
            },
          },
        },
        plugins: ['@hey-api/client-axios', '@hey-api/sdk'],
      }),
      description: 'client with SSE (Axios)',
    },
    {
      config: createConfig({
        input: 'opencode.yaml',
        output: 'sse-fetch',
        parser: {
          filters: {
            operations: {
              include: ['GET /event'],
            },
          },
        },
        plugins: ['@hey-api/client-fetch', '@hey-api/sdk'],
      }),
      description: 'client with SSE (Fetch)',
    },
    {
      config: createConfig({
        input: 'opencode.yaml',
        output: 'sse-ofetch',
        parser: {
          filters: {
            operations: {
              include: ['GET /event'],
            },
          },
        },
        plugins: ['@hey-api/client-ofetch', '@hey-api/sdk'],
      }),
      description: 'client with SSE (ofetch)',
    },
    {
      config: createConfig({
        input: 'opencode.yaml',
        output: 'sse-next',
        parser: {
          filters: {
            operations: {
              include: ['GET /event'],
            },
          },
        },
        plugins: ['@hey-api/client-next', '@hey-api/sdk'],
      }),
      description: 'client with SSE (Next.js)',
    },
    {
      config: createConfig({
        input: 'opencode.yaml',
        output: 'sse-nuxt',
        parser: {
          filters: {
            operations: {
              include: ['GET /event'],
            },
          },
        },
        plugins: ['@hey-api/client-nuxt', '@hey-api/sdk'],
      }),
      description: 'client with SSE (Nuxt)',
    },
    {
      config: createConfig({
        input: 'zoom-video-sdk.json',
        output: 'webhooks',
      }),
      description: 'webhook types',
    },
    {
      config: createConfig({
        input: 'string-with-format.yaml',
        output: 'string-with-format',
      }),
      description: 'anyOf string and binary string',
    },
  ];

  it.each(scenarios)('$description', async ({ config }) => {
    await createClient(config);

    const filePaths = getFilePaths(config.output.path);

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
