import { definePluginConfig } from '@hey-api/shared';

import { handler } from '../../@tanstack/query-core/plugin';
import { tanStackQueryImports } from '../query-core/imports';
import type { TanStackReactQueryPlugin } from './types';

const defaultMeta = (): Record<string, unknown> => ({});

export const defaultConfig: TanStackReactQueryPlugin['Config'] = {
  config: {
    $cascade: ['case'],
    $finalize(config) {
      if (config.useMutation.enabled && !config.mutationOptions.enabled) {
        config.mutationOptions.enabled = true;
        config.mutationOptions.exported = false;
      }

      if (config.useQuery.enabled && !config.queryOptions.enabled) {
        config.queryOptions.enabled = true;
        config.queryOptions.exported = false;
      }
    },
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
    useGetQueryData: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: false,
      name: 'use{{name}}GetQueryData',
    },
    useMutation: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: false,
      name: 'use{{name}}Mutation',
    },
    useQuery: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: false,
      name: 'use{{name}}Query',
    },
    useSetQueryData: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: false,
      name: 'use{{name}}SetQueryData',
    },
  },
  dependencies: ['@hey-api/sdk', '@hey-api/typescript'],
  handler,
  imports: tanStackQueryImports,
  name: '@tanstack/react-query',
  symbolMeta() {
    return {
      artifact: '@tanstack/react-query',
    };
  },
};

/**
 * Type helper for `@tanstack/react-query` plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
