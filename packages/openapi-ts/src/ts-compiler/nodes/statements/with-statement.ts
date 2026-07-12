import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';

export interface TsWithStatement extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.WithStatement;
  statement: TsStatement;
}

export function createWithStatement(
  expression: TsExpression,
  statement: TsStatement,
): TsWithStatement {
  return {
    expression,
    kind: TsNodeKind.WithStatement,
    statement,
  };
}
