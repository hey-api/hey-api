import path from 'node:path';

export const clientPlugins = [
  'client-aiohttp',
  'client-core',
  'client-httpx',
  'client-requests',
  'client-urllib3',
] as const;

export function getClientBundleDir(pluginName: string): string {
  return path.resolve(import.meta.dirname, 'src', 'plugins', '@hey-api', pluginName, 'bundle');
}
