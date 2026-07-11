import { coerce, definePluginConfig } from '@hey-api/shared';

import { mswImports } from './imports';
import { handler } from './plugin';
import type { MswPlugin } from './types';

export const defaultConfig: MswPlugin['Config'] = {
  config: {
    $dependencies: ['source'],
    baseUrl: '*',
    comments: true,
    commentsStyle: 'default',
    includeInEntry: false,
    responseFallback: 'error',
    source: coerce((value) => {
      if (!value) {
        return ['@hey-api/examples'];
      }
      if (value instanceof Array) {
        return value;
      }
      return [value];
    }),
  },
  dependencies: ['@hey-api/typescript'],
  handler,
  imports: mswImports,
  name: 'msw',
  symbolMeta() {
    return {
      artifact: 'msw',
    };
  },
  tags: ['handler'],
};

/**
 * Type helper for MSW plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
