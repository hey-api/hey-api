import type { PluginInstance } from '@hey-api/shared';

export function EFFECT(plugin: PluginInstance) {
  return {
    Effect: plugin.symbol('Effect', {
      external: 'effect/Effect',
      importKind: 'namespace',
      kind: 'type',
    }),
    HttpApi: plugin.symbol('HttpApi', {
      external: 'effect/unstable/httpapi',
    }),
    HttpApiClient: plugin.symbol('HttpApiClient', {
      external: 'effect/unstable/httpapi',
    }),
    HttpApiEndpoint: plugin.symbol('HttpApiEndpoint', {
      external: 'effect/unstable/httpapi',
    }),
    HttpApiGroup: plugin.symbol('HttpApiGroup', {
      external: 'effect/unstable/httpapi',
    }),
    HttpApiSchema: plugin.symbol('HttpApiSchema', {
      external: 'effect/unstable/httpapi',
    }),
    HttpClient: plugin.symbol('HttpClient', {
      external: 'effect/unstable/http',
    }),
    HttpClientRequest: plugin.symbol('HttpClientRequest', {
      external: 'effect/unstable/http',
    }),
    Multipart: plugin.symbol('Multipart', {
      external: 'effect/unstable/http',
    }),
    Schema: plugin.symbol('Schema', {
      external: 'effect/Schema',
      importKind: 'namespace',
    }),
  };
}
