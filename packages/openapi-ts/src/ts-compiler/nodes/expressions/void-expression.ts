import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsVoidExpression extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.VoidExpression;
}

export function createVoidExpression(expression: TsExpression): TsVoidExpression {
  return {
    expression,
    kind: TsNodeKind.VoidExpression,
  };
}
