import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsNonNullExpression extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.NonNullExpression;
}

export function createNonNullExpression(expression: TsExpression): TsNonNullExpression {
  return {
    expression,
    kind: TsNodeKind.NonNullExpression,
  };
}
