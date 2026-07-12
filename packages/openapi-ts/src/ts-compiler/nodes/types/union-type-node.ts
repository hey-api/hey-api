import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsUnionTypeNode extends TsNodeBase {
  kind: TsNodeKind.UnionType;
  types: ReadonlyArray<TsTypeNode>;
}

export function createUnionTypeNode(types: ReadonlyArray<TsTypeNode>): TsUnionTypeNode {
  return {
    kind: TsNodeKind.UnionType,
    types,
  };
}
