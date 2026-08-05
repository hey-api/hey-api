import type { TsNode, TsNodeBase } from '../base';
import type { TsEntityName } from '../expressions/qualified-name';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsImportTypeNode extends TsNodeBase {
  argument: TsTypeNode;
  attributes?: TsNode;
  isTypeOf: boolean;
  kind: TsNodeKind.ImportType;
  qualifier?: TsEntityName;
  typeArguments?: ReadonlyArray<TsTypeNode>;
}

export function createImportTypeNode(
  argument: TsTypeNode,
  attributes: TsNode | undefined,
  qualifier: TsEntityName | undefined,
  typeArguments: ReadonlyArray<TsTypeNode> | undefined,
  isTypeOf: boolean = false,
): TsImportTypeNode {
  return {
    argument,
    attributes,
    isTypeOf,
    kind: TsNodeKind.ImportType,
    qualifier,
    typeArguments,
  };
}
