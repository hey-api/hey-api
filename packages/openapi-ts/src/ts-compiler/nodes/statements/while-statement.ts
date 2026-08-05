import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';

export interface TsWhileStatement extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.WhileStatement;
  statement: TsStatement;
}

export function createWhileStatement(
  expression: TsExpression,
  statement: TsStatement,
): TsWhileStatement {
  return {
    expression,
    kind: TsNodeKind.WhileStatement,
    statement,
  };
}
