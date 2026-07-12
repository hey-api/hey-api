import type { ts } from '../../ts-compiler';
import type { TsDsl } from '../base';
import { IdTsDsl } from '../expr/id';
import { LiteralTsDsl } from '../expr/literal';
import { regexp } from './regexp';
import type { ReservedList } from './reserved';
import { reserved } from './reserved';

export const safeAccessorName = (name: string): string => {
  regexp.number.lastIndex = 0;
  if (regexp.number.test(name)) {
    return name.startsWith('-') ? `'${name}'` : name;
  }

  regexp.typeScriptIdentifier.lastIndex = 0;
  if (regexp.typeScriptIdentifier.test(name)) {
    return name;
  }
  return `'${name}'`;
};

export const safeMemberName = (name: string): TsDsl<ts.StringLiteral> | IdTsDsl => {
  regexp.typeScriptIdentifier.lastIndex = 0;
  if (regexp.typeScriptIdentifier.test(name)) {
    return new IdTsDsl(name);
  }
  return new LiteralTsDsl(name) as TsDsl<ts.StringLiteral>;
};

export const safePropName = (
  name: string,
): TsDsl<ts.StringLiteral | ts.NumericLiteral> | IdTsDsl => {
  regexp.number.lastIndex = 0;
  if (regexp.number.test(name)) {
    return name.startsWith('-')
      ? (new LiteralTsDsl(name) as TsDsl<ts.StringLiteral>)
      : (new LiteralTsDsl(Number(name)) as TsDsl<ts.NumericLiteral>);
  }

  regexp.typeScriptIdentifier.lastIndex = 0;
  if (regexp.typeScriptIdentifier.test(name)) {
    return new IdTsDsl(name);
  }

  return new LiteralTsDsl(name) as TsDsl<ts.StringLiteral>;
};

const validTypeScriptChar = /^[\u200c\u200d\p{ID_Continue}]$/u;

const safeName = (name: string, reserved: ReservedList): string => {
  let sanitized = '';
  let index: number;

  const first = name[0] ?? '';
  regexp.illegalStartCharacters.lastIndex = 0;
  if (regexp.illegalStartCharacters.test(first)) {
    // Check if character becomes valid when not in leading position (e.g., digits)
    if (validTypeScriptChar.test(first)) {
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
    sanitized += validTypeScriptChar.test(char) ? char : '_';
    index += 1;
  }

  if (reserved['~values'].has(sanitized)) {
    sanitized = `${sanitized}_`;
  }

  return sanitized || '_';
};

export const safeRuntimeName = (name: string): string => safeName(name, reserved.runtime);

export const safeTypeName = (name: string): string => safeName(name, reserved.type);
