import type { GetPointerPriorityFn, MatchPointerToGroupFn } from '../graph';

export const irTopLevelKinds = [
  'operation',
  'parameter',
  'requestBody',
  'schema',
  'server',
  'webhook',
] as const;

export type IrTopLevelKind = (typeof irTopLevelKinds)[number];

const irPatterns: Record<IrTopLevelKind, RegExp> = {
  operation: /^#\/paths\/[^/]+\/(get|put|post|delete|options|head|patch|trace)$/,
  parameter: /^#\/components\/parameters\/[^/]+$/,
  requestBody: /^#\/components\/requestBodies\/[^/]+$/,
  schema: /^#\/components\/schemas\/[^/]+$/,
  server: /^#\/servers\/(\d+|[^/]+)$/,
  webhook: /^#\/webhooks\/[^/]+\/(get|put|post|delete|options|head|patch|trace)$/,
};

// Every pattern in `irPatterns` requires a fixed literal prefix. Checking the
// prefix with `startsWith` first lets us skip the regex entirely for the vast
// majority of pointers (deeply nested leaf nodes — properties, items, etc.)
// that can never match any top-level kind, since this runs once per graph
// node on every walk/priority lookup.
const irPrefixes: ReadonlyArray<readonly [prefix: string, kind: IrTopLevelKind]> = [
  ['#/paths/', 'operation'],
  ['#/components/parameters/', 'parameter'],
  ['#/components/requestBodies/', 'requestBody'],
  ['#/components/schemas/', 'schema'],
  ['#/servers/', 'server'],
  ['#/webhooks/', 'webhook'],
];

/**
 * Checks if a pointer matches a known top-level IR component (schema, parameter, etc) and returns match info.
 *
 * @param pointer - The IR pointer string (e.g., '#/components/schemas/Foo')
 * @param kind - (Optional) The component kind to check
 * @returns { matched: true, kind: IrTopLevelKind } | { matched: false } - Whether it matched, and the matched kind if so
 */
export const matchIrPointerToGroup: MatchPointerToGroupFn<IrTopLevelKind> = (pointer, kind) => {
  if (kind) {
    return irPatterns[kind].test(pointer) ? { kind, matched: true } : { matched: false };
  }
  for (let i = 0, len = irPrefixes.length; i < len; i++) {
    const [prefix, key] = irPrefixes[i]!;
    if (pointer.startsWith(prefix) && irPatterns[key].test(pointer)) {
      return { kind: key, matched: true };
    }
  }
  return { matched: false };
};

// default grouping preference (earlier groups emitted first when safe)
export const preferGroups = [
  'server',
  'schema',
  'parameter',
  'requestBody',
  'operation',
  'webhook',
] satisfies ReadonlyArray<IrTopLevelKind>;

type KindPriority = Record<IrTopLevelKind, number>;

// default group priority (lower = earlier)
// built from `preferGroups` so the priority order stays in sync with the prefer-groups array.
const kindPriority: KindPriority = (() => {
  const partial: Partial<KindPriority> = {};
  for (let i = 0; i < preferGroups.length; i++) {
    const k = preferGroups[i];
    if (k) partial[k] = i;
  }
  // Ensure all known kinds exist in the map (fall back to a high index).
  for (const k of irTopLevelKinds) {
    if (partial[k] === undefined) {
      partial[k] = preferGroups.length;
    }
  }
  return partial as KindPriority;
})();

const defaultPriority = 10;

export const getIrPointerPriority: GetPointerPriorityFn = (pointer) => {
  const result = matchIrPointerToGroup(pointer);
  if (result.matched) {
    return kindPriority[result.kind] ?? defaultPriority;
  }
  return defaultPriority;
};
