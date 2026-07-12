import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { ExeTarget } from '@tsdown/exe';
import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };
import { SEA_MANIFEST_KEY, seaAssetKey } from './src/sea.ts';
import { clientPlugins, getClientBundleDir, replaceCoreImports } from './tsdown-utils.ts';

const assets: Record<string, string> = {};
const manifest: Record<string, Array<string>> = {};

const seaTmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hey-api-sea-'));

for (const pluginName of clientPlugins) {
  const clientName = pluginName.slice('client-'.length);
  const bundleDir = getClientBundleDir(pluginName);
  if (fs.existsSync(bundleDir)) {
    manifest[clientName] = [];
    for (const file of fs.readdirSync(bundleDir)) {
      const key = seaAssetKey(clientName, file);
      const srcPath = path.resolve(bundleDir, file);

      const content = fs.readFileSync(srcPath, 'utf-8');
      const processed = replaceCoreImports(content);
      const tmpPath = path.resolve(seaTmpDir, clientName, file);
      fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
      fs.writeFileSync(tmpPath, processed);

      assets[key] = tmpPath;
      manifest[clientName].push(file);
    }
  }
}

const manifestPath = path.resolve(seaTmpDir, 'sea-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest));
assets[SEA_MANIFEST_KEY] = manifestPath;

const nodeVersion = fs
  .readFileSync(path.resolve(import.meta.dirname, '..', '..', '.nvmrc'), 'utf-8')
  .trim();

export default defineConfig(() => {
  const targets = process.env.CI
    ? ([
        { arch: 'x64', nodeVersion, platform: 'linux' },
        { arch: 'arm64', nodeVersion, platform: 'linux' },
        { arch: 'arm64', nodeVersion, platform: 'darwin' },
        { arch: 'x64', nodeVersion, platform: 'win' },
      ] as const satisfies Array<ExeTarget>)
    : undefined;

  return {
    deps: {
      alwaysBundle: Object.keys(pkg.dependencies),
    },
    entry: ['./src/run.ts'],
    exe: {
      fileName: 'openapi-ts',
      seaConfig: {
        assets,
        disableExperimentalSEAWarning: true,
        ...(targets && {
          useCodeCache: false,
          useSnapshot: false,
        }),
      },
      targets,
    },
    platform: 'node' as const,
  };
});
