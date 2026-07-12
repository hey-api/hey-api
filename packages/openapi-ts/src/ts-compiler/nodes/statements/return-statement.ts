import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsReturnStatement extends TsNodeBase {
  expression?: TsExpression;
  kind: TsNodeKind.ReturnStatement;
}

export function createReturnStatement(expression?: TsExpression): TsReturnStatement {
  return {
    expression,
    kind: TsNodeKind.ReturnStatement,
  };
}
