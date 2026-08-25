import { coerce, definePluginConfig } from '@hey-api/shared';

import { Api } from './api';
import { valibotImports } from './imports';
import { handler } from './plugin';
import type { ValibotPlugin } from './types';

export const defaultConfig: ValibotPlugin['Config'] = {
  api: new Api(),
  config: {
    $cascade: ['case'],
    case: 'camelCase',
    comments: true,
    commentsStyle: 'default',
    definitions: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: 'v{{name}}',
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
        name: 'v{{name}}Body',
      },
      enabled: true,
      headers: {
        $coerceAny: ({ type, value }) => ({
          enabled: Boolean(value),
          ...(type === 'string' || type === 'function' ? { name: value } : {}),
        }),
        enabled: true,
        name: 'v{{name}}Headers',
      },
      name: 'v{{name}}Data',
      path: {
        $coerceAny: ({ type, value }) => ({
          enabled: Boolean(value),
          ...(type === 'string' || type === 'function' ? { name: value } : {}),
        }),
        enabled: true,
        name: 'v{{name}}Path',
      },
      query: {
        $coerceAny: ({ type, value }) => ({
          enabled: Boolean(value),
          ...(type === 'string' || type === 'function' ? { name: value } : {}),
        }),
        enabled: true,
        name: 'v{{name}}Query',
      },
      shouldExtract: coerce((value) =>
        typeof value === 'function' ? value : () => Boolean(value),
      ),
    },
    responses: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: 'v{{name}}Response',
    },
    webhooks: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: 'v{{name}}WebhookRequest',
    },
  },
  handler,
  imports: valibotImports,
  name: 'valibot',
  symbolMeta() {
    return {
      artifact: 'valibot',
    };
  },
  tags: ['transformer', 'validator'],
};

/**
 * Type helper for Valibot plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
