import type { Plugin, PluginConfigMap, PluginNames } from '@hey-api/shared';

import { defaultConfig as angularCommon } from './@angular/common';
import { defaultConfig as fakerJsFaker } from './@faker-js/faker';
import { defaultConfig as heyApiClientAngular } from './@hey-api/client-angular';
import { defaultConfig as heyApiClientAxios } from './@hey-api/client-axios';
import { defaultConfig as heyApiClientEffect } from './@hey-api/client-effect';
import { defaultConfig as heyApiClientFetch } from './@hey-api/client-fetch';
import { defaultConfig as heyApiClientKy } from './@hey-api/client-ky';
import { defaultConfig as heyApiClientNext } from './@hey-api/client-next';
import { defaultConfig as heyApiClientNuxt } from './@hey-api/client-nuxt';
import { defaultConfig as heyApiClientOfetch } from './@hey-api/client-ofetch';
import { defaultConfig as heyApiEffect } from './@hey-api/effect';
import { defaultConfig as heyApiExamples } from './@hey-api/examples';
import { defaultConfig as heyApiSchemas } from './@hey-api/schemas';
import { defaultConfig as heyApiSdk } from './@hey-api/sdk';
import { defaultConfig as heyApiTransformers } from './@hey-api/transformers';
import { defaultConfig as heyApiTypeScript } from './@hey-api/typescript';
import { defaultConfig as piniaColada } from './@pinia/colada';
import { defaultConfig as tanStackAngularQuery } from './@tanstack/angular-query-experimental';
import { defaultConfig as tanStackPreactQuery } from './@tanstack/preact-query';
import { defaultConfig as tanStackReactQuery } from './@tanstack/react-query';
import { defaultConfig as tanStackSolidQuery } from './@tanstack/solid-query';
import { defaultConfig as tanStackSvelteQuery } from './@tanstack/svelte-query';
import { defaultConfig as tanStackVueQuery } from './@tanstack/vue-query';
import { defaultConfig as arktype } from './arktype';
import { defaultConfig as effectSchema } from './effect-schema';
import { defaultConfig as fastify } from './fastify';
import { defaultConfig as msw } from './msw';
import { defaultConfig as nestjs } from './nestjs';
import { defaultConfig as orpc } from './orpc';
import { defaultConfig as swr } from './swr';
import { defaultConfig as valibot } from './valibot';
import { defaultConfig as zod } from './zod';

/**
 * Default plugins used to generate artifacts if plugins aren't specified.
 */
export const defaultPlugins = [
  '@hey-api/typescript',
  '@hey-api/sdk',
] as const satisfies ReadonlyArray<PluginNames>;

export const defaultPluginConfigs: {
  [K in PluginNames]: Plugin.Config<PluginConfigMap[K]>;
} = {
  '@angular/common': angularCommon,
  '@faker-js/faker': fakerJsFaker,
  '@hey-api/client-angular': heyApiClientAngular,
  '@hey-api/client-axios': heyApiClientAxios,
  '@hey-api/client-effect': heyApiClientEffect,
  '@hey-api/client-fetch': heyApiClientFetch,
  '@hey-api/client-ky': heyApiClientKy,
  '@hey-api/client-next': heyApiClientNext,
  '@hey-api/client-nuxt': heyApiClientNuxt,
  '@hey-api/client-ofetch': heyApiClientOfetch,
  '@hey-api/effect': heyApiEffect,
  '@hey-api/examples': heyApiExamples,
  '@hey-api/schemas': heyApiSchemas,
  '@hey-api/sdk': heyApiSdk,
  '@hey-api/transformers': heyApiTransformers,
  '@hey-api/typescript': heyApiTypeScript,
  '@pinia/colada': piniaColada,
  '@tanstack/angular-query-experimental': tanStackAngularQuery,
  '@tanstack/preact-query': tanStackPreactQuery,
  '@tanstack/react-query': tanStackReactQuery,
  '@tanstack/solid-query': tanStackSolidQuery,
  '@tanstack/svelte-query': tanStackSvelteQuery,
  '@tanstack/vue-query': tanStackVueQuery,
  arktype,
  'effect-schema': effectSchema,
  fastify,
  msw,
  nestjs,
  orpc,
  swr,
  valibot,
  zod,
};
