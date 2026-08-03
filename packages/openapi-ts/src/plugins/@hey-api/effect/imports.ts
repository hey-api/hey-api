import type { PluginInstance } from '@hey-api/shared';

import * as SYMBOLS from '../../../symbols';

export function effectImports(plugin: PluginInstance) {
  return {
    ...SYMBOLS.EFFECT(plugin),
  };
}

export type EffectImports = ReturnType<typeof effectImports>;
