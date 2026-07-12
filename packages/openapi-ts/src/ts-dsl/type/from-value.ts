import { isNode } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { TsDsl } from '../base';
import { TypeLiteralTsDsl } from './literal';
import { TypeObjectTsDsl } from './object';
import { TypeTupleTsDsl } from './tuple';

export const fromValue = (input: unknown): TsDsl<ts.TypeNode> => {
  if (isNode(input)) {
    return input as TsDsl<ts.TypeNode>;
  }

  if (input === null) {
    return new TypeLiteralTsDsl(input);
  }

  if (
    typeof input === 'number' ||
    typeof input === 'boolean' ||
    typeof input === 'string' ||
    typeof input === 'bigint'
  ) {
    return new TypeLiteralTsDsl(input);
  }

  if (input instanceof Array) {
    const arr = new TypeTupleTsDsl(...input.map((v) => fromValue(v)));
    return arr;
  }

  if (typeof input === 'object') {
    const obj = new TypeObjectTsDsl();
    for (const [key, val] of Object.entries(input)) {
      const type = fromValue(val);
      obj.prop(key, (p) => p.type(type));
    }
    return obj;
  }

  throw new Error(`$.type.fromValue(): Unsupported input type ${String(input)}`);
};
