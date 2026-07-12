import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsDeleteExpression extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.DeleteExpression;
}

export function createDeleteExpression(expression: TsExpression): TsDeleteExpression {
  return {
    expression,
    kind: TsNodeKind.DeleteExpression,
  };
}
