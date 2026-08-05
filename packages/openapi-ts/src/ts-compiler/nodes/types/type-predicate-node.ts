import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';

export interface TsTypePredicateNode extends TsNodeBase {
  assertsModifier?: TsToken;
  kind: TsNodeKind.TypePredicate;
  parameterName: string | TsIdentifier;
  type?: TsTypeNode;
}

export function createTypePredicateNode(
  assertsModifier: TsToken | undefined,
  parameterName: string | TsIdentifier,
  type: TsTypeNode | undefined,
): TsTypePredicateNode {
  return {
    assertsModifier,
    kind: TsNodeKind.TypePredicate,
    parameterName,
    type,
  };
}
