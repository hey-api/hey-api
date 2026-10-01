import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { renderGitAttributes, writeOutputGitAttributes } from '../gitAttributes';
import { sourceConfig } from '../source/config';

describe('writeOutputGitAttributes', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitattributes-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { force: true, recursive: true });
  });

  it('returns 0 when gitAttributes is disabled', async () => {
    await expect(
      writeOutputGitAttributes({
        dryRun: false,
        entryGlobs: ['**/index.ts'],
        fileExtension: '.ts',
        fileSuffix: '.gen',
        generator: '@hey-api/openapi-ts',
        gitAttributes: false,
        moduleExtension: '.ts',
        outputPath: tmpDir,
        source: sourceConfig({ enabled: false }),
      }),
    ).resolves.toBe(0);
    expect(fs.existsSync(path.join(tmpDir, '.gitattributes'))).toBe(false);
  });

  it('does not write a file during dry run', async () => {
    await expect(
      writeOutputGitAttributes({
        dryRun: true,
        entryGlobs: ['**/index.ts'],
        fileExtension: '.ts',
        fileSuffix: '.gen',
        generator: '@hey-api/openapi-ts',
        gitAttributes: true,
        moduleExtension: '.ts',
        outputPath: tmpDir,
        source: sourceConfig({ enabled: false }),
      }),
    ).resolves.toBe(1);
    expect(fs.existsSync(path.join(tmpDir, '.gitattributes'))).toBe(false);
  });

  it('writes a gitattributes file to the output folder', async () => {
    await expect(
      writeOutputGitAttributes({
        dryRun: false,
        entryGlobs: ['**/index.ts'],
        fileExtension: '.ts',
        fileSuffix: '.gen',
        generator: '@hey-api/openapi-ts',
        gitAttributes: true,
        moduleExtension: '.ts',
        outputPath: tmpDir,
        source: sourceConfig({ enabled: false }),
      }),
    ).resolves.toBe(1);

    expect(fs.readFileSync(path.join(tmpDir, '.gitattributes'), 'utf8')).toBe(
      renderGitAttributes({
        entryGlobs: ['**/index.ts'],
        fileExtension: '.ts',
        fileSuffix: '.gen',
        generator: '@hey-api/openapi-ts',
        moduleExtension: '.ts',
        outputPath: tmpDir,
        source: sourceConfig({ enabled: false }),
      }),
    );
  });

  it('creates the output folder when it does not exist', async () => {
    const nestedOutputPath = path.join(tmpDir, 'nested', 'client');

    await expect(
      writeOutputGitAttributes({
        dryRun: false,
        entryGlobs: ['**/index.ts'],
        fileExtension: '.ts',
        fileSuffix: '.gen',
        generator: '@hey-api/openapi-ts',
        gitAttributes: true,
        moduleExtension: '.ts',
        outputPath: nestedOutputPath,
        source: sourceConfig({ enabled: false }),
      }),
    ).resolves.toBe(1);

    expect(fs.existsSync(path.join(nestedOutputPath, '.gitattributes'))).toBe(true);
  });
});

describe('renderGitAttributes', () => {
  const outputPath = path.resolve('/project/src/api');
  const tsEntryGlobs = ['**/index.ts', '**/index.js'] as const;

  it('marks generated TypeScript output without a source file', () => {
    expect(
      renderGitAttributes({
        entryGlobs: tsEntryGlobs,
        fileExtension: '.ts',
        fileSuffix: '.gen',
        generator: '@hey-api/openapi-ts',
        moduleExtension: '.ts',
        outputPath,
        source: sourceConfig({ enabled: false }),
      }),
    ).toBe(`# OpenAPI spec and @hey-api/openapi-ts generated client
.gitattributes -linguist-generated -diff
**/*.gen.ts linguist-generated=true -diff
**/*.gen.js linguist-generated=true -diff
**/index.ts linguist-generated=true -diff
**/index.js linguist-generated=true -diff
`);
  });

  it('marks emitted TypeScript files when import specifiers use .js', () => {
    expect(
      renderGitAttributes({
        entryGlobs: tsEntryGlobs,
        fileExtension: '.ts',
        fileSuffix: '.gen',
        generator: '@hey-api/openapi-ts',
        moduleExtension: '.js',
        outputPath,
        source: sourceConfig({ enabled: false }),
      }),
    ).toBe(`# OpenAPI spec and @hey-api/openapi-ts generated client
.gitattributes -linguist-generated -diff
**/*.gen.ts linguist-generated=true -diff
**/*.gen.js linguist-generated=true -diff
**/index.ts linguist-generated=true -diff
**/index.js linguist-generated=true -diff
`);
  });

  it('includes a source file in the output folder', () => {
    expect(
      renderGitAttributes({
        entryGlobs: tsEntryGlobs,
        fileExtension: '.ts',
        fileSuffix: '.gen',
        generator: '@hey-api/openapi-ts',
        moduleExtension: '.ts',
        outputPath,
        source: sourceConfig({
          enabled: true,
          extension: 'json',
          fileName: 'openapi',
        }),
      }),
    ).toBe(`# OpenAPI spec and @hey-api/openapi-ts generated client
.gitattributes -linguist-generated -diff
**/*.gen.ts linguist-generated=true -diff
**/*.gen.js linguist-generated=true -diff
openapi.json linguist-generated=true
**/index.ts linguist-generated=true -diff
**/index.js linguist-generated=true -diff
`);
  });

  it('marks generated Python output', () => {
    expect(
      renderGitAttributes({
        entryGlobs: ['**/__init__.py'],
        fileExtension: '.py',
        fileSuffix: '_gen',
        generator: '@hey-api/openapi-python',
        moduleExtension: '.py',
        outputPath,
        source: sourceConfig({ enabled: false }),
      }),
    ).toBe(`# OpenAPI spec and @hey-api/openapi-python generated client
.gitattributes -linguist-generated -diff
**/*_gen.py linguist-generated=true -diff
**/__init__.py linguist-generated=true -diff
`);
  });

  it('includes a nested source file relative to the output folder', () => {
    expect(
      renderGitAttributes({
        entryGlobs: ['**/__init__.py'],
        fileExtension: '.py',
        fileSuffix: '_gen',
        generator: '@hey-api/openapi-python',
        moduleExtension: '.py',
        outputPath,
        source: sourceConfig({
          enabled: true,
          extension: 'json',
          fileName: 'openapi',
          path: 'spec',
        }),
      }),
    ).toBe(`# OpenAPI spec and @hey-api/openapi-python generated client
.gitattributes -linguist-generated -diff
**/*_gen.py linguist-generated=true -diff
spec/openapi.json linguist-generated=true
**/__init__.py linguist-generated=true -diff
`);
  });

  it('falls back to all files when the suffix is disabled', () => {
    expect(
      renderGitAttributes({
        entryGlobs: tsEntryGlobs,
        fileExtension: '.ts',
        fileSuffix: null,
        generator: '@hey-api/openapi-ts',
        moduleExtension: '.ts',
        outputPath,
        source: sourceConfig({ enabled: false }),
      }),
    ).toBe(`# OpenAPI spec and @hey-api/openapi-ts generated client
.gitattributes -linguist-generated -diff
** linguist-generated=true -diff
**/index.ts linguist-generated=true -diff
**/index.js linguist-generated=true -diff
`);
  });

  it('keeps the source file visible when the suffix is disabled', () => {
    expect(
      renderGitAttributes({
        entryGlobs: tsEntryGlobs,
        fileExtension: '.ts',
        fileSuffix: null,
        generator: '@hey-api/openapi-ts',
        moduleExtension: '.ts',
        outputPath,
        source: sourceConfig({
          enabled: true,
          extension: 'json',
          fileName: 'openapi',
        }),
      }),
    ).toBe(`# OpenAPI spec and @hey-api/openapi-ts generated client
.gitattributes -linguist-generated -diff
** linguist-generated=true -diff
openapi.json linguist-generated=true
**/index.ts linguist-generated=true -diff
**/index.js linguist-generated=true -diff
`);
  });

  it('skips source files written outside the output folder', () => {
    expect(
      renderGitAttributes({
        entryGlobs: tsEntryGlobs,
        fileExtension: '.ts',
        fileSuffix: '.gen',
        generator: '@hey-api/openapi-ts',
        moduleExtension: '.ts',
        outputPath,
        source: sourceConfig({
          enabled: true,
          extension: 'json',
          fileName: 'openapi',
          path: '../',
        }),
      }),
    ).toBe(`# OpenAPI spec and @hey-api/openapi-ts generated client
.gitattributes -linguist-generated -diff
**/*.gen.ts linguist-generated=true -diff
**/*.gen.js linguist-generated=true -diff
**/index.ts linguist-generated=true -diff
**/index.js linguist-generated=true -diff
`);
  });
});
