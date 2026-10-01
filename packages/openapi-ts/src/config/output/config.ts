import path from 'node:path';

import { log } from '@hey-api/codegen-core';
import type { PostProcessor, UserPostProcessor } from '@hey-api/shared';
import { coerce, defineConfig, findTsConfigPath, sourceConfig } from '@hey-api/shared';
import type { MaybeArray } from '@hey-api/types';
import type { TsConfigJsonResolved } from 'get-tsconfig';
import { parseTsconfig } from 'get-tsconfig';

import { postProcessors } from './postprocess';
import type { Output, UserOutput } from './types';

function resolveLegacyPostProcess(input: UserOutput): ReadonlyArray<UserPostProcessor> {
  const result: Array<UserPostProcessor> = [];

  if (input.lint !== undefined) {
    let processor: PostProcessor | undefined;
    let preset: keyof typeof postProcessors | undefined;
    if (input.lint) {
      preset = input.lint === 'biome' ? 'biome:lint' : input.lint;
      processor = postProcessors[preset];
      if (processor) result.push(processor);
    }

    log.warnDeprecated({
      context: 'output',
      field: 'lint',
      replacement: `postProcess: [${processor && preset ? `'${preset}'` : ''}]`,
    });
  }

  if (input.format !== undefined) {
    let processor: PostProcessor | undefined;
    let preset: keyof typeof postProcessors | undefined;
    if (input.format) {
      preset = input.format === 'biome' ? 'biome:format' : input.format;
      processor = postProcessors[preset];
      if (processor) result.push(processor);
    }

    log.warnDeprecated({
      context: 'output',
      field: 'format',
      replacement: `postProcess: [${processor && preset ? `'${preset}'` : ''}]`,
    });
  }

  return result;
}

function normalizePostProcessItem(
  item: NonNullable<UserOutput['postProcess']>[number],
): PostProcessor {
  if (typeof item === 'string') {
    const preset = postProcessors[item];
    if (!preset) {
      throw new Error(`Unknown post-processor preset: "${item}"`);
    }
    return preset;
  }
  return {
    name: item.name ?? item.command,
    ...item,
  };
}

function loadTsConfig(configPath: string | null): TsConfigJsonResolved | null {
  if (!configPath) {
    return null;
  }
  try {
    return parseTsconfig(configPath);
  } catch {
    throw new Error(`Couldn't read tsconfig from path: ${configPath}`);
  }
}

export const outputConfig = defineConfig<UserOutput, Output>({
  $finalize(config, input) {
    if (input.importFileExtension !== undefined) {
      config.module.extension = input.importFileExtension;
    }
    if (input.resolveModuleName !== undefined) {
      config.module.resolve = input.resolveModuleName;
    }

    if (!config.postProcess.length) {
      const legacyPostProcess = resolveLegacyPostProcess(input);
      if (legacyPostProcess.length) {
        config.postProcess = legacyPostProcess.map(normalizePostProcessItem);
      }
    }

    config.tsConfig = loadTsConfig(findTsConfigPath(import.meta.dirname, config.tsConfigPath));
    if (
      config.module.extension === undefined &&
      (config.tsConfig?.compilerOptions?.moduleResolution === 'nodenext' ||
        config.tsConfig?.compilerOptions?.moduleResolution === 'NodeNext' ||
        config.tsConfig?.compilerOptions?.moduleResolution === 'node16' ||
        config.tsConfig?.compilerOptions?.moduleResolution === 'Node16' ||
        config.tsConfig?.compilerOptions?.module === 'nodenext' ||
        config.tsConfig?.compilerOptions?.module === 'NodeNext' ||
        config.tsConfig?.compilerOptions?.module === 'node16' ||
        config.tsConfig?.compilerOptions?.module === 'Node16')
    ) {
      config.module.extension = '.js';
    }

    if (config.module.extension && !config.module.extension.startsWith('.')) {
      config.module.extension = `.${config.module.extension}`;
    }

    config.path = path.resolve(process.cwd(), config.path);
  },
  clean: true,
  entryFile: true,
  fileName: {
    $coerce: {
      function: (name) => ({ name }),
      string: (name) => ({ name }),
    },
    case: 'preserve',
    name: '{{name}}',
    suffix: '.gen',
  },
  gitAttributes: true,
  module: {},
  path: '',
  postProcess: coerce((value) => (Array.isArray(value) ? value.map(normalizePostProcessItem) : [])),
  preferExportAll: false,
  source: sourceConfig,
});

export function getOutput(input: { output: MaybeArray<string | UserOutput> }): Output {
  if (Array.isArray(input.output)) {
    throw new Error(
      'Unexpected array of outputs in user configuration. This should have been expanded already.',
    );
  }

  const output = input.output as string | UserOutput;
  const userOutput = typeof output === 'string' ? { path: output } : output;

  return outputConfig(userOutput);
}
