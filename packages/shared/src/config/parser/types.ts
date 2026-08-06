import type { Hooks } from '../../parser/hooks';
import type { Casing, NameTransformer } from '../../utils/naming/types';
import type { FeatureToggle, NamingOptions } from '../shared';
import type { Filters } from './filters';
import type { Patch } from './patch';

export type EnumsMode = 'inline' | 'root';

/**
 * Ordered media type preference. Entries are matched in order against the
 * available media types; the first match wins. Strings match the media type
 * exactly, ignoring parameters such as `; charset=utf-8` and casing. Regular
 * expressions are tested against the full media type. When nothing matches,
 * we fall back to the default behavior: prefer JSON, then the first defined
 * media type.
 */
export type ContentPreference = ReadonlyArray<string | RegExp>;

export type UserParser = {
  /**
   * Configuration for handling `content` maps with multiple media types.
   */
  content?: {
    /**
     * Controls which media type is selected when an input defines multiple
     * `content` entries.
     *
     * Can be:
     * - `array`: Shorthand applying to parameters, requests, and responses
     * - `object`: Per-context configuration
     *
     * @default undefined
     */
    preferred?:
      | ContentPreference
      | {
          /**
           * Preference for `parameter.content` selection.
           */
          parameters?: ContentPreference;
          /**
           * Preference for request body selection.
           */
          requests?: ContentPreference;
          /**
           * Preference for response selection.
           */
          responses?: ContentPreference;
        };
  };
  /**
   * Filters can be used to select a subset of your input before it's passed
   * to plugins.
   */
  filters?: Filters;
  /**
   * Optional hooks to override default plugin behavior.
   *
   * Use these to classify resources, control which outputs are generated,
   * or provide custom behavior for specific resources.
   */
  hooks?: Hooks;
  /**
   * Pagination configuration.
   */
  pagination?: {
    /**
     * Array of keywords to be considered as pagination field names.
     * These will be used to detect pagination fields in schemas and parameters.
     *
     * @default ['after', 'before', 'cursor', 'offset', 'page', 'start']
     */
    keywords?: ReadonlyArray<string>;
  };
  /**
   * Custom input transformations to execute before parsing. Use this
   * to modify, fix, or enhance input before it's passed to plugins.
   */
  patch?: Patch;
  /**
   * Built-in transformations that modify or normalize the input before it's
   * passed to plugins. These options enable predictable, documented behaviors
   * and are distinct from custom patches. Use this to perform structural
   * changes to input in a standardized way.
   */
  transforms?: {
    /**
     * Your input might contain two types of enums:
     * - enums defined as reusable components (root enums)
     * - non-reusable enums nested within other schemas (inline enums)
     *
     * You may want all enums to be reusable. This is because only root enums
     * are typically exported by plugins. Inline enums will never be directly
     * importable since they're nested inside other schemas.
     *
     * For example, to export nested enum types with the `@hey-api/typescript`
     * plugin, set `enums` to `root`. Likewise, if you don't want to export any
     * enum types, set `enums` to `inline`.
     *
     * @default false
     */
    enums?:
      | boolean
      | EnumsMode
      | {
          /**
           * Casing convention for generated names.
           *
           * @default 'PascalCase'
           */
          case?: Casing;
          /**
           * Whether this feature is enabled.
           *
           * @default true
           */
          enabled?: boolean;
          /**
           * Controls whether enums are promoted to reusable root components
           * ('root') or kept inline within schemas ('inline').
           *
           * @default 'root'
           */
          mode?: EnumsMode;
          /**
           * Customize the generated name of enums.
           *
           * @default '{{name}}Enum'
           */
          name?: NameTransformer;
        };
    /**
     * By default, any object schema with a missing `required` keyword is
     * interpreted as "no properties are required." This is the correct
     * behavior according to the OpenAPI standard. However, some specifications
     * interpret a missing `required` keyword as "all properties should be
     * required."
     *
     * This option allows you to change the default behavior so that
     * properties are required by default unless explicitly marked as optional.
     *
     * @default false
     */
    propertiesRequiredByDefault?: boolean;
    /**
     * Your schemas might contain read-only or write-only fields. Using such
     * schemas directly could mean asking the user to provide a read-only
     * field in requests, or expecting a write-only field in responses.
     *
     * We separate schemas for requests and responses if direct usage
     * would result in such scenarios. You can still disable this
     * behavior if you prefer.
     *
     * @default true
     */
    readWrite?:
      | boolean
      | {
          /**
           * Whether this feature is enabled.
           *
           * @default true
           */
          enabled?: boolean;
          /**
           * Configuration for generated request-specific schemas.
           *
           * Can be:
           * - `string` or `function`: Shorthand for `{ name: string | function }`
           * - `object`: Full configuration object
           *
           * @default '{{name}}Writable'
           */
          requests?:
            | NameTransformer
            | {
                /**
                 * Casing convention for generated names.
                 *
                 * @default 'preserve'
                 */
                case?: Casing;
                /**
                 * Customize the generated name of schemas used in requests or
                 * containing write-only fields.
                 *
                 * @default '{{name}}Writable'
                 */
                name?: NameTransformer;
              };
          /**
           * Configuration for generated response-specific schemas.
           *
           * Can be:
           * - `string` or `function`: Shorthand for `{ name: string | function }`
           * - `object`: Full configuration object
           *
           * @default '{{name}}'
           */
          responses?:
            | NameTransformer
            | {
                /**
                 * Casing convention for generated names.
                 *
                 * @default 'preserve'
                 */
                case?: Casing;
                /**
                 * Customize the generated name of schemas used in responses or
                 * containing read-only fields. We default to the original name
                 * to avoid breaking output when a read-only field is added.
                 *
                 * @default '{{name}}'
                 */
                name?: NameTransformer;
              };
        };
    /**
     * Sometimes your schema names are auto-generated or follow a naming convention
     * that produces verbose or awkward type names. You can rename schema component
     * keys throughout the specification, automatically updating all `$ref` pointers.
     *
     * @example
     * ```ts
     * {
     *   schemaName: (name) => name.replace(/_v\d+_\d+_\d+_/, '_')
     * }
     * ```
     *
     * @default undefined
     */
    schemaName?: NameTransformer;
  };
  /**
   * **This is an experimental feature.**
   *
   * Validate the input before generating output? This is an experimental,
   * lightweight feature and support will be added on an ad hoc basis. Setting
   * `validate_EXPERIMENTAL` to `true` is the same as `warn`.
   *
   * @default false
   */
  validate_EXPERIMENTAL?: boolean | 'strict' | 'warn';
};

export type Parser = {
  /**
   * Configuration for handling `content` maps with multiple media types.
   */
  content: {
    /**
     * Controls which media type is selected when an input defines multiple
     * `content` entries.
     */
    preferred: {
      /**
       * Preference for `parameter.content` selection.
       */
      parameters?: ContentPreference;
      /**
       * Preference for request body selection.
       */
      requests?: ContentPreference;
      /**
       * Preference for response selection.
       */
      responses?: ContentPreference;
    };
  };
  /**
   * Filters can be used to select a subset of your input before it's passed
   * to plugins.
   */
  filters?: Filters;
  /**
   * Optional hooks to override default plugin behavior.
   *
   * Use these to classify resources, control which outputs are generated,
   * or provide custom behavior for specific resources.
   */
  hooks: Hooks;
  /**
   * Pagination configuration.
   */
  pagination: {
    /**
     * Array of keywords to be considered as pagination field names.
     * These will be used to detect pagination fields in schemas and parameters.
     *
     * @default ['after', 'before', 'cursor', 'offset', 'page', 'start']
     */
    keywords: ReadonlyArray<string>;
  };
  /**
   * Custom input transformations to execute before parsing. Use this
   * to modify, fix, or enhance input before it's passed to plugins.
   */
  patch?: Patch;
  /**
   * Built-in transformations that modify or normalize the input before it's
   * passed to plugins. These options enable predictable, documented behaviors
   * and are distinct from custom patches. Use this to perform structural
   * changes to input in a standardized way.
   */
  transforms: {
    /**
     * Your input might contain two types of enums:
     * - enums defined as reusable components (root enums)
     * - non-reusable enums nested within other schemas (inline enums)
     *
     * You may want all enums to be reusable. This is because only root enums
     * are typically exported by plugins. Inline enums will never be directly
     * importable since they're nested inside other schemas.
     *
     * For example, to export nested enum types with the `@hey-api/typescript`
     * plugin, set `enums` to `root`. Likewise, if you don't want to export any
     * enum types, set `enums` to `inline`.
     */
    enums: NamingOptions &
      FeatureToggle & {
        /**
         * Controls whether enums are promoted to reusable root components
         * ('root') or kept inline within schemas ('inline').
         *
         * @default 'root'
         */
        mode: EnumsMode;
      };
    /**
     * By default, any object schema with a missing `required` keyword is
     * interpreted as "no properties are required." This is the correct
     * behavior according to the OpenAPI standard. However, some specifications
     * interpret a missing `required` keyword as "all properties should be
     * required."
     *
     * This option allows you to change the default behavior so that
     * properties are required by default unless explicitly marked as optional.
     *
     * @default false
     */
    propertiesRequiredByDefault: boolean;
    /**
     * Your schemas might contain read-only or write-only fields. Using such
     * schemas directly could mean asking the user to provide a read-only
     * field in requests, or expecting a write-only field in responses.
     *
     * We separate schemas for requests and responses if direct usage
     * would result in such scenarios. You can still disable this
     * behavior if you prefer.
     */
    readWrite: FeatureToggle & {
      /**
       * Configuration for generated request-specific schemas.
       */
      requests: NamingOptions;
      /**
       * Configuration for generated response-specific schemas.
       */
      responses: NamingOptions;
    };
    /**
     * Rename schema component keys and automatically update all `$ref` pointers
     * throughout the specification.
     *
     * @default undefined
     */
    schemaName?: NameTransformer;
  };
  /**
   * **This is an experimental feature.**
   *
   * Validate the input before generating output? This is an experimental,
   * lightweight feature and support will be added on an ad hoc basis. Setting
   * `validate_EXPERIMENTAL` to `true` is the same as `warn`.
   *
   * @default false
   */
  validate_EXPERIMENTAL: false | 'strict' | 'warn';
};
