import type { Language } from './languages/types';

/**
 * Arbitrary project metadata.
 *
 * Implementers should extend this interface for their own needs.
 */
export interface IProjectMeta extends Partial<Record<Language, unknown>> {}

/**
 * Arbitrary symbol metadata.
 *
 * Implementers should extend this interface for their own needs.
 */
export interface ISymbolMeta {
  [key: string]: unknown;
}
