import { coerce } from '../../normalize/coerce';
import { defineConfig } from '../../normalize/config';
import type { EnumsMode, Parser, UserParser } from './types';

export const defaultPaginationKeywords = [
  'after',
  'before',
  'cursor',
  'offset',
  'page',
  'start',
] as const;

export const parserConfig = defineConfig<UserParser, Parser>({
  content: {
    preferred: coerce((value): Parser['content']['preferred'] => {
      if (Array.isArray(value)) {
        const preference = value as Parser['content']['preferred']['requests'];
        return { parameters: preference, requests: preference, responses: preference };
      }
      return (value as Parser['content']['preferred'] | undefined) ?? {};
    }),
  },
  hooks: {},
  pagination: {
    keywords: defaultPaginationKeywords,
  },
  transforms: {
    enums: {
      $coerce: {
        string: (mode) => ({ mode: mode as EnumsMode }),
      },
      $coerceAny: ({ value }) => ({ enabled: Boolean(value) }),
      case: 'PascalCase',
      enabled: false,
      mode: 'root',
      name: '{{name}}Enum',
    },
    propertiesRequiredByDefault: false,
    readWrite: {
      $coerceAny: ({ value }) => ({ enabled: Boolean(value) }),
      enabled: true,
      requests: {
        $coerce: {
          function: (name) => ({ name }),
          string: (name) => ({ name }),
        },
        case: 'preserve',
        name: '{{name}}Writable',
      },
      responses: {
        $coerce: {
          function: (name) => ({ name }),
          string: (name) => ({ name }),
        },
        case: 'preserve',
        name: '{{name}}',
      },
    },
  },
  validate_EXPERIMENTAL: coerce((value) => (value === true ? 'warn' : value || false)),
});

export function getParser(input: { parser?: UserParser }): Parser {
  return parserConfig(input.parser ?? {});
}
