import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsStatement } from '../statement';
import type { TsToken } from '../token';
import type { TsForInitializer } from './for-initializer';

export interface TsForOfStatement extends TsNodeBase {
  awaitModifier?: TsToken;
  expression: TsExpression;
  initializer: TsForInitializer;
  kind: TsNodeKind.ForOfStatement;
  statement: TsStatement;
}

export function createForOfStatement(
  awaitModifier: TsToken | undefined,
  initializer: TsForInitializer,
  expression: TsExpression,
  statement: TsStatement,
): TsForOfStatement {
  return {
    awaitModifier,
    expression,
    initializer,
    kind: TsNodeKind.ForOfStatement,
    statement,
  };
}
