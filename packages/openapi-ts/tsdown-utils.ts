import path from 'node:path';

export const clientPlugins = [
  'client-angular',
  'client-axios',
  'client-core',
  'client-fetch',
  'client-ky',
  'client-next',
  'client-nuxt',
  'client-ofetch',
] as const;

export function getClientBundleDir(pluginName: string): string {
  return path.resolve(import.meta.dirname, 'src', 'plugins', '@hey-api', pluginName, 'bundle');
}

export function replaceCoreImports(content: string): string {
  // Replace '../../client-core/bundle' with '../core'
  return content.replace(/from ['"]\.\.\/\.\.\/client-core\/bundle/g, "from '../core");
}
