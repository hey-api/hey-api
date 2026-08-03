import type { DefinePlugin, Plugin } from '@hey-api/shared';

import type { Client } from '../client-core/types';

export type UserConfig = Plugin.Name<'@hey-api/client-effect'> & Client.Config;

export type HeyApiClientEffectPlugin = DefinePlugin<UserConfig, UserConfig>;
export type { Client as EffectClient } from './bundle/types';
