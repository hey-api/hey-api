import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';

export interface TsDoStatement extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.DoStatement;
  statement: TsStatement;
}

export function createDoStatement(statement: TsStatement, expression: TsExpression): TsDoStatement {
  return {
    expression,
    kind: TsNodeKind.DoStatement,
    statement,
  };
}
