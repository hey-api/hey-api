import type { SymbolFactory } from '@hey-api/shared';

export function TEMPORAL(factory: SymbolFactory, { polyfill = true }: { polyfill?: boolean } = {}) {
  return {
    Temporal: factory.register(
      'Temporal',
      polyfill ? { external: 'temporal-polyfill' } : { global: true },
    ),
  };
}
