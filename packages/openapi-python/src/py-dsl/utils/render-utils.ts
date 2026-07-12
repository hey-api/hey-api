import path from 'node:path';

import type { ExportModule, File, ImportModule } from '@hey-api/codegen-core';

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

export const pythonStdlib = new Set([
  'abc',
  'aifc',
  'antigravity',
  'argparse',
  'array',
  'ast',
  'asynchat',
  'asyncio',
  'asyncore',
  'atexit',
  'audioop',
  'base64',
  'bdb',
  'binascii',
  'binhex',
  'bisect',
  'builtins',
  'bz2',
  'calendar',
  'cgi',
  'cgitb',
  'chunk',
  'cmath',
  'cmd',
  'code',
  'codecs',
  'codeop',
  'collections',
  'colorsys',
  'compileall',
  'concurrent',
  'configparser',
  'contextlib',
  'contextvars',
  'copy',
  'copyreg',
  'cProfile',
  'crypt',
  'csv',
  'ctypes',
  'curses',
  'dataclasses',
  'datetime',
  'dbm',
  'decimal',
  'difflib',
  'dis',
  'distutils',
  'doctest',
  'email',
  'encodings',
  'ensurepip',
  'enum',
  'errno',
  'faulthandler',
  'fcntl',
  'filecmp',
  'fileinput',
  'fnmatch',
  'formatter',
  'fractions',
  'ftplib',
  'functools',
  'gc',
  'genericpath',
  'getopt',
  'getpass',
  'gettext',
  'glob',
  'graphlib',
  'grp',
  'gzip',
  'hashlib',
  'heapq',
  'hmac',
  'html',
  'http',
  'imaplib',
  'imghdr',
  'imp',
  'importlib',
  'inspect',
  'io',
  'ipaddress',
  'itertools',
  'json',
  'keyword',
  'lib2to3',
  'linecache',
  'locale',
  'logging',
  'lzma',
  'mailbox',
  'mailcap',
  'marshal',
  'math',
  'mimetypes',
  'mmap',
  'modulefinder',
  'msilib',
  'msvcrt',
  'multiprocessing',
  'netrc',
  'nis',
  'nntplib',
  'nt',
  'ntpath',
  'nturl2path',
  'numbers',
  'opcode',
  'operator',
  'optparse',
  'os',
  'ossaudiodev',
  'parser',
  'pathlib',
  'pdb',
  'pickle',
  'pickletools',
  'pipes',
  'pkgutil',
  'platform',
  'plistlib',
  'poplib',
  'posix',
  'posixpath',
  'pprint',
  'profile',
  'pstats',
  'pty',
  'pwd',
  'py_compile',
  'pyclbr',
  'pydoc_data',
  'pydoc',
  'pyexpat',
  'queue',
  'quopri',
  'random',
  're',
  'readline',
  'reprlib',
  'resource',
  'rlcompleter',
  'runpy',
  'sched',
  'secrets',
  'select',
  'selectors',
  'shelve',
  'shlex',
  'shutil',
  'signal',
  'site',
  'smtpd',
  'smtplib',
  'sndhdr',
  'socket',
  'socketserver',
  'spwd',
  'sqlite3',
  'sre_compile',
  'sre_constants',
  'sre_parse',
  'ssl',
  'stat',
  'statistics',
  'string',
  'stringprep',
  'struct',
  'subprocess',
  'sunau',
  'symbol',
  'symtable',
  'sys',
  'sysconfig',
  'syslog',
  'tabnanny',
  'tarfile',
  'telnetlib',
  'tempfile',
  'termios',
  'textwrap',
  'this',
  'threading',
  'time',
  'timeit',
  'tkinter',
  'token',
  'tokenize',
  'tomllib',
  'trace',
  'traceback',
  'tracemalloc',
  'tty',
  'turtle',
  'types',
  'typing',
  'unicodedata',
  'unittest',
  'urllib',
  'uu',
  'uuid',
  'venv',
  'warnings',
  'wave',
  'weakref',
  'webbrowser',
  'winreg',
  'winsound',
  'wsgiref',
  'xdrlib',
  'xml',
  'xmlrpc',
  'zipapp',
  'zipfile',
  'zipimport',
  'zlib',
  'zoneinfo',
]);

export function moduleSortKey({
  file,
  fromFile,
  root,
}: {
  file: Pick<File, 'finalPath'>;
  fromFile: Pick<File, 'finalPath' | 'extension' | 'external' | 'name'>;
  preferFileExtension: string;
  root: string;
}): SortKey {
  const filePath = file.finalPath!.split(path.sep).join('/');
  let modulePath = fromFile.finalPath!.split(path.sep).join('/');

  if (fromFile.external && !path.isAbsolute(modulePath)) {
    // __future__
    if (modulePath === '__future__') {
      return [0, 0, modulePath];
    }

    // stdlib
    const topLevel = modulePath.split('.')[0]!;
    if (pythonStdlib.has(topLevel)) {
      return [1, 0, modulePath];
    }

    // third-party
    return [2, 0, modulePath];
  }

  // outside project root
  if (!modulePath.startsWith(root.split(path.sep).join('/'))) {
    return [3, 0, modulePath];
  }

  // local
  const rel = path
    .relative(path.dirname(filePath), path.dirname(modulePath))
    .split(path.sep)
    .join('/');

  const segments = rel ? rel.split('/') : [];
  const parentCount = segments.filter((s) => s === '..').length;

  const leadingDots = '.'.repeat(parentCount + 1);

  const pathSegments = segments.filter((s) => s !== '..' && s !== '.');

  const filename = modulePath.split('/').at(-1)!;
  // TODO: replace with extension check, there's an issue with external files
  // not having extension set
  const moduleName = filename.replace(/\.[^.]+$/, '');
  // const moduleName = fromFile.extension
  //   ? filename.slice(0, -fromFile.extension.length)
  //   : filename;

  // index/__init__ are implicit
  const isImplicitModule = moduleName === 'index' || moduleName === '__init__';
  if (!isImplicitModule) {
    pathSegments.push(moduleName);
  }

  modulePath = pathSegments.length ? leadingDots + pathSegments.join('.') : leadingDots;

  return [4, parentCount, modulePath];
}
