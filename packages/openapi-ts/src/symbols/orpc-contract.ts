import type { SymbolFactory } from '@hey-api/shared';

export function ORPC_CONTRACT(factory: SymbolFactory) {
  return {
    // v1 and v2 contract builder
    oc: factory.register('oc', {
      external: '@orpc/contract',
    }),
    // v2 OpenAPI metadata helper
    openapi: factory.register('openapi', {
      external: '@orpc/openapi',
    }),
  };
}
