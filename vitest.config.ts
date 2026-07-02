import { platform } from 'node:os';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['bin', 'dist', 'src/**/*.d.ts'],
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      provider: 'v8',
    },
    globals: true,
    projects: [
      'examples/*/vitest.config.ts',
      {
        extends: true,
        test: {
          name: '@hey-api/codegen-cli',
          root: 'packages/codegen-cli',
        },
      },
      {
        extends: true,
        test: {
          name: '@hey-api/codegen-core',
          root: 'packages/codegen-core',
        },
      },
      {
        extends: true,
        test: {
          name: '@hey-api/vite-plugin',
          root: 'packages/vite-plugin',
        },
      },
      {
        extends: true,
        test: {
          globalSetup: ['./src/py-compiler/__tests__/global-teardown.ts'],
          name: '@hey-api/openapi-python',
          root: 'packages/openapi-python',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          globalSetup: ['./src/ts-compiler/__tests__/global-teardown.ts'],
          name: '@hey-api/openapi-ts',
          root: 'packages/openapi-ts',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: '@hey-api/shared',
          root: 'packages/shared',
        },
      },
      {
        extends: true,
        test: {
          name: '@hey-api/json-schema-ref-parser',
          root: 'packages/json-schema-ref-parser',
        },
      },
      {
        extends: true,
        test: {
          name: '@test/openapi-ts',
          root: 'packages/openapi-ts-tests/main',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          globalSetup: ['./test/global-teardown.ts'],
          name: '@test/openapi-ts-faker-v10',
          root: 'packages/openapi-ts-tests/faker/v10',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          globalSetup: ['./test/global-teardown.ts'],
          name: '@test/openapi-ts-msw-v2',
          root: 'packages/openapi-ts-tests/msw/v2',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: '@test/openapi-ts-nestjs-v11',
          root: 'packages/openapi-ts-tests/nestjs/v11',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          globalSetup: ['./test/global-teardown.ts'],
          name: '@test/openapi-ts-orpc-v1',
          root: 'packages/openapi-ts-tests/orpc/v1',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          globalSetup: ['./test/global-teardown.ts'],
          name: '@test/openapi-ts-orpc-v2',
          root: 'packages/openapi-ts-tests/orpc/v2',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: '@test/openapi-ts-sdks',
          root: 'packages/openapi-ts-tests/sdks',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          globalSetup: ['./test/global-teardown.ts'],
          name: '@test/openapi-ts-tanstack-query-v5',
          root: 'packages/openapi-ts-tests/tanstack-query/v5',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          globalSetup: ['./test/global-teardown.ts'],
          name: '@test/openapi-ts-valibot-v1',
          root: 'packages/openapi-ts-tests/valibot/v1',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          globalSetup: ['./test/global-teardown.ts'],
          name: '@test/openapi-ts-zod-v3',
          root: 'packages/openapi-ts-tests/zod/v3',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          globalSetup: ['./test/global-teardown.ts'],
          name: '@test/openapi-ts-zod-v4',
          root: 'packages/openapi-ts-tests/zod/v4',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: '@test/openapi-python-sdks',
          root: 'packages/openapi-python-tests/sdks',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          globalSetup: ['./test/global-teardown.ts'],
          name: '@test/openapi-python-pydantic-v2',
          root: 'packages/openapi-python-tests/pydantic/v2',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: '@hey-api/custom-client',
          root: 'packages/custom-client',
        },
      },
    ],
    testTimeout: platform() === 'win32' ? 10000 : 5000,
  },
});
