import { definePluginConfig } from '@hey-api/shared';

import { effectImports } from './imports';
import { handler } from './plugin';
import type { EffectPlugin } from './types';

export const defaultConfig: EffectPlugin['Config'] = {
  config: {
    apiName: 'Api',
    comments: true,
    includeInEntry: true,
  },
  dependencies: ['effect-schema'],
  handler,
  imports: effectImports,
  name: '@hey-api/effect',
  symbolMeta() {
    return {
      artifact: 'effect',
    };
  },
};

/**
 * Type helper for the `@hey-api/effect` plugin.
 */
export const defineConfig = definePluginConfig(defaultConfig);
