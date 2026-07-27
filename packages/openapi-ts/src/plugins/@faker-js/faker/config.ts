import type { PluginContext } from '@hey-api/shared';
import { coerce, definePluginConfig } from '@hey-api/shared';

import { Api } from './api';
import { fakerImports } from './imports';
import { handler } from './plugin';
import type { FakerCompatibilityVersion, FakerJsFakerPlugin } from './types';

export const defaultConfig: FakerJsFakerPlugin['Config'] = {
  api: new Api(),
  config: {
    $cascade: ['case'],
    case: 'camelCase',
    compatibilityVersion: coerce((value, context) => {
      const packageName = '@faker-js/faker';
      const version = (context as PluginContext).package.getVersion(packageName);

      function inferCompatibleVersion(): FakerCompatibilityVersion {
        if (version && (version.major === 9 || version.major === 10)) {
          return version.major;
        }
        // default compatibility version
        return 10;
      }

      if (!value) {
        return inferCompatibleVersion();
      }

      if (!version) {
        return value;
      }

      // if (value === 10 || value === 9) {
      //   if (!(context as PluginContext).package.satisfies(version, '>=3.25.0 <5.0.0')) {
      //     const compatibleVersion = inferCompatibleVersion();
      //     console.warn(
      //       `🔌 ${styleText('yellow', 'Warning:')} Installed ${styleText('cyan', packageName)} ${styleText('cyan', `v${version.version}`)} does not support compatibility version ${styleText('yellow', String(value))}, using ${styleText('yellow', String(compatibleVersion))}.`,
      //     );
      //     return compatibleVersion;
      //   }
      // }

      return value;
    }),
    definitions: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: 'fake{{name}}',
    },
    includeInEntry: false,
    maxCallDepth: 10,
    nameRules: {},
    requests: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: 'fake{{name}}Request',
    },
    responses: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: 'fake{{name}}Response',
    },
  },
  handler,
  imports: fakerImports,
  name: '@faker-js/faker',
  symbolMeta() {
    return {
      artifact: '@faker-js/faker',
    };
  },
  tags: ['source'],
};

/**
 * Type helper for Faker plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
