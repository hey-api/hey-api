import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';
import type { TsForInitializer } from './for-initializer';

export interface TsForStatement extends TsNodeBase {
  condition?: TsExpression;
  incrementor?: TsExpression;
  initializer?: TsForInitializer;
  kind: TsNodeKind.ForStatement;
  statement: TsStatement;
}

export function createForStatement(
  initializer: TsForInitializer | undefined,
  condition: TsExpression | undefined,
  incrementor: TsExpression | undefined,
  statement: TsStatement,
): TsForStatement {
  return {
    condition,
    incrementor,
    initializer,
    kind: TsNodeKind.ForStatement,
    statement,
  };
}
