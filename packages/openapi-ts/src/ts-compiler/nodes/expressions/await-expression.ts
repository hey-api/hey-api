import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsAwaitExpression extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.AwaitExpression;
}

export function createAwaitExpression(expression: TsExpression): TsAwaitExpression {
  return {
    expression,
    kind: TsNodeKind.AwaitExpression,
  };
}
