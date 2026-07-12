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
    {
      name: '@hey-api/client-angular',
      throwOnError: true,
    },
    {
      httpRequests: true,
      httpResources: {
        containerName: '{{name}}ServiceResources',
        strategy: 'byTags',
      },
      includeInEntry: true,
      name: '@angular/common',
    },
    '@hey-api/schemas',
    {
      name: '@hey-api/sdk',
      responseStyle: 'data',
    },
    {
      enums: 'javascript',
      name: '@hey-api/typescript',
    },
  ],
});

export default config;
