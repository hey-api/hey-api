import { defineConfig, type UserConfig } from '@hey-api/openapi-ts';

const config: Promise<UserConfig> = defineConfig({
  input:
    'https://raw.githubusercontent.com/swagger-api/swagger-petstore/master/src/main/resources/openapi.yaml',
  logs: {
    path: './logs',
  },
  output: {
    path: './src/client',
    postProcess: ['oxfmt', 'oxlint'],
  },
  plugins: [
    '@hey-api/client-angular',
    '@hey-api/schemas',
    {
      name: '@hey-api/sdk',
      operations: {
        containerName: '{{name}}Service',
        strategy: 'byTags',
      },
    },
    {
      enums: 'javascript',
      name: '@hey-api/typescript',
    },
  ],
});

export default config;
