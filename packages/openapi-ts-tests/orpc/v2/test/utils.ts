import path from 'node:path';

import type { UserConfig } from '@hey-api/openapi-ts';

import { getSpecsPath } from '../../../utils';

export function createConfigFactory({
  openApiVersion,
  outputDir,
}: {
  openApiVersion: string;
  outputDir: string;
}) {
  return (userConfig: UserConfig) => {
    const input = userConfig.input instanceof Array ? userConfig.input[0]! : userConfig.input;
    const inputPath = path.join(
      getSpecsPath(),
      openApiVersion,
      typeof input === 'string' ? input : (input.path as string),
    );
    const output = userConfig.output instanceof Array ? userConfig.output[0]! : userConfig.output;
    const outputPath = typeof output === 'string' ? output : (output?.path ?? '');
    return {
      plugins: ['orpc'],
      ...userConfig,
      input:
        typeof userConfig.input === 'string'
          ? inputPath
          : {
              ...userConfig.input,
              path: inputPath,
            },
      logs: { level: 'silent', path: './logs' },
      output: path.join(outputDir, outputPath),
    } as UserConfig;
  };
}
