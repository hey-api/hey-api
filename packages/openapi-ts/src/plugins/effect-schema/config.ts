import { definePluginConfig } from '@hey-api/shared';

import { Api } from './api';
import { effectSchemaImports } from './imports';
import { handler } from './plugin';
import type { EffectSchemaPlugin } from './types';

export const defaultConfig: EffectSchemaPlugin['Config'] = {
  api: new Api(),
  config: {
    comments: true,
    definitions: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      case: 'PascalCase',
      enabled: true,
      name: '{{name}}Schema',
    },
    includeInEntry: false,
    requests: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      case: 'PascalCase',
      enabled: true,
      name: '{{name}}DataSchema',
    },
    responses: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      case: 'PascalCase',
      enabled: true,
      name: '{{name}}ResponseSchema',
    },
    webhooks: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      case: 'PascalCase',
      enabled: true,
      name: '{{name}}WebhookRequestSchema',
    },
  },
  dependencies: ['@hey-api/typescript'],
  handler,
  imports: effectSchemaImports,
  name: 'effect-schema',
  symbolMeta() {
    return {
      artifact: 'effect-schema',
    };
  },
  tags: ['transformer', 'validator'],
};

/**
 * Type helper for the `effect-schema` plugin.
 */
export const defineConfig = definePluginConfig(defaultConfig);
