import type { TsNodeBase } from '../base';
import type { TsEntityName } from '../expressions/qualified-name';
import { TsNodeKind } from '../kinds';
import type { TsTypeNode } from '../type';

export interface TsTypeReferenceNode extends TsNodeBase {
  kind: TsNodeKind.TypeReference;
  typeArguments?: ReadonlyArray<TsTypeNode>;
  typeName: string | TsEntityName;
}

export function createTypeReferenceNode(
  typeName: string | TsEntityName,
  typeArguments?: ReadonlyArray<TsTypeNode>,
): TsTypeReferenceNode {
  return {
    kind: TsNodeKind.TypeReference,
    typeArguments,
    typeName,
  };
}
