import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsSatisfiesExpression extends TsNodeBase {
  expression: TsExpression;
  kind: TsNodeKind.SatisfiesExpression;
  type: TsTypeNode;
}

export function createSatisfiesExpression(
  expression: TsExpression,
  type: TsTypeNode,
): TsSatisfiesExpression {
  return {
    expression,
    kind: TsNodeKind.SatisfiesExpression,
    type,
  };
}
