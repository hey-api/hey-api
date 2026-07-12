import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsRestTypeNode extends TsNodeBase {
  kind: TsNodeKind.RestType;
  type: TsTypeNode;
}

export function createRestTypeNode(type: TsTypeNode): TsRestTypeNode {
  return {
    kind: TsNodeKind.RestType,
    type,
  };
}
