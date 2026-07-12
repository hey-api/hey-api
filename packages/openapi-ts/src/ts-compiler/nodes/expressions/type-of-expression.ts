import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsTypeOfExpression extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.TypeOfExpression;
}

export function createTypeOfExpression(expression: TsExpression): TsTypeOfExpression {
  return {
    expression,
    kind: TsNodeKind.TypeOfExpression,
  };
}
