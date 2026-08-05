import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsOptionalTypeNode extends TsNodeBase {
  kind: TsNodeKind.OptionalType;
  type: TsTypeNode;
}

export function createOptionalTypeNode(type: TsTypeNode): TsOptionalTypeNode {
  return {
    kind: TsNodeKind.OptionalType,
    type,
  };
}
