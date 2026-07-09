import path from 'node:path';
import { pathToFileURL } from 'node:url';

import type { createClient as createClientType } from '../index';

type OpenApiTsPackage = {
  createClient: typeof createClientType;
};

async function importBuiltPackage(): Promise<OpenApiTsPackage> {
  const entry = pathToFileURL(path.join(process.cwd(), 'dist', 'index.mjs'));

  return import(entry.href) as Promise<OpenApiTsPackage>;
}

describe('TypeScript 7 compatibility', () => {
  it('runs from the built package when TypeScript no longer exports compiler APIs', async () => {
    const typescript = (await import('typescript')) as unknown as Record<string, unknown>;

    expect(String(typescript.versionMajorMinor)).toMatch(/^7\./);
    expect(typescript.SyntaxKind).toBeUndefined();
    expect(typescript.factory).toBeUndefined();

    // TypeScript 7 keeps the old AST surface out of the package root, so this
    // catches regressions where the published package imports that API at runtime.
    const { createClient } = await importBuiltPackage();
    const results = await createClient({
      dryRun: true,
      input: {
        info: {
          title: 'typescript-7-compatibility-test',
          version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {},
      },
      logs: {
        level: 'silent',
      },
      output: 'output',
      plugins: ['@hey-api/typescript'],
    });

    expect(results).toHaveLength(1);
  });
});
