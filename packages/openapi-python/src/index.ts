// OVERRIDES
// hard-coded here because build process doesn't pick up overrides from separate files
import '@hey-api/codegen-core';
import '@hey-api/shared';

declare module '@hey-api/codegen-core' {
  interface ProjectMeta {
    python: {
      Version: Version<PythonVersion>;
      symbols: {
        enum: EnumSymbols;
        typing: TypingSymbols;
      };
      version: PythonVersion;
    };
  }

  interface SymbolMeta {
    artifact?: 'pydantic' | 'sdk' | AnyString;
    category?:
      | 'client'
      | 'external'
      | 'hook'
      | 'schema'
      | 'sdk'
      | 'transform'
      | 'type'
      | 'utility'
      | AnyString;
    /** Path to the resource this symbol represents. */
    path?: ReadonlyArray<string | number>;
    /** Name of the plugin that registered this symbol. */
    plugin?: string;
    resource?: 'client' | 'definition' | 'operation' | 'webhook' | AnyString;
    resourceId?: string;
    role?: 'data' | 'error' | 'errors' | 'options' | 'response' | 'responses' | AnyString;
    /** Tags associated with this symbol. */
    tags?: ReadonlyArray<string>;
    variant?: 'container' | AnyString;
  }
}

declare module '@hey-api/shared' {
  interface PluginConfigMap {
    '@hey-api/client-aiohttp': Plugins.HeyApiClientAiohttp.Types['Types'];
    '@hey-api/client-httpx': Plugins.HeyApiClientHttpx.Types['Types'];
    '@hey-api/client-requests': Plugins.HeyApiClientRequests.Types['Types'];
    '@hey-api/client-urllib3': Plugins.HeyApiClientUrllib3.Types['Types'];
    '@hey-api/python-sdk': Plugins.HeyApiSdk.Types['Types'];
    pydantic: Plugins.Pydantic.Types['Types'];
  }
}
// END OVERRIDES

import type { Version } from '@hey-api/codegen-core';
import type { AnyString, LazyOrAsync, MaybeArray } from '@hey-api/types';
import colors from 'ansi-colors';
// @ts-expect-error
import colorSupport from 'color-support';

import type { PythonVersion } from './config/output/types';
import type { UserConfig } from './config/types';
import type { HeyApiClientAiohttpPlugin } from './plugins/@hey-api/client-aiohttp';
import type { HeyApiClientHttpxPlugin } from './plugins/@hey-api/client-httpx';
import type { HeyApiClientRequestsPlugin } from './plugins/@hey-api/client-requests';
import type { HeyApiClientUrllib3Plugin } from './plugins/@hey-api/client-urllib3';
import type { HeyApiSdkPlugin } from './plugins/@hey-api/sdk';
import type { PydanticPlugin, PydanticResolvers } from './plugins/pydantic';
import type { EnumSymbols } from './symbols/enum';
import type { TypingSymbols } from './symbols/typing';

colors.enabled = colorSupport().hasBasic;

export { createClient } from './generate';

/**
 * Type helper for configuration object, returns {@link MaybeArray<UserConfig>} object(s)
 */
export function defineConfig(
  config: LazyOrAsync<ReadonlyArray<UserConfig>>,
): Promise<ReadonlyArray<UserConfig>>;
export function defineConfig(config: LazyOrAsync<UserConfig>): Promise<UserConfig>;
export async function defineConfig<T extends MaybeArray<UserConfig>>(
  config: LazyOrAsync<T>,
): Promise<T> {
  return typeof config === 'function' ? await config() : config;
}

export type { UserConfig } from './config/types';
export * as plugins from './plugins';
export { defaultPlugins } from './plugins/config';
export * from './py-dsl';
export { Logger } from '@hey-api/codegen-core';
export type {
  AnyPluginName,
  Coercer,
  CoercerMap,
  ConfigTable,
  DefinePlugin,
  IR,
  OpenApi,
  OpenApiMetaObject,
  OpenApiOperationObject,
  OpenApiParameterObject,
  OpenApiRequestBodyObject,
  OpenApiResponseObject,
  OpenApiSchemaObject,
  Plugin,
  PluginContext,
  PluginInstance,
  TableDirectives,
} from '@hey-api/shared';
export {
  applyNaming,
  coerce,
  defaultPaginationKeywords,
  defineConfig as defineConfigTable,
  definePluginConfig,
  OperationPath,
  OperationStrategy,
  toCase,
  utils,
} from '@hey-api/shared';

export namespace Plugins {
  export namespace HeyApiClientAiohttp {
    export type Types = HeyApiClientAiohttpPlugin;
  }

  export namespace HeyApiClientHttpx {
    export type Types = HeyApiClientHttpxPlugin;
  }

  export namespace HeyApiClientRequests {
    export type Types = HeyApiClientRequestsPlugin;
  }

  export namespace HeyApiClientUrllib3 {
    export type Types = HeyApiClientUrllib3Plugin;
  }

  export namespace HeyApiSdk {
    export type Types = HeyApiSdkPlugin;
  }

  export namespace Pydantic {
    export type Resolvers = Required<PydanticResolvers>['$resolvers'];
    export type Types = PydanticPlugin;
  }
}
