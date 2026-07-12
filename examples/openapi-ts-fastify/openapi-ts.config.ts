import { defineConfig, type UserConfig } from '@hey-api/openapi-ts';

const config: Promise<UserConfig> = defineConfig({
  input:
    'https://gist.githubusercontent.com/seriousme/55bd4c8ba2e598e416bb5543dcd362dc/raw/cf0b86ba37bb54bf1a6bf047c0ecf2a0ce4c62e0/petstore-v3.1.json',
  logs: {
    path: './logs',
  },
  output: {
    path: './src/client',
    postProcess: ['oxfmt', 'oxlint'],
  },
  plugins: ['fastify', '@hey-api/sdk'],
});

export default config;
