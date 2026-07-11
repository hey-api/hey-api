import type { PluginContext } from '@hey-api/shared';
import { coerce, definePluginConfig } from '@hey-api/shared';

import type { UserContractsConfig } from './contracts';
import { orpcImports } from './imports';
import { handler } from './plugin';
import type { Config, OrpcCompatibilityVersion, OrpcPlugin } from './types';

const validatorInferWarn =
  'You set `validator: true` but no validator plugin was found in your plugins. Add a validator plugin like `zod` to enable this feature. The validator option has been disabled.';

export const defaultConfig: OrpcPlugin['Config'] = {
  config: {
    compatibilityVersion: coerce((value, context) => {
      const packageName = '@orpc/contract';
      const version = (context as PluginContext).package.getVersion(packageName);

      function inferCompatibleVersion(): OrpcCompatibilityVersion {
        if (version && (version.major === 1 || version.major === 2)) {
          return String(version.major) as OrpcCompatibilityVersion;
        }
        // default compatibility version
        return '1';
      }

      return value ?? inferCompatibleVersion();
    }),
    contracts: {
      $cascade: ['strategy'],
      $coerceAny: ({ type, value }) => ({
        ...(type === 'string' || type === 'function'
          ? { strategy: value as UserContractsConfig['strategy'] }
          : {}),
      }),
      container: 'object',
      containerName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'camelCase',
        name: coerce((value, context) =>
          value !== undefined
            ? value
            : (context as UserContractsConfig).strategy === 'single'
              ? 'contract'
              : '',
        ),
      },
      contractName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'camelCase',
        name: '',
      },
      nesting: 'operationId',
      nestingDelimiters: /[./]/,
      segmentName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'camelCase',
        name: '',
      },
      strategy: 'single',
      strategyDefaultTag: 'default',
    },
    includeInEntry: false,
    inferQueryStyles: true,
    validator: {
      $coerceAny: ({ type, value }) => ({
        ...(type === 'boolean' || type === 'string'
          ? {
              input: value as Config['validator']['input'],
              output: value as Config['validator']['output'],
            }
          : {}),
      }),
      $dependencies: ['input', 'output'],
      input: coerce((value, context) => {
        if (value === true || value === undefined) {
          return (context as PluginContext).resolveTag('validator', {
            warn: validatorInferWarn,
          });
        }
        return value;
      }),
      output: coerce((value, context) => {
        if (value === true || value === undefined) {
          return (context as PluginContext).resolveTag('validator', {
            warn: validatorInferWarn,
          });
        }
        return value;
      }),
    },
  },
  handler,
  imports: orpcImports,
  name: 'orpc',
  symbolMeta() {
    return {
      artifact: 'orpc',
    };
  },
};

/**
 * Type helper for oRPC plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
