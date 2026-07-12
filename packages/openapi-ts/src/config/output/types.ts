import type { BaseOutput, BaseUserOutput, UserPostProcessor } from '@hey-api/shared';
import type { AnyString } from '@hey-api/types';
import type { TsConfigJsonResolved } from 'get-tsconfig';

import type { UserPrinter } from '../../ts-dsl';
import type { Formatters, Linters, PostProcessorPreset } from './postprocess';

export type UserOutput = BaseUserOutput<'.js' | '.ts'> & {
  /**
   * Which formatter to use to process output folder?
   *
   * @default null
   * @deprecated Use `postProcess` instead.
   */
  format?: Formatters | null;
  /**
   * If specified, this will be the file extension used when importing
   * other modules. By default, we don't add a file extension and let the
   * runtime resolve it. If you're using moduleResolution `nodenext` or
   * `node16`, we default to `.js`.
   *
   * @default undefined
   * @deprecated Use `module.extension` instead.
   */
  importFileExtension?: '.js' | '.ts' | AnyString | null;
  /**
   * Which linter to use to process output folder?
   *
   * @default null
   * @deprecated Use `postProcess` instead.
   */
  lint?: Linters | null;
  /**
   * Post-processing commands to run on the output folder, executed in order.
   *
   * Use preset strings for common tools, or provide custom configurations.
   *
   * @example ['biome:lint', 'prettier']
   * @example [{ command: 'dprint', args: ['fmt', '{{path}}'] }]
   * @example ['eslint', { command: 'prettier', args: ['{{path}}', '--write'] }]
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
   * Relative or absolute path to the tsconfig file we should use to
   * generate the output. If a path to tsconfig file is not provided, we
   * attempt to find one starting from the location of the
   * `@hey-api/openapi-ts` configuration file and traversing up.
   *
   * @default undefined
   */
  tsConfigPath?: AnyString | null;
};

export type Output = BaseOutput<'.js' | '.ts'> & {
  /**
   * Whether `export * from 'module'` should be used when possible
   * instead of named exports.
   */
  preferExportAll: boolean;
  /** Options to configure the printer used to render output files. */
  printer: UserPrinter;
  /** The parsed TypeScript configuration used to generate the output. */
  tsConfig: TsConfigJsonResolved | null;
  /** Path to the tsconfig file we should use to generate the output. */
  tsConfigPath: AnyString | null | undefined;
};
