import type { Casing, FeatureToggle, NameTransformer, NamingOptions } from '@hey-api/shared';
import type { IR } from '@hey-api/shared';
import type { DefinePlugin, Plugin } from '@hey-api/shared';

import type { TanStackQueryImports } from '../query-core/imports';

export type UserConfig = Plugin.Name<'@tanstack/angular-query-experimental'> &
  Plugin.Hooks &
  Plugin.UserComments &
  Plugin.UserExports & {
    /**
     * Casing convention for generated names.
     *
     * @default 'camelCase'
     */
    case?: Casing;
    /**
     * Configuration for generated `getQueryData` helpers.
     *
     * When enabled, generates a helper per query operation that wraps
     * `queryClient.getQueryData()` with the correct query key and response
     * type already wired up.
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default false
     */
    getQueryData?:
      | boolean
      | NameTransformer
      | {
          /**
           * Casing convention for generated names.
           *
           * @default 'camelCase'
           */
          case?: Casing;
          /**
           * Whether this feature is enabled.
           *
           * @default true
           */
          enabled?: boolean;
          /**
           * Naming pattern for generated names.
           *
           * @default '{{name}}GetQueryData'
           */
          name?: NameTransformer;
        };
    /**
     * Configuration for generated infinite query key helpers.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/angular/reference/infiniteQueryOptions}
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default true
     */
    infiniteQueryKeys?:
      | boolean
      | NameTransformer
      | {
          /**
           * Casing convention for generated names.
           *
           * @default 'camelCase'
           */
          case?: Casing;
          /**
           * Whether this feature is enabled.
           *
           * @default true
           */
          enabled?: boolean;
          /**
           * Naming pattern for generated names.
           *
           * @default '{{name}}InfiniteQueryKey'
           * @see https://tanstack.com/query/v5/docs/framework/angular/reference/infiniteQueryOptions
           */
          name?: NameTransformer;
          /**
           * Whether to include operation tags in infinite query keys.
           * This will make query keys larger but provides better cache invalidation capabilities.
           *
           * @default false
           */
          tags?: boolean;
        };
    /**
     * Configuration for generated infinite query options helpers.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/angular/reference/infiniteQueryOptions}
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default true
     */
    infiniteQueryOptions?:
      | boolean
      | NameTransformer
      | {
          /**
           * Casing convention for generated names.
           *
           * @default 'camelCase'
           */
          case?: Casing;
          /**
           * Whether this feature is enabled.
           *
           * @default true
           */
          enabled?: boolean;
          /**
           * Custom function to generate metadata for the operation.
           * Can return any valid meta object that will be included in the generated infinite query options.
           * @param operation - The operation object containing all available metadata
           * @returns A meta object with any properties you want to include
           *
           * @example
           * ```ts
           * meta: (operation) => ({
           *   customField: operation.id,
           *   isDeprecated: operation.deprecated,
           *   tags: operation.tags,
           *   customObject: {
           *     method: operation.method,
           *     path: operation.path
           *   }
           * })
           * ```
           *
           * @default undefined
           */
          meta?: (operation: IR.OperationObject) => Record<string, unknown>;
          /**
           * Naming pattern for generated names.
           *
           * @default '{{name}}InfiniteOptions'
           * @see https://tanstack.com/query/v5/docs/framework/angular/reference/infiniteQueryOptions
           */
          name?: NameTransformer;
        };
    /**
     * Configuration for generated mutation keys.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectMutation injectMutation}
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default false
     */
    mutationKeys?:
      | boolean
      | NameTransformer
      | {
          /**
           * Casing convention for generated names.
           *
           * @default 'camelCase'
           */
          case?: Casing;
          /**
           * Whether this feature is enabled.
           *
           * @default true
           */
          enabled?: boolean;
          /**
           * Naming pattern for generated names.
           *
           * @default '{{name}}MutationKey'
           */
          name?: NameTransformer;
          /**
           * Whether to include operation tags in mutation keys.
           * This will make mutation keys larger but provides better cache invalidation capabilities.
           *
           * @default false
           */
          tags?: boolean;
        };
    /**
     * Configuration for generated mutation options helpers.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectMutation injectMutation}
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default true
     */
    mutationOptions?:
      | boolean
      | NameTransformer
      | {
          /**
           * Casing convention for generated names.
           *
           * @default 'camelCase'
           */
          case?: Casing;
          /**
           * Whether this feature is enabled.
           *
           * @default true
           */
          enabled?: boolean;
          /**
           * Whether to export generated symbols.
           *
           * @default true
           */
          exported?: boolean;
          /**
           * Custom function to generate metadata for the operation.
           * Can return any valid meta object that will be included in the generated mutation options.
           * @param operation - The operation object containing all available metadata
           * @returns A meta object with any properties you want to include
           *
           * @example
           * ```ts
           * meta: (operation) => ({
           *   customField: operation.id,
           *   isDeprecated: operation.deprecated,
           *   tags: operation.tags,
           *   customObject: {
           *     method: operation.method,
           *     path: operation.path
           *   }
           * })
           * ```
           *
           * @default undefined
           */
          meta?: (operation: IR.OperationObject) => Record<string, unknown>;
          /**
           * Naming pattern for generated names.
           *
           * @default '{{name}}Mutation'
           * @see https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectMutation
           */
          name?: NameTransformer;
        };
    /**
     * Configuration for generated query keys.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/angular/reference/queryKey}
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default true
     */
    queryKeys?:
      | boolean
      | NameTransformer
      | {
          /**
           * Casing convention for generated names.
           *
           * @default 'camelCase'
           */
          case?: Casing;
          /**
           * Whether this feature is enabled.
           *
           * @default true
           */
          enabled?: boolean;
          /**
           * Naming pattern for generated names.
           *
           * @default '{{name}}QueryKey'
           * @see https://tanstack.com/query/v5/docs/framework/angular/reference/queryKey
           */
          name?: NameTransformer;
          /**
           * Whether to include operation tags in query keys.
           * This will make query keys larger but provides better cache invalidation capabilities.
           *
           * @default false
           */
          tags?: boolean;
        };
    /**
     * Configuration for generated query options helpers.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/angular/reference/queryOptions}
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default true
     */
    queryOptions?:
      | boolean
      | NameTransformer
      | {
          /**
           * Casing convention for generated names.
           *
           * @default 'camelCase'
           */
          case?: Casing;
          /**
           * Whether this feature is enabled.
           *
           * @default true
           */
          enabled?: boolean;
          /**
           * Whether to export generated symbols.
           *
           * @default true
           */
          exported?: boolean;
          /**
           * Custom function to generate metadata for the operation.
           * Can return any valid meta object that will be included in the generated query options.
           * @param operation - The operation object containing all available metadata
           * @returns A meta object with any properties you want to include
           *
           * @example
           * ```ts
           * meta: (operation) => ({
           *   customField: operation.id,
           *   isDeprecated: operation.deprecated,
           *   tags: operation.tags,
           *   customObject: {
           *     method: operation.method,
           *     path: operation.path
           *   }
           * })
           * ```
           *
           * @default undefined
           */
          meta?: (operation: IR.OperationObject) => Record<string, unknown>;
          /**
           * Naming pattern for generated names.
           *
           * @default '{{name}}Options'
           * @see https://tanstack.com/query/v5/docs/framework/angular/reference/queryOptions
           */
          name?: NameTransformer;
        };
    /**
     * Shape of the value returned from generated `queryFn`/`mutationFn`.
     *
     * - `'data'` (default) — returns parsed body only, throws raw error.
     * - `'fields'` — returns `{ data, request, response }` on success and throws
     *   `{ error, request, response }` on failure, giving access to HTTP status,
     *   headers, and request metadata.
     *
     * @default 'data'
     */
    responseStyle?: 'data' | 'fields';
    /**
     * Configuration for generated `setQueryData` helpers.
     *
     * When enabled, generates a helper per query operation that wraps
     * `queryClient.setQueryData()` with the correct query key and response
     * type already wired up.
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default false
     */
    setQueryData?:
      | boolean
      | NameTransformer
      | {
          /**
           * Casing convention for generated names.
           *
           * @default 'camelCase'
           */
          case?: Casing;
          /**
           * Whether this feature is enabled.
           *
           * @default true
           */
          enabled?: boolean;
          /**
           * Naming pattern for generated names.
           *
           * @default '{{name}}SetQueryData'
           */
          name?: NameTransformer;
        };
  };

export type Config = Plugin.Name<'@tanstack/angular-query-experimental'> &
  Plugin.Hooks &
  Plugin.Comments &
  Plugin.Exports & {
    /** Casing convention for generated names. */
    case: Casing;
    /** Resolved configuration for generated `getQueryData` helpers. */
    getQueryData: NamingOptions & FeatureToggle;
    /** Resolved configuration for generated infinite query key helpers. */
    infiniteQueryKeys: NamingOptions &
      FeatureToggle & {
        /** Whether to include operation tags in infinite query keys. */
        tags: boolean;
      };
    /** Resolved configuration for generated infinite query options helpers. */
    infiniteQueryOptions: NamingOptions &
      FeatureToggle & {
        /** Custom function to generate metadata for the operation. */
        meta: (operation: IR.OperationObject) => Record<string, unknown>;
      };
    /** Resolved configuration for generated mutation keys. */
    mutationKeys: NamingOptions &
      FeatureToggle & {
        /** Whether to include operation tags in mutation keys. */
        tags: boolean;
      };
    /** Resolved configuration for generated mutation options helpers. */
    mutationOptions: NamingOptions &
      FeatureToggle & {
        /** Whether to export generated symbols. */
        exported: boolean;
        /** Custom function to generate metadata for the operation. */
        meta: (operation: IR.OperationObject) => Record<string, unknown>;
      };
    /** Resolved configuration for generated query keys. */
    queryKeys: NamingOptions &
      FeatureToggle & {
        /** Whether to include operation tags in query keys. */
        tags: boolean;
      };
    /** Resolved configuration for generated query options helpers. */
    queryOptions: NamingOptions &
      FeatureToggle & {
        /** Whether to export generated symbols. */
        exported: boolean;
        /** Custom function to generate metadata for the operation. */
        meta: (operation: IR.OperationObject) => Record<string, unknown>;
      };
    /** Shape of the value returned from generated `queryFn`/`mutationFn`. */
    responseStyle: 'data' | 'fields';
    /** Resolved configuration for generated `setQueryData` helpers. */
    setQueryData: NamingOptions & FeatureToggle;
  };

export type TanStackAngularQueryPlugin = DefinePlugin<
  UserConfig,
  Config,
  never,
  TanStackQueryImports
>;
