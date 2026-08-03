import fs from 'node:fs';
import { styleText } from 'node:util';

import { xSync } from 'tinyexec';

import { ConfigError } from '../../error';

type Output = {
  /**
   * The absolute path to the output folder.
   */
  path: string;
  /**
   * Post-processing commands to run on the output folder, executed in order.
   */
  postProcess: ReadonlyArray<string | UserPostProcessor>;
};

export type UserPostProcessor = {
  /**
   * Arguments to pass to the command. Use `{{path}}` as a placeholder
   * for the output directory path.
   *
   * @example ['format', '--write', '{{path}}']
   */
  args: ReadonlyArray<string>;
  /**
   * The command to run (e.g., 'biome', 'prettier', 'eslint').
   */
  command: string;
  /**
   * Display name for logging. Defaults to the command name.
   */
  name?: string;
};

export type PostProcessor = {
  /**
   * Arguments to pass to the command.
   */
  args: ReadonlyArray<string>;
  /**
   * The command to run.
   */
  command: string;
  /**
   * Display name for logging.
   */
  name: string;
};

export function postprocessOutput(
  config: Output,
  postProcessors: Record<string, PostProcessor>,
  jobPrefix: string,
): void {
  if (!fs.existsSync(config.path) || !fs.readdirSync(config.path).length) {
    return;
  }

  for (const processor of config.postProcess) {
    const resolved = typeof processor === 'string' ? postProcessors[processor] : processor;

    // TODO: show warning
    if (!resolved) continue;

    const name = resolved.name ?? resolved.command;
    const args = resolved.args.map((arg) => arg.replace('{{path}}', config.path));

    console.log(`${jobPrefix}🧹 Running ${styleText('cyanBright', name)}`);
    let result;
    try {
      result = xSync(resolved.command, args);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ConfigError(`Post-processor "${name}" failed to run: ${message}`);
    }

    if (result.exitCode !== undefined && result.exitCode !== 0) {
      let message = `Post-processor "${name}" exited with code ${result.exitCode}`;
      const stderr = result.stderr.trim();
      if (stderr) {
        message += `:\n${stderr}`;
      }
      throw new ConfigError(message);
    }
  }
}
