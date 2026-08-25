import type { NameConflictResolver, RenderContext, Symbol } from '@hey-api/codegen-core';
import type { AnyString, MaybeArray } from '@hey-api/types';

import type { Plugin } from '../plugins/types';
import type { Logs } from '../types/logs';
import type { Casing, NameTransformer } from '../utils/naming/types';
import type { Input, UserInput, UserWatch } from './input/types';
import type { PostProcessor } from './output/postprocess';
import type { SourceConfig, UserSourceConfig } from './output/source/types';
import type { OutputHeader } from './output/types';
import type { Parser, UserParser } from './parser/types';
import type { Preset } from './presets';

export type FeatureToggle = {
  /**
   * Whether this feature is enabled.
   */
  enabled: boolean;
};

export type UserIndexExportOption = {
  /**
   * Whether exports should be re-exported from the entry file.
   *
   * - `true` — include all exports
   * - `false` — exclude all exports
   * - `(symbol) => boolean` — include exports matching the predicate
   *
   * @default false
   * @deprecated use `includeInEntry` instead
   */
  exportFromIndex?: boolean | ((symbol: Symbol) => boolean);
  /**
   * Whether exports should be re-exported from the entry file.
   *
   * - `true` — include all exports
   * - `false` — exclude all exports
   * - `(symbol) => boolean` — include exports matching the predicate
   *
   * @default false
   */
  includeInEntry?: boolean | ((symbol: Symbol) => boolean);
};
export type IndexExportOption = {
  /**
   * Whether exports should be re-exported from the entry file.
   *
   * @deprecated use `includeInEntry` instead
   */
  exportFromIndex: boolean | ((symbol: Symbol) => boolean);
  /**
   * Whether exports should be re-exported from the entry file.
   */
  includeInEntry: boolean | ((symbol: Symbol) => boolean);
};

export type CommentsStyle = 'default' | 'compact';

export type UserCommentsOption = {
  /**
   * Whether to add comments to the generated code.
   *
   * @default true
   */
  comments?: boolean;
  /**
   * The style of the comments.
   *
   * @default 'default'
   */
  commentsStyle?: CommentsStyle;
};
export type CommentsOption = {
  /**
   * Whether to add comments to the generated code.
   */
  comments: boolean;
  /**
   * The style of the comments.
   */
  commentsStyle: CommentsStyle;
};

export type NamingOptions = {
  /**
   * Casing convention for generated names.
   */
  case: Casing;
  /**
   * Naming pattern for generated names.
   */
  name: NameTransformer;
};

/**
 * Base output shape all packages must satisfy.
 */
export interface BaseUserOutput<TModuleExtension extends string = string> {
  /**
   * Defines casing of the output fields. By default, we preserve `input`
   * values as data transforms incur a performance penalty at runtime.
   *
   * @default undefined
   */
  case?: Casing;
  /**
   * Clean the `output` folder on every run? If disabled, this folder may
   * be used to store additional files. The default option is `true` to
   * reduce the risk of keeping outdated files around when configuration,
   * input, or package version changes.
   *
   * @default true
   */
  clean?: boolean;
  /**
   * Whether to generate an entry file that re-exports symbols for convenient imports.
   *
   * Plugins control their inclusion via `includeInEntry`.
   *
   * @default true
   */
  entryFile?: boolean;
  /**
   * Optional function to transform file names before they are used.
   *
   * @param name The original file name.
   * @returns The transformed file name.
   * @default '{{name}}'
   */
  fileName?:
    | NameTransformer
    | {
        /**
         * Casing convention for generated names.
         *
         * @default 'preserve'
         */
        case?: Casing;
        /**
         * Naming pattern for generated names.
         *
         * @default '{{name}}'
         */
        name?: NameTransformer;
        /**
         * Suffix to append to file names (before the extension). For example,
         * with a suffix of `.gen`, `example.ts` becomes `example.gen.ts`.
         *
         * @default '.gen'
         * @example
         * // Given a suffix of `.gen`
         * 'index.ts' -> 'index.ts' (index files are not renamed)
         * 'user.ts' -> 'user.gen.ts'
         * 'order.gen.ts' -> 'order.gen.ts' (files already containing the suffix are not renamed)
         */
        suffix?: string | null;
      };
  /**
   * Text to include at the top of every generated file.
   */
  header?: OutputHeader;
  /**
   * Whether to generate an entry file that re-exports symbols for convenient imports.
   *
   * Plugins control their inclusion via `includeInEntry`.
   *
   * @default true
   * @deprecated use `entryFile` instead
   */
  indexFile?: boolean;
  /**
   * Options for module specifier resolution.
   */
  module?: {
    /**
     * If specified, this will be the extension used when importing other
     * modules. By default, we don't add an extension unless we detect that
     * you're using a module resolution strategy that requires one.
     *
     * @default undefined
     */
    extension?: TModuleExtension | AnyString | null;
    /**
     * Function to transform module specifiers.
     *
     * @default undefined
     */
    resolve?: ResolveModuleFn;
  };
  /**
   * Optional name conflict resolver to customize how naming conflicts
   * are handled.
   */
  nameConflictResolver?: NameConflictResolver;
  /**
   * The absolute path to the output folder.
   */
  path: string;
  /**
   * Optional function to transform module specifiers.
   *
   * @default undefined
   * @deprecated use `module.resolve` instead
   */
  resolveModuleName?: ResolveModuleFn;
  /**
   * Configuration for generating a copy of the input source used to produce this output.
   *
   * Set to `false` to skip generating the source, or `true` to use defaults.
   *
   * You can also provide a configuration object to further customize behavior.
   *
   * @default false
   */
  source?: boolean | UserSourceConfig;
}

/**
 * Base output shape all packages must satisfy.
 */
export interface BaseOutput<TModuleExtension extends string = string> {
  /**
   * Defines casing of the output fields. By default, we preserve `input`
   * values as data transforms incur a performance penalty at runtime.
   */
  case: Casing | undefined;
  /**
   * Clean the `output` folder on every run? If disabled, this folder may
   * be used to store additional files. The default option is `true` to
   * reduce the risk of keeping outdated files around when configuration,
   * input, or package version changes.
   */
  clean: boolean;
  /** Whether to generate an entry file that re-exports symbols for convenient imports. */
  entryFile: boolean;
  /**
   * Optional function to transform file names before they are used.
   *
   * @param name The original file name.
   * @returns The transformed file name.
   */
  fileName: NamingOptions & {
    /**
     * Suffix to append to file names (before the extension). For example,
     * with a suffix of `.gen`, `example.ts` becomes `example.gen.ts`.
     *
     * @example
     * // Given a suffix of `.gen`
     * 'index.ts' -> 'index.ts' (index files are not renamed)
     * 'user.ts' -> 'user.gen.ts'
     * 'order.gen.ts' -> 'order.gen.ts' (files already containing the suffix are not renamed)
     */
    suffix: string | null;
  };
  /** Text to include at the top of every generated file. */
  header: OutputHeader;
  /**
   * Whether to generate an entry file that re-exports symbols for convenient imports.
   *
   * @deprecated use `entryFile` instead
   */
  indexFile: boolean;
  /** Options for module specifier resolution. */
  module: {
    /** The extension used when importing other modules. */
    extension: TModuleExtension | AnyString | null;
    /** Function to transform module specifiers. */
    resolve: ResolveModuleFn | undefined;
  };
  /** Name conflict resolver to customize how naming conflicts are handled. */
  nameConflictResolver: NameConflictResolver | undefined;
  /** The absolute path to the output folder. */
  path: string;
  /** Post-processing commands to run on the output folder, executed in order. */
  postProcess: ReadonlyArray<PostProcessor>;
  /** Configuration for generating a copy of the input source used to produce this output. */
  source: SourceConfig;
}

/**
 * Core configuration shared across all packages.
 */
export type BaseUserConfig<TOutput extends BaseUserOutput> = {
  /**
   * Path to the config file. Set this value if you don't use the default
   * config file name, or it's not located in the project root.
   *
   * @default undefined
   */
  configFile?: string;
  /**
   * Skip writing files to disk?
   *
   * @default false
   */
  dryRun?: boolean;
  /**
   * Path to the OpenAPI specification. This can be:
   *   - path
   *   - URL
   *   - API registry shorthand
   *
   * Both JSON and YAML file formats are supported. You can also pass the parsed
   * object directly if you're fetching the file yourself.
   *
   * Alternatively, you can define a configuration object with more options.
   *
   * If you define an array, we will generate a single output from multiple
   * inputs. If you define an array of outputs with the same length, we will
   * generate multiple outputs, one for each input.
   */
  input: MaybeArray<UserInput | Required<UserInput>['path']>;
  /**
   * Show an interactive error reporting tool when the program crashes? You
   * generally want to keep this disabled (default).
   *
   * @default false
   */
  interactive?: boolean;
  /**
   * The relative location of the logs folder.
   *
   * @default process.cwd()
   */
  logs?: string | Logs;
  /**
   * Path to the output folder.
   *
   * If you define an array of outputs with the same length as inputs, we will
   * generate multiple outputs, one for each input.
   */
  output: MaybeArray<string | TOutput>;
  /**
   * Customize how the input is parsed and transformed before it's passed to
   * plugins.
   *
   * @default undefined
   */
  parser?: UserParser;
  /**
   * Configuration presets.
   *
   * @default []
   */
  presets?: ReadonlyArray<Preset>;
  /**
   * @deprecated use `input.watch` instead
   */
  watch?: UserWatch;
};

/**
 * Core configuration shared across all packages.
 */
export type BaseConfig<TUserConfig extends object, TOutput extends BaseOutput> = Omit<
  Required<TUserConfig>,
  'input' | 'logs' | 'output' | 'parser' | 'plugins' | 'watch'
> & {
  /**
   * Path to the input specification.
   */
  input: ReadonlyArray<Input>;
  logs: Logs;
  /**
   * Path to the output folder.
   */
  output: TOutput;
  /**
   * Customize how the input is parsed and transformed before it's passed to
   * plugins.
   */
  parser: Parser;
  // Loose types - packages override via intersection
  pluginOrder: ReadonlyArray<string>;
  plugins: Record<string, Plugin.Config<Plugin.Types> | undefined>;
};

/**
 * For shared utilities that operate on any config.
 */
export type AnyConfig = BaseConfig<Record<string, unknown>, BaseOutput>;

/**
 * Function to transform module specifiers.
 */
export type ResolveModuleFn = (path: string, ctx: RenderContext) => string | undefined;
