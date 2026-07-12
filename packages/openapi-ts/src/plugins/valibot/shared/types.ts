import type { IR } from '@hey-api/shared';

import type { ValibotPlugin } from '../types';
import type { Pipes } from './pipes';

export type ValidatorArgs = {
  operation: IR.OperationObject;
  /** The plugin instance. */
  plugin: ValibotPlugin['Instance'];
};

/**
 * Metadata that flows through schema walking.
 */
export interface ValibotMeta {
  /** Default value from schema. */
  default?: unknown;
  /** Original format (for BigInt coercion). */
  format?: string;
  /** Whether this or any child contains a lazy reference. */
  hasLazy: boolean;
  /** Does this schema explicitly allow null? */
  nullable: boolean;
  /** Is this schema read-only? */
  readonly: boolean;
}

/**
 * Result from walking a schema node.
 */
export interface ValibotResult {
  meta: ValibotMeta;
  pipes: Pipes;
}

/**
 * Finalized result after applyModifiers.
 */
export interface ValibotFinal extends Pick<ValibotResult, 'pipes'> {
  /** Type annotation for schemas requiring explicit typing (e.g., lazy). */
  typeName?: string;
}

/**
 * Result from composite handlers that walk children.
 */
export interface CompositeHandlerResult {
  childResults: Array<ValibotResult>;
  pipes: Pipes;
}
