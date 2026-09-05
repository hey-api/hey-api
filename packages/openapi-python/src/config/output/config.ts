import path from 'node:path';

import type { PostProcessor } from '@hey-api/shared';
import { coerce, defineConfig, sourceConfig } from '@hey-api/shared';
import type { MaybeArray } from '@hey-api/types';

import { postProcessors } from './postprocess';
import type { Output, UserOutput } from './types';

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

export const outputConfig = defineConfig<UserOutput, Output>({
  $finalize(config) {
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
    suffix: '_gen',
  },
  gitAttributes: true,
  module: {},
  path: '',
  postProcess: coerce((value) => (Array.isArray(value) ? value.map(normalizePostProcessItem) : [])),
  preferExportAll: false,
  pythonVersion: '3.9',
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
