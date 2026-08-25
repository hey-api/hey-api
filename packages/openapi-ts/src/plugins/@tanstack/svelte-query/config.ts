import { definePluginConfig } from '@hey-api/shared';

import { handler } from '../../@tanstack/query-core/plugin';
import { tanStackQueryImports } from '../query-core/imports';
import type { TanStackSvelteQueryPlugin } from './types';

const defaultMeta = (): Record<string, unknown> => ({});

export const defaultConfig: TanStackSvelteQueryPlugin['Config'] = {
  config: {
    $cascade: ['case'],
    case: 'camelCase',
    comments: true,
    getQueryData: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: false,
      name: '{{name}}GetQueryData',
    },
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
    mutationKeys: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: false,
      name: '{{name}}MutationKey',
      tags: false,
    },
    mutationOptions: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      exported: true,
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
    responseStyle: 'data',
    setQueryData: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: false,
      name: '{{name}}SetQueryData',
    },
  },
  dependencies: ['@hey-api/sdk', '@hey-api/typescript'],
  handler,
  imports: tanStackQueryImports,
  name: '@tanstack/svelte-query',
  symbolMeta() {
    return {
      artifact: '@tanstack/svelte-query',
    };
  },
};

/**
 * Type helper for `@tanstack/svelte-query` plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
