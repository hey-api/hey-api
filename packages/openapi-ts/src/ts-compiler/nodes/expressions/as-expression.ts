import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsAsExpression extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.AsExpression;
  type: TsTypeNode;
}

export function createAsExpression(expression: TsExpression, type: TsTypeNode): TsAsExpression {
  return {
    expression,
    kind: TsNodeKind.AsExpression,
    type,
  };
}
