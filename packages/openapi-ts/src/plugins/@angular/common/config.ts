import type { OperationsStrategy } from '@hey-api/shared';
import { coerce, definePluginConfig } from '@hey-api/shared';

import type { HttpRequestsConfig } from './http-requests';
import type { HttpResourcesConfig } from './http-resources';
import { angularImports } from './imports';
import { handler } from './plugin';
import type { AngularCommonPlugin } from './types';

export const defaultConfig: AngularCommonPlugin['Config'] = {
  config: {
    comments: true,
    commentsStyle: 'default',
    httpRequests: {
      $cascade: ['strategy'],
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function'
          ? { strategy: value as OperationsStrategy }
          : {}),
      }),
      container: 'class',
      containerName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'PascalCase',
        name: coerce((value, context) =>
          value !== undefined
            ? value
            : (context as HttpRequestsConfig).strategy === 'single'
              ? 'HttpRequests'
              : '',
        ),
      },
      enabled: true,
      methodName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'camelCase',
        name: coerce((value, context) =>
          value !== undefined
            ? value
            : (context as HttpRequestsConfig).strategy === 'flat'
              ? '{{name}}Request'
              : '',
        ),
      },
      methods: 'instance',
      nesting: 'operationId',
      nestingDelimiters: /[./]/,
      segmentName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'PascalCase',
        name: '{{name}}Requests',
      },
      strategy: 'flat',
      strategyDefaultTag: 'default',
    },
    httpResources: {
      $cascade: ['strategy'],
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function'
          ? { strategy: value as OperationsStrategy }
          : {}),
      }),
      container: 'class',
      containerName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'PascalCase',
        name: coerce((value, context) =>
          value !== undefined
            ? value
            : (context as HttpResourcesConfig).strategy === 'single'
              ? 'HttpResources'
              : '',
        ),
      },
      enabled: true,
      methodName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'camelCase',
        name: coerce((value, context) =>
          value !== undefined
            ? value
            : (context as HttpResourcesConfig).strategy === 'flat'
              ? '{{name}}Resource'
              : '',
        ),
      },
      methods: 'instance',
      nesting: 'operationId',
      nestingDelimiters: /[./]/,
      segmentName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'PascalCase',
        name: '{{name}}Resources',
      },
      strategy: 'flat',
      strategyDefaultTag: 'default',
    },
    includeInEntry: false,
  },
  dependencies: ['@hey-api/client-angular', '@hey-api/sdk'],
  handler,
  imports: angularImports,
  name: '@angular/common',
  symbolMeta() {
    return {
      artifact: '@angular/common',
    };
  },
};

/**
 * Type helper for `@angular/common` plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
