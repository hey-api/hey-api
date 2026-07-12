import type { BaseOutput, BaseUserOutput, UserPostProcessor } from '@hey-api/shared';

import type { UserPrinter } from '../../py-dsl';
import type { PostProcessorPreset } from './postprocess';

export type PythonVersion = '3.9' | '3.10' | '3.11' | '3.12' | '3.13' | '3.14';

export type UserOutput = BaseUserOutput<'.py'> & {
  /**
   * Post-processing commands to run on the output folder, executed in order.
   *
   * Use preset strings for common tools, or provide custom configurations.
   *
   * @example ['ruff:lint', 'ruff:format']
   * @example [{ command: 'flake8', args: ['{{path}}'] }]
   *
   * @default []
   */
  postProcess?: ReadonlyArray<PostProcessorPreset | UserPostProcessor>;
  /**
   * Whether `export * from 'module'` should be used when possible
   * instead of named exports.
   *
   * @default false
   */
  preferExportAll?: boolean;
  /**
   * Options to configure the printer used to render output files.
   * Accepts a static value, or a function of the render context
   * for dynamically resolved configuration.
   *
   * @default undefined
   */
  printer?: UserPrinter;
  /**
   * Minimum Python version to target.
   *
   * @default '3.9'
   */
  pythonVersion?: PythonVersion;
};

export type Output = BaseOutput<'.py'> & {
  /**
   * Whether `export * from 'module'` should be used when possible
   * instead of named exports.
   */
  preferExportAll: boolean;
  /** Options to configure the printer used to render output files. */
  printer: UserPrinter;
  /** Minimum Python version to target. */
  pythonVersion: PythonVersion;
};
