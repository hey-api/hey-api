import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsConditionalTypeNode extends TsNodeBase {
  checkType: TsTypeNode;
  extendsType: TsTypeNode;
  falseType: TsTypeNode;
  kind: TsNodeKind.ConditionalType;
  trueType: TsTypeNode;
}

export function createConditionalTypeNode(
  checkType: TsTypeNode,
  extendsType: TsTypeNode,
  trueType: TsTypeNode,
  falseType: TsTypeNode,
): TsConditionalTypeNode {
  return {
    checkType,
    extendsType,
    falseType,
    kind: TsNodeKind.ConditionalType,
    trueType,
  };
}
