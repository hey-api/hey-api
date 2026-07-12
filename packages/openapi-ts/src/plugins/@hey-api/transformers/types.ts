import type { IR } from '@hey-api/shared';
import type { DefinePlugin, Plugin } from '@hey-api/shared';

import type { $, DollarTsDsl, MaybeTsDsl } from '../../../ts-dsl';
import type { TransformersImports } from './imports';

interface BaseTransformer extends DollarTsDsl {
  plugin: HeyApiTransformersPlugin['Instance'];
  schema: IR.SchemaObject;
}

export type ExpressionTransformer = (
  ctx: BaseTransformer & {
    /** @deprecated Use `plugin` instead and access the config via `plugin.config` */
    config: Omit<UserConfig, 'name'>;
    dataExpression?: ReturnType<typeof $.attr | typeof $.expr> | string;
  },
) => Array<ReturnType<typeof $.fromValue | typeof $.return>> | undefined;

/**
 * Returns the TypeScript type node for a schema with a specific format.
 * If undefined is returned, the default type will be used.
 */
export type TypeTransformer = (
  ctx: BaseTransformer,
) => MaybeTsDsl<ReturnType<typeof $.type>> | undefined;

export type UserConfig = Plugin.Name<'@hey-api/transformers'> &
  Plugin.Hooks &
  Plugin.UserExports & {
    /**
     * Convert long integers into BigInt values?
     *
     * @default true
     */
    bigInt?: boolean;
    /**
     * Convert date strings into date objects?
     *
     * - `true` (default): use the built-in `Date` object.
     * - `'date'`: explicit alias for the default `Date` behavior.
     * - `'temporal'`: use the [Temporal API](https://tc39.es/proposal-temporal/docs/),
     *   imported from `temporal-polyfill`. `date-time` formats become
     *   `Temporal.Instant` and `date` formats become `Temporal.PlainDate`.
     * - `false`: do not transform date strings.
     *
     * @default true
     */
    dates?: boolean | 'date' | 'temporal';
    /**
     * Custom transforms to apply to the generated code.
     */
    transformers?: ReadonlyArray<ExpressionTransformer>;
    /**
     * Custom type transformers that modify the TypeScript types generated.
     */
    typeTransformers?: ReadonlyArray<TypeTransformer>;
  };

export type Config = Plugin.Name<'@hey-api/transformers'> &
  Plugin.Hooks &
  Plugin.Exports & {
    /**
     * Convert long integers into BigInt values?
     *
     * @default true
     */
    bigInt: boolean;
    /**
     * Convert date strings into date objects?
     *
     * - `true` (default): use the built-in `Date` object.
     * - `'date'`: explicit alias for the default `Date` behavior.
     * - `'temporal'`: use the [Temporal API](https://tc39.es/proposal-temporal/docs/),
     *   imported from `temporal-polyfill`. `date-time` formats become
     *   `Temporal.Instant` and `date` formats become `Temporal.PlainDate`.
     * - `false`: do not transform date strings.
     *
     * @default true
     */
    dates: boolean | 'date' | 'temporal';
    /**
     * Custom transforms to apply to the generated code.
     */
    transformers: ReadonlyArray<ExpressionTransformer>;
    /**
     * Custom type transformers that modify the TypeScript types generated.
     */
    typeTransformers: ReadonlyArray<TypeTransformer>;
  };

export type HeyApiTransformersPlugin = DefinePlugin<UserConfig, Config, never, TransformersImports>;
