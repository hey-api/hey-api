import type {
  Casing,
  DefinePlugin,
  FeatureToggle,
  NameTransformer,
  NamingOptions,
  Plugin,
} from '@hey-api/shared';

import type { PydanticImports } from './imports';
import type { PydanticResolvers } from './resolvers';

export type UserConfig = Plugin.Name<'pydantic'> &
  Plugin.Hooks &
  Plugin.UserComments &
  Plugin.UserExports &
  PydanticResolvers & {
    /**
     * Casing convention for generated names.
     *
     * @default 'PascalCase'
     */
    case?: Casing;
    /**
     * Configuration for reusable schema definitions.
     *
     * Controls generation of shared Pydantic models that can be referenced
     * across requests and responses.
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default true
     */
    definitions?:
      | boolean
      | NameTransformer
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
           * Naming pattern for generated names.
           *
           * @default '{{name}}'
           */
          name?: NameTransformer;
        };
    /**
     * How to generate enum types.
     *
     * - `'enum'`: Generate Python Enum classes (e.g., `class Status(str, Enum): ...`)
     * - `'literal'`: Generate Literal type hints (e.g., `Literal["pending", "active"]`)
     *
     * @default 'enum'
     */
    enums?: 'enum' | 'literal';
    /**
     * Configuration for error-response-specific Pydantic models.
     *
     * Controls generation of Pydantic models for the operation's 4xx and 5xx
     * responses, so a caller can validate an error body against a real model
     * instead of a raw dict.
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default true
     */
    errors?:
      | boolean
      | NameTransformer
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
           * Set to `false` to skip generating error models entirely.
           *
           * @default true
           */
          enabled?: boolean;
          /**
           * Naming pattern for the deduplicated union of an operation's
           * error types.
           *
           * TypeScript also generates a status-code-keyed map (`{{name}}Errors`)
           * alongside this union, but that shape has no Python runtime
           * analogue: as a Pydantic model every status would be a required
           * field, yet a real response only ever carries one status, so no
           * real payload could validate against it. Only this deduplicated
           * union is generated.
           *
           * @default '{{name}}Error'
           */
          error?: NameTransformer;
        };
    /**
     * How to render field constraints.
     *
     * - `'field'`: `foo: Optional[int] = Field(default=None, ge=0, le=100)`
     * - `'annotated'`: `foo: Annotated[Optional[int], Field(ge=0, le=100)] = None`
     *
     * @default 'field'
     */
    fieldStyle?: 'annotated' | 'field';
    /**
     * Model type to generate.
     *
     * - `'BaseModel'`: Pydantic `BaseModel` subclass.
     * - `'dataclass'`: Pydantic `@dataclass` decorator.
     *
     * @default 'BaseModel'
     */
    modelType?: 'BaseModel' | 'dataclass';
    /**
     * Configuration for request-specific Pydantic models.
     *
     * Controls generation of Pydantic models for request bodies,
     * query parameters, path parameters, and headers.
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default true
     */
    requests?:
      | boolean
      | NameTransformer
      | {
          /**
           * Configuration for request body Pydantic models.
           *
           * Can be:
           * - `boolean`: Shorthand for `{ enabled: boolean }`
           * - `string` or `function`: Shorthand for `{ name: string | function }`
           * - `object`: Full configuration object
           *
           * @default true
           */
          body?:
            | boolean
            | NameTransformer
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
                 * Naming pattern for generated names.
                 *
                 * @default '{{name}}Body'
                 */
                name?: NameTransformer;
              };
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
           * Configuration for request headers Pydantic models.
           *
           * Can be:
           * - `boolean`: Shorthand for `{ enabled: boolean }`
           * - `string` or `function`: Shorthand for `{ name: string | function }`
           * - `object`: Full configuration object
           *
           * @default true
           */
          headers?:
            | boolean
            | NameTransformer
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
                 * Naming pattern for generated names.
                 *
                 * @default '{{name}}Headers'
                 */
                name?: NameTransformer;
              };
          /**
           * Naming pattern for generated names.
           *
           * @default '{{name}}Request'
           */
          name?: NameTransformer;
          /**
           * Configuration for request path parameters Pydantic models.
           *
           * Can be:
           * - `boolean`: Shorthand for `{ enabled: boolean }`
           * - `string` or `function`: Shorthand for `{ name: string | function }`
           * - `object`: Full configuration object
           *
           * @default true
           */
          path?:
            | boolean
            | NameTransformer
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
                 * Naming pattern for generated names.
                 *
                 * @default '{{name}}Path'
                 */
                name?: NameTransformer;
              };
          /**
           * Configuration for request query parameters Pydantic models.
           *
           * Can be:
           * - `boolean`: Shorthand for `{ enabled: boolean }`
           * - `string` or `function`: Shorthand for `{ name: string | function }`
           * - `object`: Full configuration object
           *
           * @default true
           */
          query?:
            | boolean
            | NameTransformer
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
                 * Naming pattern for generated names.
                 *
                 * @default '{{name}}Query'
                 */
                name?: NameTransformer;
              };
        };
    /**
     * Configuration for response-specific Pydantic models.
     *
     * Controls generation of Pydantic models for response bodies,
     * error responses, and status codes.
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default true
     */
    responses?:
      | boolean
      | NameTransformer
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
           * Naming pattern for generated names.
           *
           * @default '{{name}}Response'
           */
          name?: NameTransformer;
        };
    /**
     * Enable strict mode for Pydantic models?
     *
     * When enabled, extra fields not defined in the schema will be rejected.
     *
     * This adds `model_config = ConfigDict(extra='forbid')`
     * to generated models.
     *
     * Note: {@link strict} has no effect when `modelType` is `'dataclass'`
     * as `ConfigDict` is not supported for dataclasses.
     *
     * @default false
     */
    strict?: boolean;
    /**
     * Configuration for webhook-specific Pydantic models.
     *
     * Controls generation of Pydantic models for webhook payloads.
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default true
     */
    webhooks?:
      | boolean
      | NameTransformer
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
           * Naming pattern for generated names.
           *
           * @default '{{name}}Webhook'
           */
          name?: NameTransformer;
        };
  };

export type Config = Plugin.Name<'pydantic'> &
  Plugin.Hooks &
  Plugin.Comments &
  Plugin.Exports &
  PydanticResolvers & {
    /** Casing convention for generated names. */
    case: Casing;
    /** Configuration for reusable schema definitions. */
    definitions: NamingOptions & FeatureToggle;
    /** How to generate enum types. */
    enums: 'enum' | 'literal';
    /** Configuration for error-response-specific Pydantic models. */
    errors: FeatureToggle & {
      /** Casing convention for generated names. */
      case: Casing;
      /** Naming pattern for the deduplicated union of an operation's error types. */
      error: NameTransformer;
    };
    /** How to render field constraints. */
    fieldStyle: 'annotated' | 'field';
    /** Model type to generate. */
    modelType: 'BaseModel' | 'dataclass';
    /** Configuration for request-specific Pydantic models. */
    requests: NamingOptions &
      FeatureToggle & {
        /** Configuration for request body Zod schemas. */
        body: NamingOptions & FeatureToggle;
        /** Configuration for request headers Zod schemas. */
        headers: NamingOptions & FeatureToggle;
        /** Configuration for request path parameters Zod schemas. */
        path: NamingOptions & FeatureToggle;
        /** Configuration for request query parameters Zod schemas. */
        query: NamingOptions & FeatureToggle;
      };
    /** Configuration for response-specific Pydantic models. */
    responses: NamingOptions & FeatureToggle;
    /** Enable strict mode for Pydantic models? */
    strict: boolean;
    /** Configuration for webhook-specific Pydantic models. */
    webhooks: NamingOptions & FeatureToggle;
  };

export type PydanticPlugin = DefinePlugin<UserConfig, Config, never, PydanticImports>;
