import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsParenthesizedTypeNode extends TsNodeBase {
  kind: TsNodeKind.ParenthesizedType;
  type: TsTypeNode;
}

export function createParenthesizedType(type: TsTypeNode): TsParenthesizedTypeNode {
  return {
    kind: TsNodeKind.ParenthesizedType,
    type,
  };
}
