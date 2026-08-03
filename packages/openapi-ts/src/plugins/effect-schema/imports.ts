import type { PluginInstance } from '@hey-api/shared';

import * as SYMBOLS from '../../symbols';

export function effectSchemaImports(plugin: PluginInstance) {
  return {
    ...SYMBOLS.EFFECT(plugin),
  };
}

export type EffectSchemaImports = ReturnType<typeof effectSchemaImports>;
