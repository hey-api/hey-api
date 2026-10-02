import type { SymbolFactory } from '@hey-api/shared';

export function MSW(factory: SymbolFactory) {
  return {
    DefaultBodyType: factory.register('DefaultBodyType', {
      external: 'msw',
      kind: 'type',
    }),
    HttpHandler: factory.register('HttpHandler', {
      external: 'msw',
    }),
    HttpResponse: factory.register('HttpResponse', {
      external: 'msw',
    }),
    HttpResponseResolver: factory.register('HttpResponseResolver', {
      external: 'msw',
      kind: 'type',
    }),
    RequestHandlerOptions: factory.register('RequestHandlerOptions', {
      external: 'msw',
      kind: 'type',
    }),
    http: factory.register('http', {
      external: 'msw',
    }),
  };
}
