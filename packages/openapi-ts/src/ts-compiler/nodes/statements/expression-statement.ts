import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsExpressionStatement extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.ExpressionStatement;
}

export function createExpressionStatement(expression: TsExpression): TsExpressionStatement {
  return {
    expression,
    kind: TsNodeKind.ExpressionStatement,
  };
}
