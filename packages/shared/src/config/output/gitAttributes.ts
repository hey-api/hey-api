import fsPromises from 'node:fs/promises';
import path from 'node:path';

import type { SourceConfig } from './source/types';

export type GitAttributesOptions = {
  /** Globs for generated entry files that omit the configured suffix. */
  entryGlobs: ReadonlyArray<string>;
  /** Extension used for emitted generated files (e.g. `.ts`, `.py`). */
  fileExtension: string;
  /** Suffix appended to generated file names (before the extension). */
  fileSuffix: string | null;
  /** Package name shown in the generated comment header. */
  generator: string;
  /** Import-specifier extension from `output.module.extension`. */
  moduleExtension: string | null;
  /** Absolute path to the output folder. */
  outputPath: string;
  source: SourceConfig;
};

export type WriteOutputGitAttributesOptions = {
  dryRun: boolean;
  entryGlobs: ReadonlyArray<string>;
  fileExtension: string;
  fileSuffix: string | null;
  generator: string;
  gitAttributes: boolean;
  moduleExtension: string | null;
  outputPath: string;
  source: SourceConfig;
};

function getSourcePattern(outputPath: string, source: SourceConfig): string | null {
  if (!source.enabled || source.path === null) {
    return null;
  }

  const sourceDir = path.resolve(outputPath, source.path);
  const sourceFile = `${source.fileName}.${source.extension}`;
  const sourcePath = path.resolve(sourceDir, sourceFile);
  const relativePath = path.relative(outputPath, sourcePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return null;
  }

  return relativePath.split(path.sep).join('/');
}

function getGeneratedPatterns(
  fileSuffix: string | null,
  fileExtension: string,
  moduleExtension: string | null,
): ReadonlyArray<string> {
  if (!fileSuffix) {
    return ['** linguist-generated=true -diff'];
  }

  const patterns: Array<string> = [
    `**/*${fileSuffix}${fileExtension} linguist-generated=true -diff`,
  ];
  const moduleExt = moduleExtension ?? '.ts';

  if (fileExtension === '.ts' && (moduleExt === '.js' || moduleExt === '.ts')) {
    patterns.push(`**/*${fileSuffix}.js linguist-generated=true -diff`);
  }

  return patterns;
}

export function renderGitAttributes({
  entryGlobs,
  fileExtension,
  fileSuffix,
  generator,
  moduleExtension,
  outputPath,
  source,
}: GitAttributesOptions): string {
  const lines = [
    `# OpenAPI spec and ${generator} generated client`,
    '.gitattributes -linguist-generated -diff',
  ];

  for (const pattern of getGeneratedPatterns(fileSuffix, fileExtension, moduleExtension)) {
    lines.push(pattern);
  }

  const sourcePattern = getSourcePattern(outputPath, source);
  if (sourcePattern) {
    lines.push(`${sourcePattern} linguist-generated=true`);
  }

  for (const entryGlob of entryGlobs) {
    lines.push(`${entryGlob} linguist-generated=true -diff`);
  }

  return `${lines.join('\n')}\n`;
}

export async function writeOutputGitAttributes({
  dryRun,
  entryGlobs,
  fileExtension,
  fileSuffix,
  generator,
  gitAttributes,
  moduleExtension,
  outputPath,
  source,
}: WriteOutputGitAttributesOptions): Promise<number> {
  if (!gitAttributes) {
    return 0;
  }

  const gitAttributesContent = renderGitAttributes({
    entryGlobs,
    fileExtension,
    fileSuffix,
    generator,
    moduleExtension,
    outputPath,
    source,
  });

  if (!dryRun) {
    await fsPromises.mkdir(outputPath, { recursive: true });
    await fsPromises.writeFile(path.resolve(outputPath, '.gitattributes'), gitAttributesContent, {
      encoding: 'utf8',
    });
  }

  return 1;
}
