import type { PluginInstance } from '@hey-api/shared';

export function TANSTACK_QUERY(plugin: PluginInstance) {
  const mutationsType =
    plugin.name === '@tanstack/angular-query-experimental' ||
    plugin.name === '@tanstack/svelte-query' ||
    plugin.name === '@tanstack/solid-query'
      ? 'MutationOptions'
      : 'UseMutationOptions';
  return {
    DefaultError: plugin.symbol('DefaultError', {
      external: plugin.name,
      kind: 'type',
    }),
    InfiniteData: plugin.symbol('InfiniteData', {
      external: plugin.name,
      kind: 'type',
    }),
    MutationOptions: plugin.symbol(mutationsType, {
      external: plugin.name,
      kind: 'type',
      meta: {
        resource: `${plugin.name}.MutationOptions`,
      },
    }),
    QueryClient: plugin.symbol('QueryClient', {
      external: plugin.name,
      kind: 'type',
    }),
    infiniteQueryOptions: plugin.symbol('infiniteQueryOptions', {
      external: plugin.name,
    }),
    queryOptions: plugin.symbol('queryOptions', {
      external: plugin.name,
    }),
    skipToken: plugin.symbol('skipToken', {
      external: plugin.name,
    }),
    useMutation: plugin.symbol('useMutation', {
      external: plugin.name,
    }),
    useQuery: plugin.symbol('useQuery', {
      external: plugin.name,
    }),
    useQueryClient: plugin.symbol('useQueryClient', {
      external: plugin.name,
    }),
  };
}
