import type { TsNodeBase } from '../base';
import type { TsExpression } from '../expression';
import { TsNodeKind } from '../kinds';

export interface TsLiteralTypeNode extends TsNodeBase {
  kind: TsNodeKind.LiteralType;
  literal: TsExpression;
}

export function createLiteralTypeNode(literal: TsExpression): TsLiteralTypeNode {
  return {
    kind: TsNodeKind.LiteralType,
    literal,
  };
}
