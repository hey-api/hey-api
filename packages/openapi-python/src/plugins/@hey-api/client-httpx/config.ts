import { definePluginConfig } from '@hey-api/shared';

import { clientDefaultConfig, clientDefaultMeta } from '../client-core/config';
import type { HeyApiClientHttpxPlugin } from './types';

export const defaultConfig: HeyApiClientHttpxPlugin['Config'] = {
  ...clientDefaultMeta,
  config: {
    ...clientDefaultConfig,
    asyncMode: false,
  },
  handler() {
    // TODO: handler
  },
  name: '@hey-api/client-httpx',
  symbolMeta() {
    return {
      artifact: 'client',
    };
  },
};

/**
 * Type helper for `@hey-api/client-httpx` plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
