import { definePluginConfig } from '@hey-api/shared';

import { pydanticImports } from './imports';
import { handler } from './plugin';
import type { PydanticPlugin } from './types';

export const defaultConfig: PydanticPlugin['Config'] = {
  config: {
    $cascade: ['case'],
    case: 'PascalCase',
    comments: true,
    definitions: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: '{{name}}',
    },
    enums: 'enum',
    errors: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { error: value } : {}),
      }),
      enabled: true,
      error: '{{name}}Error',
    },
    fieldStyle: 'field',
    includeInEntry: false,
    modelType: 'BaseModel',
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
        name: '{{name}}Body',
      },
      enabled: true,
      headers: {
        $coerceAny: ({ type, value }) => ({
          enabled: Boolean(value),
          ...(type === 'string' || type === 'function' ? { name: value } : {}),
        }),
        enabled: true,
        name: '{{name}}Headers',
      },
      name: '{{name}}Request',
      path: {
        $coerceAny: ({ type, value }) => ({
          enabled: Boolean(value),
          ...(type === 'string' || type === 'function' ? { name: value } : {}),
        }),
        enabled: true,
        name: '{{name}}Path',
      },
      query: {
        $coerceAny: ({ type, value }) => ({
          enabled: Boolean(value),
          ...(type === 'string' || type === 'function' ? { name: value } : {}),
        }),
        enabled: true,
        name: '{{name}}Query',
      },
    },
    responses: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: '{{name}}Response',
    },
    strict: false,
    webhooks: {
      $coerceAny: ({ type, value }) => ({
        enabled: Boolean(value),
        ...(type === 'string' || type === 'function' ? { name: value } : {}),
      }),
      enabled: true,
      name: '{{name}}Webhook',
    },
  },
  handler,
  imports: pydanticImports,
  name: 'pydantic',
  symbolMeta() {
    return {
      artifact: 'pydantic',
    };
  },
  tags: ['validator'],
};

/**
 * Type helper for Pydantic plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
