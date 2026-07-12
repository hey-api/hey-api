import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { SyntaxKind } from '../syntax-kind';
import type { TsTypeNode } from '../type';

export interface TsTypeOperatorNode extends TsNodeBase {
  kind: TsNodeKind.TypeOperator;
  operator: SyntaxKind;
  type: TsTypeNode;
}

export function createTypeOperatorNode(operator: SyntaxKind, type: TsTypeNode): TsTypeOperatorNode {
  return {
    kind: TsNodeKind.TypeOperator,
    operator,
    type,
  };
}
