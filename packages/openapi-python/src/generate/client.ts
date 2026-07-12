import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type * as Sea from 'node:sea';

import type { IProject } from '@hey-api/codegen-core';
import type { DefinePlugin, OutputHeader } from '@hey-api/shared';
import { ensureDirSync, isEnvironment, outputHeaderToPrefix } from '@hey-api/shared';

import type { Config } from '../config/types';
import type { Client } from '../plugins/@hey-api/client-core/types';
import { getClientPlugin } from '../plugins/@hey-api/client-core/utils';
import { SEA_MANIFEST_KEY, seaAssetKey } from '../sea';

let _sea: typeof Sea | undefined;
let _manifest: Record<string, Array<string>>;
let _seaExtractDir: string | undefined;

function getSeaExtractDir(): string {
  if (!_seaExtractDir) {
    _seaExtractDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hey-api-sea-'));
  }
  return _seaExtractDir;
}

export function cleanupSeaExtract(): void {
  if (_seaExtractDir) {
    fs.rmSync(_seaExtractDir, { force: true, recursive: true });
    _seaExtractDir = undefined;
  }
}

async function getSea(): Promise<typeof Sea> {
  if (!_sea) {
    _sea = await import('node:sea');
  }
  return _sea;
}

async function getSeaManifest(): Promise<Record<string, Array<string>>> {
  if (!_manifest) {
    const sea = await getSea();
    _manifest = JSON.parse(sea.getAsset(SEA_MANIFEST_KEY, 'utf-8'));
  }
  return _manifest;
}

async function isSea(): Promise<boolean> {
  try {
    const sea = await getSea();
    return sea.isSea();
  } catch {
    return false;
  }
}

async function extractSeaClientFiles(clientName: string): Promise<string> {
  const sea = await getSea();
  const manifest = await getSeaManifest();

  const tmpDir = path.resolve(getSeaExtractDir(), clientName);
  fs.mkdirSync(tmpDir, { recursive: true });

  const files = manifest[clientName];
  if (files) {
    for (const file of files) {
      if (file.includes('..') || path.isAbsolute(file)) {
        throw new Error(`Invalid SEA asset filename: ${file}`);
      }
      const content = sea.getAsset(seaAssetKey(clientName, file), 'utf-8');
      fs.writeFileSync(path.resolve(tmpDir, file), content);
    }
  }

  return tmpDir;
}

/**
 * Returns paths to client bundle files based on execution context
 */
async function getClientBundlePaths(pluginName: string): Promise<{
  clientPath: string;
  corePath: string;
}> {
  const clientName = pluginName.slice('@hey-api/client-'.length);

  if (await isSea()) {
    return {
      clientPath: await extractSeaClientFiles(clientName),
      corePath: await extractSeaClientFiles('core'),
    };
  }

  if (isEnvironment('development')) {
    // Dev: source bundle folders at src/plugins/@hey-api/{client}/bundle
    const pluginsDir = path.resolve(import.meta.dirname, '..', 'plugins', '@hey-api');
    return {
      clientPath: path.resolve(pluginsDir, `client-${clientName}`, 'bundle'),
      corePath: path.resolve(pluginsDir, 'client-core', 'bundle'),
    };
  }

  // Prod: copied to dist/clients/{clientName}
  return {
    clientPath: path.resolve(import.meta.dirname, 'clients', clientName),
    corePath: path.resolve(import.meta.dirname, 'clients', 'core'),
  };
}

/**
 * Returns absolute path to the client folder. This is hard-coded for now.
 */
export function clientFolderAbsolutePath(config: Config): string {
  const client = getClientPlugin(config);

  if ('bundle' in client.config && client.config.bundle) {
    // not proud of this one
    const renamed: Map<string, string> | undefined =
      // @ts-expect-error
      config._FRAGILE_CLIENT_BUNDLE_RENAMED;
    return path.resolve(config.output.path, 'client', `${renamed?.get('index') ?? 'index'}.py`);
  }

  return client.name;
}

/**
 * Recursively copies files and directories.
 * This is a PnP-compatible alternative to fs.cpSync that works with Yarn PnP's
 * virtualized filesystem.
 */
function copyRecursivePnP(src: string, dest: string): void {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    for (const file of files) {
      copyRecursivePnP(path.join(src, file), path.join(dest, file));
    }
  } else {
    const content = fs.readFileSync(src);
    fs.writeFileSync(dest, content);
  }
}

function renameFile({
  filePath,
  project,
  renamed,
}: {
  filePath: string;
  project: IProject;
  renamed: Map<string, string>;
}): void {
  const extension = path.extname(filePath);
  const name = path.basename(filePath, extension);
  const renamedName = project.fileName?.(name) || name;
  if (renamedName !== name) {
    const outputPath = path.dirname(filePath);
    fs.renameSync(filePath, path.resolve(outputPath, `${renamedName}${extension}`));
    renamed.set(name, renamedName);
  }
}

function replaceImports({
  filePath,
  header,
  renamed,
}: {
  filePath: string;
  header?: string;
  renamed: Map<string, string>;
}): void {
  let content = fs.readFileSync(filePath, 'utf8');

  // Dev mode: rewrite source bundle imports to match output structure
  if (isEnvironment('development')) {
    // ...client_core.bundle.foo -> ..core.foo
    content = content.replace(
      /from\s+(\.{3,})\.?client_core\.bundle\./g,
      (match, dots) => `from ${dots === '...' ? '..' : dots.slice(0, -1)}core.`,
    );
    // ...client_core.bundle (index import) -> ..core
    content = content.replace(
      /from\s+(\.{3,})\.?client_core\.bundle['"]?/g,
      (match, dots) => `from ${dots === '...' ? '..' : dots.slice(0, -1)}core`,
    );
  }

  content = content.replace(/from\s+(.+?)\s+import/g, (match, importPath) => {
    const cleanPath = importPath.replace(/^['"]|['"]$/g, '');
    if (!cleanPath.startsWith('.')) return match;
    const leadingDots = cleanPath.match(/^\.+/)?.[0] || '';
    const moduleName = cleanPath.replace(/^\.+/, '');
    if (!moduleName) return match;
    const replacedName = renamed.get(moduleName) ?? moduleName;
    return `from ${leadingDots}${replacedName} import`;
  });

  const fileHeader = header ?? '';

  content = `${fileHeader}${content}`;

  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Creates a `client` folder containing the same modules as the client package.
 */
export async function generateClientBundle({
  header,
  outputPath,
  plugin,
  project,
}: {
  header?: OutputHeader;
  outputPath: string;
  plugin: DefinePlugin<Client.Config & { name: string }>['Config'];
  project: IProject;
}): Promise<Map<string, string> | undefined> {
  const renamed = new Map<string, string>();
  const headerPrefix = outputHeaderToPrefix({
    defaultValue: ['# This file is auto-generated by @hey-api/openapi-python'],
    header,
    project,
  });

  // copy Hey API clients to output
  const isHeyApiClientPlugin = plugin.name.startsWith('@hey-api/client-');
  if (isHeyApiClientPlugin) {
    const { clientPath } = await getClientBundlePaths(plugin.name);
    // const { clientPath, corePath } = getClientBundlePaths(plugin.name);

    // copy client core
    // const coreOutputPath = path.resolve(outputPath, 'core');
    // ensureDirSync(coreOutputPath);
    // copyRecursivePnP(corePath, coreOutputPath);

    // copy client bundle
    const clientOutputPath = path.resolve(outputPath, 'client');
    ensureDirSync(clientOutputPath);
    copyRecursivePnP(clientPath, clientOutputPath);

    if (project) {
      // const copiedCoreFiles = fs.readdirSync(coreOutputPath);
      // for (const file of copiedCoreFiles) {
      //   renameFile({
      //     filePath: path.resolve(coreOutputPath, file),
      //     project,
      //     renamed,
      //   });
      // }

      const copiedClientFiles = fs.readdirSync(clientOutputPath);
      for (const file of copiedClientFiles) {
        renameFile({
          filePath: path.resolve(clientOutputPath, file),
          project,
          renamed,
        });
      }
    }

    // const coreFiles = fs.readdirSync(coreOutputPath);
    // for (const file of coreFiles) {
    //   replaceImports({
    //     filePath: path.resolve(coreOutputPath, file),
    //     renamed,
    //   });
    // }

    const clientFiles = fs.readdirSync(clientOutputPath);
    for (const file of clientFiles) {
      replaceImports({
        filePath: path.resolve(clientOutputPath, file),
        header: headerPrefix,
        renamed,
      });
    }
    return renamed;
  }

  const clientSrcPath = path.isAbsolute(plugin.name) ? path.dirname(plugin.name) : undefined;

  // copy custom local client to output
  if (clientSrcPath) {
    const dirPath = path.resolve(outputPath, 'client');
    ensureDirSync(dirPath);
    copyRecursivePnP(clientSrcPath, dirPath);
    return;
  }

  // copy third-party client to output
  const clientModulePath = path.normalize(require.resolve(plugin.name));
  const clientModulePathComponents = clientModulePath.split(path.sep);
  const clientDistPath = clientModulePathComponents
    .slice(0, clientModulePathComponents.indexOf('dist') + 1)
    .join(path.sep);

  const indexJsFile = clientModulePathComponents[clientModulePathComponents.length - 1];
  const distFiles = [indexJsFile!, 'index.d.mts', 'index.d.cts'];
  const dirPath = path.resolve(outputPath, 'client');
  ensureDirSync(dirPath);
  for (const file of distFiles) {
    fs.copyFileSync(path.resolve(clientDistPath, file), path.resolve(dirPath, file));
  }

  return;
}
