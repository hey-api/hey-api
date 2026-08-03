import type { DefinePlugin, Plugin } from '@hey-api/shared';

import type { EffectImports } from './imports';

export type UserConfig = Plugin.Name<'@hey-api/effect'> &
  Plugin.Hooks &
  Plugin.UserComments &
  Plugin.UserExports & {
    /**
     * Name of the generated `HttpApi` value.
     *
     * @default 'Api'
     */
    apiName?: string;
  };

export type Config = Plugin.Name<'@hey-api/effect'> &
  Plugin.Hooks &
  Plugin.Comments &
  Plugin.Exports & {
    apiName: string;
  };

export type EffectPlugin = DefinePlugin<UserConfig, Config, never, EffectImports>;
