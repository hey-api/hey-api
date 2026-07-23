import { styleText } from 'node:util';

import type { PluginContext } from '@hey-api/shared';
import { coerce, definePluginConfig } from '@hey-api/shared';

import { Api } from './api';
import { zodImports } from './imports';
import { handler } from './plugin';
import type { ZodCompatibilityVersion, ZodPlugin } from './types';

export const defaultConfig: ZodPlugin['Config'] = {
  api: new Api(),
  config: {
    $cascade: ['case', 'types'],
    case: 'camelCase',
    comments: true,
    compatibilityVersion: coerce((value, context) => {
      const packageName = 'zod';
      const version = (context as PluginContext).package.getVersion(packageName);

      function inferCompatibleVersion(): ZodCompatibilityVersion {
        if (version && (version.major === 4 || version.major === 3)) {
          return version.major;
        }
        // default compatibility version
        return 4;
      }

      if (!value) {
        return inferCompatibleVersion();
      }

      if (!version) {
        return value;
      }

      if (value === 4 || value === 3 || value === 'mini') {
        if (!(context as PluginContext).package.satisfies(version, '>=3.25.0 <5.0.0')) {
          const compatibleVersion = inferCompatibleVersion();
          console.warn(
            `🔌 ${styleText('yellow', 'Warning:')} Installed ${styleText('cyan', packageName)} ${styleText('cyan', `v${version.version}`)} does not support compatibility version ${styleText('yellow', String(value))}, using ${styleText('yellow', String(compatibleVersion))}.`,
          );
          return compatibleVersion;
        }
      }

      return value;
    }),
    dates: {
      local: false,
      offset: false,
    },
    definitions: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: 'z{{name}}',
      types: {
        infer: {
          $coerceAny: ({ type, value }) => ({
            enabled: Boolean(value),
            ...(type === 'string' || type === 'function' ? { name: value } : {}),
          }),
          name: '{{name}}ZodType',
        },
        input: {
          $coerceAny: ({ type, value }) => ({
            enabled: Boolean(value),
            ...(type === 'string' || type === 'function' ? { name: value } : {}),
          }),
          name: '{{name}}ZodInput',
        },
        output: {
          $coerceAny: ({ type, value }) => ({
            enabled: Boolean(value),
            ...(type === 'string' || type === 'function' ? { name: value } : {}),
          }),
          name: '{{name}}ZodOutput',
        },
      },
    },
    includeInEntry: false,
    metadata: false,
    requests: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      body: {
        $coerceAny: ({ type, value }) => ({
          enabled: Boolean(value),
          ...(type === 'string' || type === 'function' ? { name: value } : {}),
        }),
        enabled: true,
        name: 'z{{name}}Body',
        types: {
          infer: {
            $coerceAny: ({ type, value }) => ({
              enabled: Boolean(value),
              ...(type === 'string' || type === 'function' ? { name: value } : {}),
            }),
            name: '{{name}}BodyZodType',
          },
          input: {
            $coerceAny: ({ type, value }) => ({
              enabled: Boolean(value),
              ...(type === 'string' || type === 'function' ? { name: value } : {}),
            }),
            name: '{{name}}BodyZodInput',
          },
          output: {
            $coerceAny: ({ type, value }) => ({
              enabled: Boolean(value),
              ...(type === 'string' || type === 'function' ? { name: value } : {}),
            }),
            name: '{{name}}BodyZodOutput',
          },
        },
      },
      enabled: true,
      headers: {
        $coerceAny: ({ type, value }) => ({
          enabled: Boolean(value),
          ...(type === 'string' || type === 'function' ? { name: value } : {}),
        }),
        enabled: true,
        name: 'z{{name}}Headers',
        types: {
          infer: {
            $coerceAny: ({ type, value }) => ({
              enabled: Boolean(value),
              ...(type === 'string' || type === 'function' ? { name: value } : {}),
            }),
            name: '{{name}}HeadersZodType',
          },
          input: {
            $coerceAny: ({ type, value }) => ({
              enabled: Boolean(value),
              ...(type === 'string' || type === 'function' ? { name: value } : {}),
            }),
            name: '{{name}}HeadersZodInput',
          },
          output: {
            $coerceAny: ({ type, value }) => ({
              enabled: Boolean(value),
              ...(type === 'string' || type === 'function' ? { name: value } : {}),
            }),
            name: '{{name}}HeadersZodOutput',
          },
        },
      },
      name: 'z{{name}}Data',
      path: {
        $coerceAny: ({ type, value }) => ({
          enabled: Boolean(value),
          ...(type === 'string' || type === 'function' ? { name: value } : {}),
        }),
        enabled: true,
        name: 'z{{name}}Path',
        types: {
          infer: {
            $coerceAny: ({ type, value }) => ({
              enabled: Boolean(value),
              ...(type === 'string' || type === 'function' ? { name: value } : {}),
            }),
            name: '{{name}}PathZodType',
          },
          input: {
            $coerceAny: ({ type, value }) => ({
              enabled: Boolean(value),
              ...(type === 'string' || type === 'function' ? { name: value } : {}),
            }),
            name: '{{name}}PathZodInput',
          },
          output: {
            $coerceAny: ({ type, value }) => ({
              enabled: Boolean(value),
              ...(type === 'string' || type === 'function' ? { name: value } : {}),
            }),
            name: '{{name}}PathZodOutput',
          },
        },
      },
      query: {
        $coerceAny: ({ type, value }) => ({
          enabled: Boolean(value),
          ...(type === 'string' || type === 'function' ? { name: value } : {}),
        }),
        enabled: true,
        name: 'z{{name}}Query',
        types: {
          infer: {
            $coerceAny: ({ type, value }) => ({
              enabled: Boolean(value),
              ...(type === 'string' || type === 'function' ? { name: value } : {}),
            }),
            name: '{{name}}QueryZodType',
          },
          input: {
            $coerceAny: ({ type, value }) => ({
              enabled: Boolean(value),
              ...(type === 'string' || type === 'function' ? { name: value } : {}),
            }),
            name: '{{name}}QueryZodInput',
          },
          output: {
            $coerceAny: ({ type, value }) => ({
              enabled: Boolean(value),
              ...(type === 'string' || type === 'function' ? { name: value } : {}),
            }),
            name: '{{name}}QueryZodOutput',
          },
        },
      },
      shouldExtract: coerce((value) =>
        typeof value === 'function' ? value : () => Boolean(value),
      ),
      types: {
        infer: {
          $coerceAny: ({ type, value }) => ({
            enabled: Boolean(value),
            ...(type === 'string' || type === 'function' ? { name: value } : {}),
          }),
          name: '{{name}}DataZodType',
        },
        input: {
          $coerceAny: ({ type, value }) => ({
            enabled: Boolean(value),
            ...(type === 'string' || type === 'function' ? { name: value } : {}),
          }),
          name: '{{name}}DataZodInput',
        },
        output: {
          $coerceAny: ({ type, value }) => ({
            enabled: Boolean(value),
            ...(type === 'string' || type === 'function' ? { name: value } : {}),
          }),
          name: '{{name}}DataZodOutput',
        },
      },
    },
    responses: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: 'z{{name}}Response',
      types: {
        infer: {
          $coerceAny: ({ type, value }) => ({
            enabled: Boolean(value),
            ...(type === 'string' || type === 'function' ? { name: value } : {}),
          }),
          name: '{{name}}ResponseZodType',
        },
        input: {
          $coerceAny: ({ type, value }) => ({
            enabled: Boolean(value),
            ...(type === 'string' || type === 'function' ? { name: value } : {}),
          }),
          name: '{{name}}ResponseZodInput',
        },
        output: {
          $coerceAny: ({ type, value }) => ({
            enabled: Boolean(value),
            ...(type === 'string' || type === 'function' ? { name: value } : {}),
          }),
          name: '{{name}}ResponseZodOutput',
        },
      },
    },
    types: {
      infer: {
        $coerceAny: ({ value }) => ({ enabled: Boolean(value) }),
        case: 'PascalCase',
        enabled: false,
      },
      input: {
        $coerceAny: ({ value }) => ({ enabled: Boolean(value) }),
        case: 'PascalCase',
        enabled: false,
      },
      output: {
        $coerceAny: ({ value }) => ({ enabled: Boolean(value) }),
        case: 'PascalCase',
        enabled: false,
      },
    },
    webhooks: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: 'z{{name}}WebhookRequest',
      types: {
        infer: {
          $coerceAny: ({ type, value }) => ({
            enabled: Boolean(value),
            ...(type === 'string' || type === 'function' ? { name: value } : {}),
          }),
          name: '{{name}}WebhookRequestZodType',
        },
        input: {
          $coerceAny: ({ type, value }) => ({
            enabled: Boolean(value),
            ...(type === 'string' || type === 'function' ? { name: value } : {}),
          }),
          name: '{{name}}WebhookRequestZodInput',
        },
        output: {
          $coerceAny: ({ type, value }) => ({
            enabled: Boolean(value),
            ...(type === 'string' || type === 'function' ? { name: value } : {}),
          }),
          name: '{{name}}WebhookRequestZodOutput',
        },
      },
    },
  },
  handler,
  imports: zodImports,
  name: 'zod',
  symbolMeta() {
    return {
      artifact: 'zod',
    };
  },
  tags: ['transformer', 'validator'],
};

/**
 * Type helper for Zod plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
