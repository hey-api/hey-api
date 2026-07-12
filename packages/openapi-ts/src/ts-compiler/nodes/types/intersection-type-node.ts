import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsIntersectionTypeNode extends TsNodeBase {
  kind: TsNodeKind.IntersectionType;
  types: ReadonlyArray<TsTypeNode>;
}

export function createIntersectionTypeNode(
  types: ReadonlyArray<TsTypeNode>,
): TsIntersectionTypeNode {
  return {
    kind: TsNodeKind.IntersectionType,
    types,
  };
}
