export type PluginClientNames =
  | '@hey-api/client-angular'
  | '@hey-api/client-axios'
  | '@hey-api/client-effect'
  | '@hey-api/client-fetch'
  | '@hey-api/client-ky'
  | '@hey-api/client-next'
  | '@hey-api/client-nuxt'
  | '@hey-api/client-ofetch';

export type PluginSourceNames = '@faker-js/faker' | '@hey-api/examples';

export type PluginTransformerNames = '@hey-api/transformers' | 'effect-schema' | 'valibot' | 'zod';

export type PluginValidatorNames = 'arktype' | 'effect-schema' | 'valibot' | 'zod';
