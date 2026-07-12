import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsSpreadAssignment extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.SpreadAssignment;
}

export function createSpreadAssignment(expression: TsExpression): TsSpreadAssignment {
  return {
    expression,
    kind: TsNodeKind.SpreadAssignment,
  };
}
