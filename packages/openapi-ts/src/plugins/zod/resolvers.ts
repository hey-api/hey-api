import type { Symbol } from '@hey-api/codegen-core';
import type {
  IR,
  Plugin,
  RequestSchemaContext,
  ResolvedRequestValidatorLayer,
  SchemaVisitorContext,
  SchemaWithType,
  Walker,
} from '@hey-api/shared';
import type { MaybeArray } from '@hey-api/types';

import type { $, DollarTsDsl } from '../../ts-dsl';
import type { MaybeBigInt, ShouldCoerceToBigInt } from '../shared/utils/coerce';
import type { GetIntegerLimit } from '../shared/utils/formats';
import type { Chain, ChainResult } from './shared/chain';
import type { ZodFinal, ZodResult } from './shared/types';
import type { ZodPlugin } from './types';

export type ZodResolvers = Plugin.Resolvers<{
  /**
   * Resolver for array schemas.
   *
   * Allows customization of how array types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  array?: (ctx: ArrayResolverContext) => ChainResult;
  /**
   * Resolver for boolean schemas.
   *
   * Allows customization of how boolean types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  boolean?: (ctx: BooleanResolverContext) => ChainResult;
  /**
   * Resolver for enum schemas.
   *
   * Allows customization of how enum types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  enum?: (ctx: EnumResolverContext) => ChainResult;
  /**
   * Resolver for intersection schemas.
   *
   * Allows customization of how intersection types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  intersection?: (ctx: IntersectionResolverContext) => ChainResult;
  /**
   * Resolver for never schemas.
   *
   * Allows customization of how never types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  never?: (ctx: NeverResolverContext) => ChainResult;
  /**
   * Resolver for null schemas.
   *
   * Allows customization of how null types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  null?: (ctx: NullResolverContext) => ChainResult;
  /**
   * Resolver for number schemas.
   *
   * Allows customization of how number types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  number?: (ctx: NumberResolverContext) => ChainResult;
  /**
   * Resolver for object schemas.
   *
   * Allows customization of how object types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  object?: (ctx: ObjectResolverContext) => ChainResult;
  /**
   * Resolver for string schemas.
   *
   * Allows customization of how string types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  string?: (ctx: StringResolverContext) => ChainResult;
  /**
   * Resolver for tuple schemas.
   *
   * Allows customization of how tuple types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  tuple?: (ctx: TupleResolverContext) => ChainResult;
  /**
   * Resolver for undefined schemas.
   *
   * Allows customization of how undefined types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  undefined?: (ctx: UndefinedResolverContext) => ChainResult;
  /**
   * Resolver for union schemas.
   *
   * Allows customization of how union types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  union?: (ctx: UnionResolverContext) => ChainResult;
  /**
   * Resolver for unknown schemas.
   *
   * Allows customization of how unknown types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  unknown?: (ctx: UnknownResolverContext) => ChainResult;
  /**
   * Resolvers for request and response validators.
   *
   * Allow customization of validator function bodies.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  validator?:
    | ((ctx: ValidatorResolverContext) => MaybeArray<ReturnType<typeof $.stmt>> | null | undefined)
    | {
        /**
         * Controls how the request validator function body is generated.
         *
         * Returning `undefined` will execute the default resolver logic.
         */
        request?: (
          ctx: RequestValidatorResolverContext,
        ) => MaybeArray<ReturnType<typeof $.stmt>> | null | undefined;
        /**
         * Controls how the response validator function body is generated.
         *
         * Returning `undefined` will execute the default resolver logic.
         */
        response?: (
          ctx: ResponseValidatorResolverContext,
        ) => MaybeArray<ReturnType<typeof $.stmt>> | null | undefined;
      };
  /**
   * Resolver for void schemas.
   *
   * Allows customization of how void types are rendered.
   *
   * Returning `undefined` will execute the default resolver logic.
   */
  void?: (ctx: VoidResolverContext) => ChainResult;
}>;

export interface BaseContext extends DollarTsDsl, SchemaVisitorContext<ZodPlugin['Instance']> {
  /**
   * Functions for working with chains.
   */
  chain: {
    /**
     * The current chain.
     *
     * In Zod, this represents a chain of method calls being assembled
     * to form a schema definition (e.g., `z.string().min(1).max(10)`).
     *
     * Each method can be extended, modified, or replaced to customize
     * the resulting schema.
     */
    current: Chain;
  };
  /**
   * Provides access to commonly used symbols within the plugin.
   */
  symbols: {
    /**
     * @deprecated The `z` symbol is now available via `plugin.imports.z` and should be accessed from there.
     */
    z: Symbol;
  };
}

export interface ArrayResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base array expression (z.array(...)).
       */
      base: (ctx: ArrayResolverContext) => Chain;
      /**
       * Returns a length constraint (when minItems === maxItems), if applicable.
       */
      length: (ctx: ArrayResolverContext) => ChainResult;
      /**
       * Returns a maxItems constraint, if applicable.
       */
      maxLength: (ctx: ArrayResolverContext) => ChainResult;
      /**
       * Returns a minItems constraint, if applicable.
       */
      minLength: (ctx: ArrayResolverContext) => ChainResult;
    }> {
  applyModifiers: (result: ZodResult, opts?: { optional?: boolean }) => ZodFinal;
  /**
   * Child results from processing array items.
   */
  childResults: Array<ZodResult>;
  schema: SchemaWithType<'array'>;
  walk: Walker<ZodResult, ZodPlugin['Instance']>;
}

export interface BooleanResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base boolean expression (z.boolean()).
       */
      base: (ctx: BooleanResolverContext) => Chain;
      /**
       * Returns a literal expression for the const value, if present.
       */
      const: (ctx: BooleanResolverContext) => ChainResult;
    }> {
  schema: SchemaWithType<'boolean'>;
}

export interface EnumResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base enum expression (z.enum([...]) or z.union([...])).
       */
      base: (ctx: EnumResolverContext) => Chain;
      /**
       * Returns parsed enum items with metadata about the enum members.
       */
      items: (ctx: EnumResolverContext) => {
        /**
         * String literal nodes for each string-typed enum member.
         */
        enumMembers: Array<ReturnType<typeof $.literal>>;
        /**
         * Chain nodes for each enum member.
         */
        literalSchemas: Array<Chain>;
      };
    }> {
  schema: SchemaWithType<'enum'>;
}

export interface IntersectionResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base intersection expression.
       */
      base: (ctx: IntersectionResolverContext) => Chain;
    }> {
  childResults: Array<ZodResult>;
  parentSchema: IR.SchemaObject;
  schema: IR.SchemaObject;
  schemas: ReadonlyArray<IR.SchemaObject>;
}

export interface NeverResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base never expression (z.never()).
       */
      base: (ctx: NeverResolverContext) => Chain;
    }> {
  schema: SchemaWithType<'never'>;
}

export interface NullResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base null expression (z.null()).
       */
      base: (ctx: NullResolverContext) => Chain;
    }> {
  schema: SchemaWithType<'null'>;
}

export interface NumberResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base number expression (z.number() or z.coerce.number()).
       */
      base: (ctx: NumberResolverContext) => Chain;
      /**
       * Returns a literal expression for the const value, if present.
       */
      const: (ctx: NumberResolverContext) => ChainResult;
      /**
       * Returns the maximum value constraint.
       */
      max: (ctx: NumberResolverContext) => ChainResult;
      /**
       * Returns the minimum value constraint.
       */
      min: (ctx: NumberResolverContext) => ChainResult;
    }> {
  schema: SchemaWithType<'integer' | 'number'>;
  /**
   * Utility functions for number schema processing.
   */
  utils: {
    getIntegerLimit: GetIntegerLimit;
    maybeBigInt: MaybeBigInt;
    shouldCoerceToBigInt: ShouldCoerceToBigInt;
  };
}

export interface ObjectResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the additional properties expression, if any.
       */
      additionalProperties: (ctx: ObjectResolverContext) => Chain | null | undefined;
      /**
       * Returns the base object expression (z.object({...}) or z.record(...)).
       */
      base: (ctx: ObjectResolverContext) => Chain;
      /**
       * Returns the object shape (property definitions).
       */
      shape: (ctx: ObjectResolverContext) => ReturnType<typeof $.object>;
    }> {
  /**
   * Child results from processing object properties.
   * Used for metadata composition.
   */
  _childResults: Array<ZodResult>;
  applyModifiers: (result: ZodResult, opts: { optional?: boolean }) => ZodFinal;
  schema: SchemaWithType<'object'>;
  walk: Walker<ZodResult, ZodPlugin['Instance']>;
}

export interface StringResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base string expression (z.string()).
       */
      base: (ctx: StringResolverContext) => Chain;
      /**
       * Returns a literal expression for the const value, if present.
       */
      const: (ctx: StringResolverContext) => ChainResult;
      /**
       * Returns a format validation expression, if applicable.
       */
      format: (ctx: StringResolverContext) => ChainResult;
      /**
       * Returns a length constraint (when min === max), if applicable.
       */
      length: (ctx: StringResolverContext) => ChainResult;
      /**
       * Returns a maxLength constraint, if applicable.
       */
      maxLength: (ctx: StringResolverContext) => ChainResult;
      /**
       * Returns a minLength constraint, if applicable.
       */
      minLength: (ctx: StringResolverContext) => ChainResult;
      /**
       * Returns a pattern (regex) constraint, if applicable.
       */
      pattern: (ctx: StringResolverContext) => ChainResult;
    }> {
  schema: SchemaWithType<'string'>;
}

export interface TupleResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base tuple expression (z.tuple([...])).
       */
      base: (ctx: TupleResolverContext) => Chain;
      /**
       * Returns a literal expression for the const value, if present.
       */
      const: (ctx: TupleResolverContext) => ChainResult;
    }> {
  applyModifiers: (result: ZodResult, opts?: { optional?: boolean }) => ZodFinal;
  childResults: Array<ZodResult>;
  schema: SchemaWithType<'tuple'>;
  walk: Walker<ZodResult, ZodPlugin['Instance']>;
}

export interface UndefinedResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base undefined expression (z.undefined()).
       */
      base: (ctx: UndefinedResolverContext) => Chain;
    }> {
  schema: SchemaWithType<'undefined'>;
}

export interface UnionResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base union expression.
       */
      base: (ctx: UnionResolverContext) => Chain;
    }> {
  childResults: Array<ZodResult>;
  parentSchema: IR.SchemaObject;
  schema: IR.SchemaObject;
  schemas: ReadonlyArray<IR.SchemaObject>;
}

export interface UnknownResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base unknown expression (z.unknown()).
       */
      base: (ctx: UnknownResolverContext) => Chain;
    }> {
  schema: SchemaWithType<'unknown'>;
}

export interface RequestValidatorResolverContext
  extends
    BaseContext,
    RequestSchemaContext<ZodPlugin['Instance']>,
    Plugin.ResolverNodes<{
      /**
       * Returns the composite schema combining all layers.
       *
       * Returns `undefined` if all layers are omitted.
       */
      composite: (ctx: RequestValidatorResolverContext) => Chain | undefined;
      /**
       * Returns an empty/fallback schema for a layer based on its `whenEmpty` config.
       *
       * @throws if `whenEmpty` is `'omit'` (no schema should be generated)
       */
      empty: (
        ctx: RequestValidatorResolverContext & {
          /** Resolved configuration for the request layer. */
          layer: ResolvedRequestValidatorLayer;
        },
      ) => Chain;
      /**
       * Returns an optional schema based on the layer's config.
       */
      optional: (
        ctx: RequestValidatorResolverContext & {
          /** Resolved configuration for the request layer. */
          layer: ResolvedRequestValidatorLayer;
          /** The schema to conditionally wrap. */
          schema: Chain;
        },
      ) => Chain;
    }> {
  /**
   * Provides access to commonly used symbols within the plugin.
   */
  symbols: BaseContext['symbols'] & {
    /**
     * The schema to use in the validator body.
     *
     * This is either:
     * - an inline AST expression
     * - a Symbol reference to a named export
     */
    schema: Symbol | Chain;
  };
}

export interface ResponseValidatorResolverContext extends BaseContext {
  /** The operation being processed. */
  operation: IR.OperationObject;
  /**
   * Provides access to commonly used symbols within the plugin.
   */
  symbols: BaseContext['symbols'] & {
    /**
     * The response schema symbol.
     */
    schema: Symbol;
  };
}

export type ValidatorResolverContext =
  | RequestValidatorResolverContext
  | ResponseValidatorResolverContext;

export interface VoidResolverContext
  extends
    BaseContext,
    Plugin.ResolverNodes<{
      /**
       * Returns the base void expression (z.void()).
       */
      base: (ctx: VoidResolverContext) => Chain;
    }> {
  schema: SchemaWithType<'void'>;
}
