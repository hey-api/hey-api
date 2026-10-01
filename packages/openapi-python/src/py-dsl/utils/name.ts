import { regexp } from './regexp';
import type { ReservedList } from './reserved';
import { reserved } from './reserved';

export function safeAccessorName(name: string): string {
  regexp.number.lastIndex = 0;
  if (regexp.number.test(name)) {
    return name.startsWith('-') ? `'${name}'` : name;
  }

  regexp.pythonIdentifier.lastIndex = 0;
  if (regexp.pythonIdentifier.test(name)) {
    return name;
  }
  return `'${name}'`;
}

const validPythonChar = /^[a-zA-Z0-9_]$/;

function safeName(name: string, reserved: ReservedList): string {
  let sanitized = '';
  let index: number;

  const first = name[0] ?? '';
  regexp.illegalStartCharacters.lastIndex = 0;
  if (regexp.illegalStartCharacters.test(first)) {
    // Check if character becomes valid when not in leading position (e.g., digits)
    if (validPythonChar.test(first)) {
      sanitized += '_';
      index = 0;
    } else {
      sanitized += '_';
      index = 1;
    }
  } else {
    sanitized += first;
    index = 1;
  }

  while (index < name.length) {
    const char = name[index] ?? '';
    sanitized += validPythonChar.test(char) ? char : '_';
    index += 1;
  }

  if (reserved['~values'].has(sanitized)) {
    sanitized = `${sanitized}_`;
  }

  return sanitized || '_';
}

export function safeRuntimeName(name: string): string {
  return safeName(name, reserved.runtime);
}

export function safeKeywordName(name: string): string {
  return safeName(name, reserved.keywords);
}

/**
 * A name Pydantic accepts as a field.
 *
 * Pydantic reserves a leading underscore for a private attribute and raises
 * `NameError` while the class body executes, which aborts the import of the
 * whole module. `safeKeywordName` prefixes an underscore when a name cannot
 * start with its first character, such as a wire name beginning with a digit,
 * so a field needs a prefix Pydantic accepts instead.
 */
export function safeFieldName(name: string): string {
  const safe = safeKeywordName(name);
  return safe.startsWith('_') ? `field${safe}` : safe;
}
