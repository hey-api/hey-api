import { definePluginConfig } from '@hey-api/shared';

import { Api } from './api';
import { handler } from './plugin';
import type { EnumsType, HeyApiTypeScriptPlugin } from './types';

export const defaultConfig: HeyApiTypeScriptPlugin['Config'] = {
  api: new Api(),
  config: {
    $cascade: ['case'],
    case: 'PascalCase',
    comments: true,
    definitions: {
      $coerceAny: ({ type, value }) => ({
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      name: '{{name}}',
    },
    enums: {
      $coerce: {
        string: (v) => ({ mode: v as EnumsType }),
      },
      $coerceAny: ({ value }) => ({ enabled: Boolean(value) }),
      case: 'SCREAMING_SNAKE_CASE',
      constantsIgnoreNull: false,
      enabled: false,
      mode: 'javascript',
    },
    errors: {
      $coerceAny: ({ type, value }) => ({
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      error: '{{name}}Error',
      name: '{{name}}Errors',
    },
    includeInEntry: true,
    requests: {
      $coerceAny: ({ type, value }) => ({
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      name: '{{name}}Data',
    },
    responses: {
      $coerceAny: ({ type, value }) => ({
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      name: '{{name}}Responses',
      response: '{{name}}Response',
    },
    topType: 'unknown',
    webhooks: {
      $coerceAny: ({ type, value }) => ({
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      name: '{{name}}WebhookRequest',
      payload: '{{name}}WebhookPayload',
    },
  },
  handler,
  name: '@hey-api/typescript',
  symbolMeta() {
    return {
      artifact: 'types',
    };
  },
};

/**
 * Type helper for `@hey-api/typescript` plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
