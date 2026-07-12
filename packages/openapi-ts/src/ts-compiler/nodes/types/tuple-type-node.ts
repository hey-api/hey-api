import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';
import type { TsNamedTupleMember } from './named-tuple-member';

export interface TsTupleTypeNode extends TsNodeBase {
  elements: ReadonlyArray<TsNamedTupleMember | TsTypeNode>;
  kind: TsNodeKind.TupleType;
}

export function createTupleTypeNode(
  elements: ReadonlyArray<TsNamedTupleMember | TsTypeNode>,
): TsTupleTypeNode {
  return {
    elements,
    kind: TsNodeKind.TupleType,
  };
}
