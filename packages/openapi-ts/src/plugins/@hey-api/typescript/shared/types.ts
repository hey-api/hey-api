import type { IR } from '@hey-api/shared';

import type { MaybeTsDsl, TypeTsDsl } from '../../../../ts-dsl';

export type Type = MaybeTsDsl<TypeTsDsl>;

/**
 * Metadata that flows through schema walking.
 */
export interface TypeScriptMeta {
  /** Default value from schema. */
  default?: unknown;
  /** Is this schema read-only? */
  readonly: boolean;
}

export interface TypeScriptEnumData {
  items: Array<{ key: string; schema: IR.SchemaObject }>;
  mode: 'javascript' | 'typescript' | 'typescript-const' | 'type';
}

/**
 * Result from walking a schema node.
 */
export interface TypeScriptResult {
  enumData?: TypeScriptEnumData;
  meta: TypeScriptMeta;
  type: Type;
}

/**
 * Finalized result after applyModifiers.
 */
export interface TypeScriptFinal extends Pick<TypeScriptResult, 'enumData' | 'type'> {}
