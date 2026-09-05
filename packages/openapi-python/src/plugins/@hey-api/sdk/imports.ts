import type { PluginInstance } from '@hey-api/shared';

import { getTypedConfig } from '../../../config/utils';
import { clientFolderAbsolutePath } from '../../../generate/client';
import * as SYMBOLS from '../../../symbols';

export function sdkImports(plugin: PluginInstance) {
  const clientModule = clientFolderAbsolutePath(getTypedConfig(plugin));
  const factory = plugin.symbolFactory;

  return {
    AsyncClient: factory.register('AsyncClient', {
      external: clientModule,
      meta: {
        resource: 'client.AsyncClient',
      },
    }),
    Client: factory.register('Client', {
      external: clientModule,
      meta: {
        resource: 'client.Client',
      },
    }),
    buildClientParams: factory.register('build_client_params', {
      external: clientModule,
      meta: {
        resource: 'client.build_client_params',
      },
    }),
    funcTools: SYMBOLS.FUNC_TOOLS(factory),
    typing: SYMBOLS.TYPING(factory),
  };
}

export type SdkImports = ReturnType<typeof sdkImports>;
