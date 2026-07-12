import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import { createNumericLiteral } from './numeric-literal';

export interface TsElementAccessExpression extends TsNodeBase {
  argumentExpression: TsExpression;
  expression: TsExpression;
  kind: TsNodeKind.ElementAccessExpression;
  questionDotToken?: TsToken;
}

export function createElementAccessExpression(
  expression: TsExpression,
  index: number | TsExpression,
): TsElementAccessExpression {
  return {
    argumentExpression: typeof index === 'number' ? createNumericLiteral(index) : index,
    expression,
    kind: TsNodeKind.ElementAccessExpression,
  };
}

export function createElementAccessChain(
  expression: TsExpression,
  questionDotToken: TsToken | undefined,
  index: number | TsExpression,
): TsElementAccessExpression {
  return {
    argumentExpression: typeof index === 'number' ? createNumericLiteral(index) : index,
    expression,
    kind: TsNodeKind.ElementAccessExpression,
    questionDotToken,
  };
}
