import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsArrayTypeNode extends TsNodeBase {
  elementType: TsTypeNode;
  kind: TsNodeKind.ArrayType;
}

export function createArrayTypeNode(elementType: TsTypeNode): TsArrayTypeNode {
  return {
    elementType,
    kind: TsNodeKind.ArrayType,
  };
}
