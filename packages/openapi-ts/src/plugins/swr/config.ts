import { definePluginConfig } from '@hey-api/shared';

import { swrImports } from './imports';
import { handler } from './plugin';
import type { SwrPlugin } from './types';

const defaultMeta = (): Record<string, unknown> => ({});

export const defaultConfig: SwrPlugin['Config'] = {
  config: {
    $cascade: ['case'],
    $finalize(config) {
      if (config.useSwr.enabled && !config.queryOptions.enabled) {
        config.queryOptions.enabled = true;
        config.queryOptions.exported = false;
      }
    },
    case: 'camelCase',
    comments: true,
    commentsStyle: 'default',
    includeInEntry: false,
    infiniteQueryKeys: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: '{{name}}InfiniteQueryKey',
      tags: false,
    },
    infiniteQueryOptions: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      meta: defaultMeta,
      name: '{{name}}InfiniteOptions',
    },
    mutationOptions: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      meta: defaultMeta,
      name: '{{name}}Mutation',
    },
    queryKeys: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: '{{name}}QueryKey',
      tags: false,
    },
    queryOptions: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      exported: true,
      meta: defaultMeta,
      name: '{{name}}Options',
    },
    useSwr: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: 'use{{name}}',
    },
  },
  dependencies: ['@hey-api/sdk', '@hey-api/typescript'],
  handler,
  imports: swrImports,
  name: 'swr',
  symbolMeta() {
    return {
      artifact: 'swr',
    };
  },
};

/**
 * Type helper for `swr` plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
