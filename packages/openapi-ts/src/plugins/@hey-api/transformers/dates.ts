import type { Config } from './types';

export type ResolvedDates = {
  /** Whether date transformation is enabled. */
  enabled: boolean;
  /** Whether to import the `temporal-polyfill` (true) or use the global `Temporal` (false). */
  polyfill: boolean;
  /** Which date API to target. */
  type: 'date' | 'temporal';
};

/**
 * Normalizes the various `dates` config shapes into a single resolved object.
 */
export function resolveDates(dates: Config['dates'] | undefined): ResolvedDates {
  if (!dates) {
    return { enabled: false, polyfill: true, type: 'date' };
  }

  if (dates === true || dates === 'date') {
    return { enabled: true, polyfill: true, type: 'date' };
  }

  if (dates === 'temporal') {
    return { enabled: true, polyfill: true, type: 'temporal' };
  }

  return {
    enabled: true,
    polyfill: dates.polyfill ?? true,
    type: dates.type,
  };
}
