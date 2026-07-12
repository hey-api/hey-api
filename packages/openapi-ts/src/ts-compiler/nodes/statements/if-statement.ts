import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';

export interface TsIfStatement extends TsNodeBase {
  elseStatement?: TsStatement;
  expression: TsExpression;
  kind: TsNodeKind.IfStatement;
  thenStatement: TsStatement;
}

export function createIfStatement(
  expression: TsExpression,
  thenStatement: TsStatement,
  elseStatement?: TsStatement,
): TsIfStatement {
  return {
    elseStatement,
    expression,
    kind: TsNodeKind.IfStatement,
    thenStatement,
  };
}
