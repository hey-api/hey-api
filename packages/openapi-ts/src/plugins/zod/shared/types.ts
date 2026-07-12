import type { FeatureToggle, IR, NamingOptions } from '@hey-api/shared';

import type { ZodPlugin } from '../types';
import type { Chain } from './chain';

export type ValidatorArgs = {
  operation: IR.OperationObject;
  /** The plugin instance. */
  plugin: ZodPlugin['Instance'];
};

export type TypeOptions = {
  types: {
    infer: NamingOptions & FeatureToggle;
    input: NamingOptions & FeatureToggle;
    output: NamingOptions & FeatureToggle;
  };
};

/**
 * Metadata that flows through schema walking.
 */
export interface ZodMeta {
  /** Default value from schema. */
  default?: unknown;
  /** Original format (for BigInt coercion). */
  format?: string;
  /** Whether this or any child contains a lazy reference. */
  hasLazy: boolean;
  /** Whether this schema generates a ZodIntersection (e.g. via allOf). */
  isIntersection: boolean;
  /** Whether this schema itself is emitted as lazy. */
  isLazy: boolean;
  /** Whether this schema resolves to an object shape. */
  isObject?: boolean;
  /** Does this schema explicitly allow null? */
  nullable: boolean;
  /** Is this schema read-only? */
  readonly: boolean;
}

/**
 * Result from walking a schema node.
 */
export interface ZodResult {
  chain: Chain;
  meta: ZodMeta;
}

/**
 * Finalized result after applyModifiers.
 */
export interface ZodFinal extends Pick<ZodResult, 'chain'> {
  /** Type annotation for schemas requiring explicit typing (e.g., lazy). */
  typeName?: string;
}

/**
 * Result from composite handlers that walk children.
 */
export interface CompositeHandlerResult extends Pick<ZodResult, 'chain'> {
  childResults: Array<ZodResult>;
}
