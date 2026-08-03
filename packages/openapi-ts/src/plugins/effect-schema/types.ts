import type {
  Casing,
  DefinePlugin,
  FeatureToggle,
  NameTransformer,
  NamingOptions,
  Plugin,
} from '@hey-api/shared';

import type { IApi } from './api';
import type { EffectSchemaImports } from './imports';

type UserSchemaConfig =
  | boolean
  | NameTransformer
  | {
      case?: Casing;
      enabled?: boolean;
      name?: NameTransformer;
    };

export type UserConfig = Plugin.Name<'effect-schema'> &
  Plugin.Hooks &
  Plugin.UserComments &
  Plugin.UserExports & {
    /**
     * Configuration for reusable Effect Schema definitions.
     *
     * @default true
     */
    definitions?: UserSchemaConfig;
    /**
     * Configuration for operation request schemas.
     *
     * @default true
     */
    requests?: UserSchemaConfig;
    /**
     * Configuration for operation response schemas.
     *
     * @default true
     */
    responses?: UserSchemaConfig;
    /**
     * Configuration for webhook request schemas.
     *
     * @default true
     */
    webhooks?: UserSchemaConfig;
  };

export type Config = Plugin.Name<'effect-schema'> &
  Plugin.Hooks &
  Plugin.Comments &
  Plugin.Exports & {
    definitions: NamingOptions & FeatureToggle;
    requests: NamingOptions & FeatureToggle;
    responses: NamingOptions & FeatureToggle;
    webhooks: NamingOptions & FeatureToggle;
  };

export type EffectSchemaPlugin = DefinePlugin<UserConfig, Config, IApi, EffectSchemaImports>;
