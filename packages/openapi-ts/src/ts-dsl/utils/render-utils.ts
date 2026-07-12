import path from 'node:path';

import type { ExportModule, File, ImportModule } from '@hey-api/codegen-core';

export const nodeBuiltins = new Set([
  'buffer',
  'child_process',
  'cluster',
  'console',
  'constants',
  'crypto',
  'dgram',
  'dns',
  'domain',
  'events',
  'freelist',
  'fs',
  'http',
  'https',
  'module',
  'net',
  'os',
  'path',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'timers',
  'tls',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'worker_threads',
  'zlib',
]);

export type SortGroup = number;
export type SortDistance = number;
export type SortModule = string;
export type SortKey = [SortGroup, SortDistance, SortModule];

export type ModuleExport = Omit<ExportModule, 'from'> & {
  /** Module specifier for re-exports, e.g., `./foo`. */
  modulePath: string;
};

export type ModuleImport = Omit<ImportModule, 'from'> & {
  /** Module specifier for imports, e.g., `./foo`. */
  modulePath: string;
};

export function moduleSortKey({
  file,
  fromFile,
  preferFileExtension,
  root,
}: {
  file: Pick<File, 'finalPath'>;
  fromFile: Pick<File, 'finalPath' | 'extension' | 'external' | 'name'>;
  preferFileExtension: string;
  root: string;
}): SortKey {
  const filePath = file.finalPath!.split(path.sep).join('/');
  let modulePath = fromFile.finalPath!.split(path.sep).join('/');

  // built-ins
  // TODO: based on nodeBuiltins set

  // external
  if (fromFile.external && !path.isAbsolute(modulePath)) {
    return [0, 0, modulePath];
  }

  // outside project root
  if (!modulePath.startsWith(root.split(path.sep).join('/'))) {
    return [1, 0, modulePath];
  }

  // local
  const rel = path
    .relative(path.dirname(filePath), path.dirname(modulePath))
    .split(path.sep)
    .join('/');

  let parentCount: number;
  // same folder
  if (!rel.startsWith('..')) {
    modulePath = `./${rel ? `${rel}/` : ''}${fromFile.name}${fromFile.extension ?? ''}`;
    parentCount = 0;
  } else {
    modulePath = `${rel}/${fromFile.name}${fromFile.extension ?? ''}`;
    parentCount = rel.split(path.sep).filter((segment) => segment === '..').length;
  }

  if (modulePath.endsWith('.ts')) {
    modulePath = modulePath.slice(0, -'.ts'.length);
  }
  if (preferFileExtension) {
    modulePath += preferFileExtension;
  } else if (modulePath.endsWith('/index')) {
    modulePath = modulePath.slice(0, -'/index'.length);
  }

  return [2, parentCount, modulePath];
}
