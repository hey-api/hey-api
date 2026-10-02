import type { Casing, NamingConfig, NamingRule } from './types';

const uppercaseRegExp = /[\p{Lu}]/u;
const lowercaseRegExp = /[\p{Ll}]/u;
const identifierRegExp = /([\p{Alpha}\p{N}_]|$)/u;
const separatorsRegExp = /[_.$+:\- `\\[\](){}\\/']+/;

const leadingSeparatorsRegExp = new RegExp(`^${separatorsRegExp.source}`);
const separatorsAndIdentifierRegExp = new RegExp(
  `${separatorsRegExp.source}${identifierRegExp.source}`,
  'gu',
);
const numbersAndIdentifierRegExp = new RegExp(`\\d+${identifierRegExp.source}`, 'gu');

const preserveCase = (value: string, casing: Casing) => {
  let isLastCharLower = false;
  let isLastCharUpper = false;
  let isLastLastCharUpper = false;
  let isLastLastCharPreserved = false;

  const separator = casing === 'snake_case' || casing === 'SCREAMING_SNAKE_CASE' ? '_' : '-';

  for (let index = 0; index < value.length; index++) {
    const character = value[index]!;
    isLastLastCharPreserved = index > 2 ? value[index - 3] === separator : true;

    let nextIndex = index + 1;
    let nextCharacter = value[nextIndex];
    separatorsRegExp.lastIndex = 0;
    while (nextCharacter && separatorsRegExp.test(nextCharacter)) {
      nextIndex += 1;
      nextCharacter = value[nextIndex];
    }
    const isSeparatorBeforeNextCharacter = nextIndex !== index + 1;

    lowercaseRegExp.lastIndex = 0;
    uppercaseRegExp.lastIndex = 0;
    if (
      uppercaseRegExp.test(character) &&
      (isLastCharLower ||
        (nextCharacter &&
          !isSeparatorBeforeNextCharacter &&
          nextCharacter !== 's' &&
          lowercaseRegExp.test(nextCharacter)))
    ) {
      // insert separator behind character
      value = `${value.slice(0, index)}${separator}${value.slice(index)}`;
      index++;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharLower = false;
      isLastCharUpper = true;
    } else if (
      isLastCharUpper &&
      isLastLastCharUpper &&
      lowercaseRegExp.test(character) &&
      !isLastLastCharPreserved &&
      // naive detection of plurals
      !(
        character === 's' &&
        (!nextCharacter || nextCharacter.toLocaleLowerCase() !== nextCharacter)
      )
    ) {
      // insert separator 2 characters behind
      value = `${value.slice(0, index - 1)}${separator}${value.slice(index - 1)}`;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharLower = true;
      isLastCharUpper = false;
    } else {
      const characterLower = character.toLocaleLowerCase();
      const characterUpper = character.toLocaleUpperCase();
      isLastLastCharUpper = isLastCharUpper;
      isLastCharLower = characterLower === character && characterUpper !== character;
      isLastCharUpper = characterUpper === character && characterLower !== character;
    }
  }

  return value;
};

/**
 * Convert a string to the specified casing.
 *
 * @param value - The string to convert
 * @param casing - The target casing
 * @param options - Additional options
 * @returns The converted string
 */
export function toCase(
  value: string,
  casing: Casing | undefined,
  options: {
    /**
     * If leading separators have a semantic meaning, we might not want to
     * remove them.
     */
    stripLeadingSeparators?: boolean;
  } = {},
): string {
  const stripLeadingSeparators = options.stripLeadingSeparators ?? true;

  let result = value.trim();

  if (!result.length || !casing || casing === 'preserve') {
    return result;
  }

  if (result.length === 1) {
    separatorsRegExp.lastIndex = 0;
    if (separatorsRegExp.test(result)) {
      return '';
    }

    return casing === 'PascalCase' || casing === 'SCREAMING_SNAKE_CASE'
      ? result.toLocaleUpperCase()
      : result.toLocaleLowerCase();
  }

  const hasUpperCase = result !== result.toLocaleLowerCase();

  if (hasUpperCase) {
    result = preserveCase(result, casing);
  }

  if (stripLeadingSeparators || result[0] !== value[0]) {
    result = result.replace(leadingSeparatorsRegExp, '');
  }

  result =
    casing === 'SCREAMING_SNAKE_CASE' ? result.toLocaleUpperCase() : result.toLocaleLowerCase();

  if (casing === 'PascalCase') {
    result = `${result.charAt(0).toLocaleUpperCase()}${result.slice(1)}`;
  }

  if (casing === 'snake_case' || casing === 'SCREAMING_SNAKE_CASE') {
    result = result.replaceAll(separatorsAndIdentifierRegExp, (match, identifier, offset) => {
      if (offset === 0 && !stripLeadingSeparators) {
        return match;
      }
      return `_${identifier}`;
    });

    if (result[result.length - 1] === '_') {
      // strip trailing underscore
      result = result.slice(0, result.length - 1);
    }
  } else {
    separatorsAndIdentifierRegExp.lastIndex = 0;
    numbersAndIdentifierRegExp.lastIndex = 0;

    result = result.replaceAll(numbersAndIdentifierRegExp, (match, _, offset) => {
      if (['_', '-', '.'].includes(result.charAt(offset + match.length))) {
        return match;
      }

      return match.toLocaleUpperCase();
    });

    result = result.replaceAll(separatorsAndIdentifierRegExp, (match, identifier, offset) => {
      if (offset === 0 && !stripLeadingSeparators && match[0] && value.startsWith(match[0])) {
        return match;
      }
      return identifier.toLocaleUpperCase();
    });
  }

  return result;
}

/**
 * Normalize a NamingRule to NamingConfig.
 */
export function resolveNaming(rule: NamingRule | undefined): NamingConfig {
  if (!rule) {
    return {};
  }
  if (typeof rule === 'string' || typeof rule === 'function') {
    return { name: rule };
  }
  return rule;
}

/**
 * Apply naming configuration to a value.
 *
 * Casing is applied first, then transformation.
 */
export function applyNaming(value: string, config: NamingConfig): string {
  let result = value;

  const casing = config.casing ?? config.case;

  if (config.name) {
    if (typeof config.name === 'function') {
      result = config.name(result);
    } else {
      // TODO: refactor so there's no need for separators?
      const separator = !casing || casing === 'preserve' ? '' : '-';
      result = config.name.replace('{{name}}', `${separator}${result}${separator}`);
    }
  }

  // TODO: apply case before name?
  return toCase(result, casing);
}
