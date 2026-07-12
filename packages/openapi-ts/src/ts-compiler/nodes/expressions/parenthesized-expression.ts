import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsParenthesizedExpression extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.ParenthesizedExpression;
}

export function createParenthesizedExpression(expression: TsExpression): TsParenthesizedExpression {
  return {
    expression,
    kind: TsNodeKind.ParenthesizedExpression,
  };
}
