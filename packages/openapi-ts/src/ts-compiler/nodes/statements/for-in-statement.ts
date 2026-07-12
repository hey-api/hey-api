import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';
import type { TsForInitializer } from './for-initializer';

export interface TsForInStatement extends TsNodeBase {
  expression: TsExpression;
  initializer: TsForInitializer;
  kind: TsNodeKind.ForInStatement;
  statement: TsStatement;
}

export function createForInStatement(
  initializer: TsForInitializer,
  expression: TsExpression,
  statement: TsStatement,
): TsForInStatement {
  return {
    expression,
    initializer,
    kind: TsNodeKind.ForInStatement,
    statement,
  };
}
