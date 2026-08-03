import { definePluginConfig } from '@hey-api/shared';

import { clientDefaultConfig, clientDefaultMeta } from '../client-core/config';
import { clientPluginHandler } from '../client-core/plugin';
import type { HeyApiClientEffectPlugin } from './types';

const promiseSdkPlugins = [
  '@pinia/colada',
  '@tanstack/angular-query-experimental',
  '@tanstack/preact-query',
  '@tanstack/react-query',
  '@tanstack/solid-query',
  '@tanstack/svelte-query',
  '@tanstack/vue-query',
  'swr',
] as const;

export const defaultConfig: HeyApiClientEffectPlugin['Config'] = {
  ...clientDefaultMeta,
  config: {
    ...clientDefaultConfig,
  },
  handler(args) {
    const incompatible = promiseSdkPlugins.find((name) => args.plugin.getPlugin(name));
    if (incompatible) {
      throw new Error(
        `@hey-api/client-effect cannot be combined with ${incompatible}: it expects Promise-returning SDK functions`,
      );
    }
    // SAFETY: Every generated client delegates to the same client-core handler; only the plugin-specific config type differs.
    (clientPluginHandler as unknown as HeyApiClientEffectPlugin['Handler'])(args);
  },
  name: '@hey-api/client-effect',
  symbolMeta() {
    return {
      artifact: 'client',
    };
  },
};

/**
 * Type helper for `@hey-api/client-effect` plugin.
 */
export const defineConfig = definePluginConfig(defaultConfig);
