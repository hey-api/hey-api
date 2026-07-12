import type { TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import type { TsToken } from '../token';
import type { TsTypeNode } from '../type';
import type { TsTypeParameterDeclaration } from './type-parameter-declaration';

export interface TsTypeAliasDeclaration extends TsNodeBase {
  kind: TsNodeKind.TypeAliasDeclaration;
  modifiers?: ReadonlyArray<TsToken>;
  name: string | TsIdentifier;
  type: TsTypeNode;
  typeParameters?: ReadonlyArray<TsTypeParameterDeclaration>;
}

export function createTypeAliasDeclaration(
  modifiers: ReadonlyArray<TsToken> | undefined,
  name: string | TsIdentifier,
  typeParameters: ReadonlyArray<TsTypeParameterDeclaration> | undefined,
  type: TsTypeNode,
): TsTypeAliasDeclaration {
  return {
    kind: TsNodeKind.TypeAliasDeclaration,
    modifiers,
    name,
    type,
    typeParameters,
  };
}
