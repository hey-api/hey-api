import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsIndexedAccessTypeNode extends TsNodeBase {
  indexType: TsTypeNode;
  kind: TsNodeKind.IndexedAccessType;
  objectType: TsTypeNode;
}

export function createIndexedAccessTypeNode(
  objectType: TsTypeNode,
  indexType: TsTypeNode,
): TsIndexedAccessTypeNode {
  return {
    indexType,
    kind: TsNodeKind.IndexedAccessType,
    objectType,
  };
}
