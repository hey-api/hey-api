import type { UserConfig } from '@hey-api/openapi-ts';
import { plugins } from '@hey-api/openapi-ts';

type PluginConfig = NonNullable<NonNullable<UserConfig['plugins']>[number]>;

type PresetKey =
  | 'angular'
  | 'client'
  | 'fake'
  | 'full'
  | 'msw'
  | 'none'
  | 'rpc'
  | 'sdk'
  | 'tanstack'
  | 'transformed'
  | 'types'
  | 'validated';
type Presets = Record<PresetKey, () => ReadonlyArray<PluginConfig>>;

const presets: Presets = {
  angular: () => [
    plugins.angularCommon({
      httpRequests: 'flat',
    }),
  ],
  client: () => [
    /** Just the client */
    plugins.clientAxios(),
  ],
  fake: () => [
    /** Just the faker */
    plugins.typescript(),
    plugins.faker(),
  ],
  full: () => [
    /** Full kitchen sink for comprehensive testing */
    plugins.typescript(),
    plugins.sdk({
      paramsStructure: 'flat',
    }),
    plugins.transformers({
      dates: true,
    }),
    plugins.zod({
      metadata: true,
    }),
    plugins.tanstackReactQuery({
      queryKeys: {
        tags: true,
      },
    }),
  ],
  msw: () => [
    /** SDK + MSW handlers */
    plugins.sdk(),
    plugins.msw(),
  ],
  none: () => [
    /** No plugins at all */
  ],
  rpc: () => [
    /** RPC-style SDK with Zod validation */
    plugins.orpc(),
    plugins.zod(),
  ],
  sdk: () => [
    /** SDK with types */
    plugins.typescript(),
    plugins.sdk({
      operations: {
        containerName: 'OpenCode',
        strategy: 'single',
      },
      paramsStructure: 'flat',
    }),
  ],
  tanstack: () => [
    /** SDK + TanStack Query */
    plugins.typescript(),
    plugins.sdk(),
    plugins.tanstackReactQuery({
      queryKeys: {
        tags: true,
      },
    }),
  ],
  transformed: () => [
    /** SDK + transforms */
    plugins.typescript(),
    plugins.sdk({
      transformer: 'valibot',
    }),
    plugins.valibot(),
    plugins.zod(),
  ],
  types: () => [
    /** Just types, nothing else */
    plugins.typescript(),
  ],
  validated: () => [
    /** SDK + validation */
    plugins.typescript(),
    plugins.sdk({
      validator: 'zod',
    }),
    plugins.valibot({
      metadata: true,
    }),
    plugins.zod({
      metadata: true,
    }),
  ],
};

export function getPlugins(
  key: PresetKey = (process.env.PRESET as PresetKey) || 'sdk',
): ReadonlyArray<PluginConfig> {
  const preset = presets[key];
  if (!preset) {
    throw new Error(`Unknown preset: ${key}. Available: ${Object.keys(presets).join(', ')}`);
  }
  return preset();
}
