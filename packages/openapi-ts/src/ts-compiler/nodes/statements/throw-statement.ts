import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsThrowStatement extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.ThrowStatement;
}

export function createThrowStatement(expression: TsExpression): TsThrowStatement {
  return {
    expression,
    kind: TsNodeKind.ThrowStatement,
  };
}
