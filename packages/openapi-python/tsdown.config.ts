import fs from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'tsdown';

import { clientPlugins, getClientBundleDir } from './tsdown-utils.ts';

export default defineConfig({
  attw: {
    ignoreRules: ['cjs-resolves-to-esm'],
    profile: 'esm-only',
  },
  entry: ['./src/{index,plugins,run}.ts'],
  onSuccess: async () => {
    // Copy client files to dist folder for runtime access
    for (const pluginName of clientPlugins) {
      const srcPath = getClientBundleDir(pluginName);
      const destPath = path.resolve(
        import.meta.dirname,
        'dist',
        'clients',
        pluginName.slice('client-'.length),
      );

      if (fs.existsSync(srcPath)) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.cpSync(srcPath, destPath, { recursive: true });

        // replace core imports in client bundle
        // const clientFiles = fs.readdirSync(destPath);
        // for (const file of clientFiles) {
        //   replaceCoreImports(path.resolve(destPath, file));
        // }
      }
    }
  },
  publint: true,
  sourcemap: true,
});
