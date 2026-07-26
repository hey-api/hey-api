import { styleText } from 'node:util';

import type { MaybeArray, MaybeFunc } from '@hey-api/types';

type Format = Parameters<typeof styleText>[0];

const DEBUG_NAMESPACE = 'heyapi';

const NO_WARNINGS = /^(1|true|yes|on)$/i.test(process.env.HEYAPI_DISABLE_WARNINGS ?? '');

const DebugGroups = {
  analyzer: 'greenBright',
  dsl: 'cyanBright',
  file: 'yellowBright',
  registry: 'blueBright',
  symbol: 'magentaBright',
} as const satisfies Record<string, Format>;

const WarnGroups = {
  deprecated: 'magentaBright',
} as const satisfies Record<string, Format>;

let cachedDebugGroups: Set<string> | undefined;
function getDebugGroups(): Set<string> {
  if (cachedDebugGroups) return cachedDebugGroups;

  const value = process.env.DEBUG;
  cachedDebugGroups = new Set(value ? value.split(',').map((x) => x.trim().toLowerCase()) : []);

  return cachedDebugGroups;
}

/**
 * Tracks which deprecations have been shown to avoid spam.
 */
const shownDeprecations = new Set<string>();

function debug(message: string, group: keyof typeof DebugGroups) {
  const groups = getDebugGroups();
  if (
    !(
      groups.has('*') ||
      groups.has(`${DEBUG_NAMESPACE}:*`) ||
      groups.has(`${DEBUG_NAMESPACE}:${group}`) ||
      groups.has(group)
    )
  ) {
    return;
  }

  const format = DebugGroups[group] ?? 'whiteBright';
  const prefix = styleText(format, `${DEBUG_NAMESPACE}:${group}`);

  console.debug(`${prefix} ${message}`);
}

function warn(message: string, group?: keyof typeof WarnGroups) {
  if (NO_WARNINGS) return;

  const format = group ? WarnGroups[group] : 'yellowBright';

  console.warn(styleText(format, `${message}`));
}

function warnDeprecated({
  context,
  field,
  replacement,
}: {
  context?: string;
  field: string;
  replacement?: MaybeFunc<(field: string) => MaybeArray<string>>;
}) {
  const key = context
    ? `${context}:${field}:${JSON.stringify(replacement)}`
    : `${field}:${JSON.stringify(replacement)}`;

  if (shownDeprecations.has(key)) return;
  shownDeprecations.add(key);

  let message = `\`${field}\` is deprecated.`;

  if (replacement) {
    const reps = typeof replacement === 'function' ? replacement(field) : replacement;
    const repArray = reps instanceof Array ? reps : [reps];
    const repString = repArray.map((r) => `\`${r}\``).join(' or ');
    message += ` Use ${repString} instead.`;
  }

  const prefix = context ? `[${context}] ` : '';
  warn(`${prefix}${message}`, 'deprecated');
}

export const log = {
  debug,
  warn,
  warnDeprecated,
};
