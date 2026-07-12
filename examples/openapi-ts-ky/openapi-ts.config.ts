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
    '@hey-api/client-ky',
    '@hey-api/schemas',
    '@hey-api/sdk',
    {
      enums: 'javascript',
      name: '@hey-api/typescript',
    },
  ],
});

export default config;
