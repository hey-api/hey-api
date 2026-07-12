import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import { createIdentifier } from './identifier';

export interface TsPropertyAccessExpression extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.PropertyAccessExpression;
  name: TsExpression;
  questionDotToken?: TsToken;
}

export function createPropertyAccessExpression(
  expression: TsExpression,
  name: string | TsExpression,
): TsPropertyAccessExpression {
  return {
    expression,
    kind: TsNodeKind.PropertyAccessExpression,
    name: typeof name === 'string' ? createIdentifier(name) : name,
  };
}

export function createPropertyAccessChain(
  expression: TsExpression,
  questionDotToken: TsToken | undefined,
  name: string | TsExpression,
): TsPropertyAccessExpression {
  return {
    expression,
    kind: TsNodeKind.PropertyAccessExpression,
    name: typeof name === 'string' ? createIdentifier(name) : name,
    questionDotToken,
  };
}
