import type { PluginContext } from '@hey-api/shared';
import { coerce, definePluginConfig } from '@hey-api/shared';

import { sdkImports } from './imports';
import type { UserOperationsConfig } from './operations';
import { handler } from './plugin';
import type { HeyApiSdkPlugin } from './types';

export const defaultConfig: HeyApiSdkPlugin['Config'] = {
  config: {
    $dependencies: ['client'],
    auth: true,
    client: coerce((value, context) => {
      if (value === true || value === undefined) {
        return (context as PluginContext).resolveTag('client', {
          defaultPlugin: '@hey-api/client-httpx',
        });
      }
      return value;
    }),
    comments: true,
    examples: {
      $coerceAny: ({ value }) => ({ enabled: Boolean(value) }),
      enabled: false,
      language: 'Python',
    },
    includeInEntry: true,
    operations: {
      $cascade: ['strategy'],
      $coerceAny: ({ type, value }) => ({
        ...(type === 'string' || type === 'function'
          ? { strategy: value as UserOperationsConfig['strategy'] }
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
            : (context as UserOperationsConfig).strategy === 'single'
              ? 'Sdk'
              : '',
        ),
      },
      methodName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'snake_case',
        name: '',
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
        name: '',
      },
      strategy: 'single',
      strategyDefaultTag: 'default',
    },
    paramsStructure: 'grouped',
  },
  dependencies: ['pydantic'],
  handler,
  imports: sdkImports,
  name: '@hey-api/python-sdk',
  symbolMeta() {
    return {
      artifact: 'sdk',
    };
  },
};

/**
 * Type helper for `@hey-api/python-sdk` plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
