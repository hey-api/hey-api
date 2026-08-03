import { styleText } from 'node:util';

import { getInput } from '@hey-api/shared';

import type { UserConfig } from './types';

export interface Job {
  config: UserConfig;
  index: number;
}

export function expandToJobs(configs: ReadonlyArray<UserConfig>): ReadonlyArray<Job> {
  const jobs: Array<Job> = [];
  let jobIndex = 0;

  for (const config of configs) {
    const inputs = getInput(config);
    const outputs = config.output instanceof Array ? config.output : [config.output];

    if (outputs.length === 1) {
      jobs.push({
        config: {
          ...config,
          input: inputs,
          output: outputs[0]!, // output array with single item
        },
        index: jobIndex++,
      });
    } else if (outputs.length > 1 && inputs.length !== outputs.length) {
      // Warn and create job per output (all with same inputs)
      console.warn(
        `⚙️ ${styleText('yellow', 'Warning:')} You provided ${styleText('cyan', String(inputs.length))} ${styleText('cyan', inputs.length === 1 ? 'input' : 'inputs')} and ${styleText('yellow', String(outputs.length))} ${styleText('yellow', 'outputs')}. This will produce identical output in multiple locations. You likely want to provide a single output or the same number of outputs as inputs.`,
      );
      for (const output of outputs) {
        jobs.push({
          config: { ...config, input: inputs, output },
          index: jobIndex++,
        });
      }
    } else if (outputs.length > 1) {
      // Pair inputs with outputs by index
      outputs.forEach((output, index) => {
        jobs.push({
          config: { ...config, input: inputs[index]!, output },
          index: jobIndex++,
        });
      });
    }
  }

  return jobs;
}
