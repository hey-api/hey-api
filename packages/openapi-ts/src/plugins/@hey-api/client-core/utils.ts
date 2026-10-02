import type { Config } from '../../../config/types';
import type { PluginClientNames } from '../../types';

/** Clients implementing `responseStyle`. The rest have no `TResponseStyle` type parameter. */
const clientsWithResponseStyle: ReadonlySet<PluginClientNames> = new Set([
  '@hey-api/client-angular',
  '@hey-api/client-fetch',
  '@hey-api/client-ky',
  '@hey-api/client-ofetch',
]);

/**
 * Whether the selected client implements `responseStyle`. Clients that don't
 * always return the fields shape, so every plugin reading the SDK's
 * `responseStyle` must resolve it through here rather than trusting the config.
 */
export function clientSupportsResponseStyle(config: Config): boolean {
  return clientsWithResponseStyle.has(getClientPlugin(config).name);
}

export function getClientBaseUrlKey(config: Config) {
  const client = getClientPlugin(config);
  if (client.name === '@hey-api/client-axios' || client.name === '@hey-api/client-nuxt') {
    return 'baseURL';
  }
  return 'baseUrl';
}

export function getClientPlugin(
  config: Config,
): Config['plugins'][PluginClientNames] & { name: PluginClientNames } {
  for (const name of config.pluginOrder) {
    const plugin = config.plugins[name];
    if (plugin?.tags?.includes('client')) {
      return plugin as Config['plugins'][PluginClientNames] & {
        name: PluginClientNames;
      };
    }
  }

  return {
    config: {
      // @ts-expect-error
      name: '',
    },
    // @ts-expect-error
    name: '',
  };
}
