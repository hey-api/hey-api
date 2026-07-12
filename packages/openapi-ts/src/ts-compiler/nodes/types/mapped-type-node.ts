import type { TsNodeBase } from '../base';
import type { TsTypeElement } from '../declarations/type-element';
import type { TsTypeParameterDeclaration } from '../declarations/type-parameter-declaration';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';

export interface TsMappedTypeNode extends TsNodeBase {
  kind: TsNodeKind.MappedType;
  members?: ReadonlyArray<TsTypeElement>;
  nameType?: TsTypeNode;
  questionToken?: TsToken;
  readonlyToken?: TsToken;
  type?: TsTypeNode;
  typeParameter: TsTypeParameterDeclaration;
}

export function createMappedTypeNode(
  readonlyToken: TsToken | undefined,
  typeParameter: TsTypeParameterDeclaration,
  nameType: TsTypeNode | undefined,
  questionToken: TsToken | undefined,
  type: TsTypeNode | undefined,
  members: ReadonlyArray<TsTypeElement> | undefined,
): TsMappedTypeNode {
  return {
    kind: TsNodeKind.MappedType,
    members,
    nameType,
    questionToken,
    readonlyToken,
    type,
    typeParameter,
  };
}
