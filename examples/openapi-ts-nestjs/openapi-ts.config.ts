import { defineConfig, type UserConfig } from '@hey-api/openapi-ts';

const config: Promise<UserConfig> = defineConfig({
  input: './openapi.json',
  logs: {
    path: './logs',
  },
  output: {
    path: './src/client',
    postProcess: ['oxfmt', 'oxlint'],
  },
  plugins: ['nestjs', '@hey-api/sdk'],
});

export default config;
