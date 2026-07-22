import { definePluginConfig } from '@hey-api/shared';

import { resolveDates } from './dates';
import { bigIntExpressions, dateExpressions, temporalExpressions } from './expressions';
import { handler } from './plugin';
import type { HeyApiTransformersPlugin } from './types';

export const defaultConfig: HeyApiTransformersPlugin['Config'] = {
  config: {
    $finalize(config) {
      const dates = resolveDates(config.dates);
      if (dates.enabled) {
        const dateTransformer = dates.type === 'temporal' ? temporalExpressions : dateExpressions;
        config.transformers = [...config.transformers, dateTransformer];
      }

      if (config.bigInt) {
        config.transformers = [...config.transformers, bigIntExpressions];
      }
    },
    bigInt: true,
    dates: true,
    includeInEntry: false,
    transformers: [],
    typeTransformers: [],
  },
  dependencies: ['@hey-api/typescript'],
  handler,
  name: '@hey-api/transformers',
  symbolMeta() {
    return {
      artifact: 'transformers',
    };
  },
  tags: ['transformer'],
};

/**
 * Type helper for `@hey-api/transformers`, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
